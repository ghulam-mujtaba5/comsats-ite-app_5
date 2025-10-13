#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated deployment to OCI using GitHub CLI + OCI CLI (Vercel-style continuous deployment)

.DESCRIPTION
    This script provides Vercel-like continuous deployment using:
    - GitHub CLI to fetch latest code
    - OCI CLI to deploy to Container Instances
    - Automatic builds and deployments on push
    
.PARAMETER Mode
    Deploy mode: 'once' for single deployment, 'watch' for continuous deployment

.PARAMETER Branch
    Git branch to deploy (default: main)

.EXAMPLE
    .\deploy-to-oci.ps1 -Mode once
    .\deploy-to-oci.ps1 -Mode watch -Branch main
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('once', 'watch')]
    [string]$Mode = 'once',
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = 'main',
    
    [Parameter(Mandatory=$false)]
    [int]$WatchInterval = 60  # seconds between checks in watch mode
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot

# Configuration - Load from environment or .env file
$ConfigFile = Join-Path $RepoRoot '.env.deploy'
if (Test-Path $ConfigFile) {
    Write-Host "Loading config from $ConfigFile" -ForegroundColor Cyan
    Get-Content $ConfigFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

# Required environment variables
$RequiredVars = @(
    'OCI_COMPARTMENT_ID',
    'OCI_SUBNET_ID',
    'OCI_IMAGE_NAME',
    'OCI_SHAPE',
    'OCI_REGION'
)

$MissingVars = $RequiredVars | Where-Object { -not $env:$_ }
if ($MissingVars) {
    Write-Error "Missing required environment variables: $($MissingVars -join ', ')`nCreate .env.deploy file or set them manually."
    exit 1
}

# Functions
function Write-Log {
    param([string]$Message, [string]$Level = 'Info')
    $Colors = @{
        'Info' = 'White'
        'Success' = 'Green'
        'Warning' = 'Yellow'
        'Error' = 'Red'
    }
    $Timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Write-Host "[$Timestamp] [$Level] $Message" -ForegroundColor $Colors[$Level]
}

function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    # Check GitHub CLI
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw "GitHub CLI (gh) not found. Install from https://cli.github.com/"
    }
    
    # Check OCI CLI
    if (-not (Get-Command oci -ErrorAction SilentlyContinue)) {
        throw "OCI CLI not found. Run: iwr https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.ps1 -useb | iex"
    }
    
    # Check Docker (for building container images)
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Log "Docker not found. Will attempt OCI Cloud Shell build." -Level Warning
    }
    
    # Verify OCI CLI is configured
    try {
        oci iam region list --query 'data[0].name' --raw-output | Out-Null
    } catch {
        throw "OCI CLI not configured. Run: oci setup config"
    }
    
    # Verify GitHub CLI is authenticated
    try {
        gh auth status | Out-Null
    } catch {
        throw "GitHub CLI not authenticated. Run: gh auth login"
    }
    
    Write-Log "All prerequisites met!" -Level Success
}

function Get-LatestCommit {
    param([string]$Branch)
    
    try {
        $Commit = gh api "repos/:owner/:repo/commits/$Branch" --jq '.sha' 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to fetch commit: $Commit"
        }
        return $Commit.Substring(0, 7)
    } catch {
        Write-Log "Error fetching latest commit: $_" -Level Error
        return $null
    }
}

function Build-ContainerImage {
    param([string]$CommitSha)
    
    Write-Log "Building container image for commit $CommitSha..."
    
    # Create Dockerfile if it doesn't exist
    $DockerfilePath = Join-Path $RepoRoot 'Dockerfile'
    if (-not (Test-Path $DockerfilePath)) {
        Write-Log "Creating production Dockerfile..." -Level Warning
        @"
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/standalone/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
"@ | Out-File -FilePath $DockerfilePath -Encoding UTF8
        Write-Log "Dockerfile created at $DockerfilePath" -Level Success
    }
    
    # Build using Docker (local) or OCI DevOps
    $ImageTag = "$env:OCI_IMAGE_NAME:$CommitSha"
    
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Log "Building with Docker locally..."
        docker build -t $ImageTag $RepoRoot
        if ($LASTEXITCODE -ne 0) {
            throw "Docker build failed"
        }
        
        # Push to OCI Container Registry
        Write-Log "Pushing to OCI Container Registry..."
        $RegistryEndpoint = "$env:OCI_REGION.ocir.io"
        $Namespace = oci os ns get --query 'data' --raw-output
        $FullImageName = "$RegistryEndpoint/$Namespace/$ImageTag"
        
        docker tag $ImageTag $FullImageName
        docker push $FullImageName
        
        return $FullImageName
    } else {
        Write-Log "Docker not available. Use OCI DevOps or Cloud Shell for builds." -Level Warning
        return $null
    }
}

function Deploy-ToOCI {
    param([string]$ImageName, [string]$CommitSha)
    
    Write-Log "Deploying to OCI Container Instances..."
    
    $ContainerName = "comsats-app-$CommitSha"
    $DisplayName = "COMSATS ITE App - $CommitSha"
    
    # Check if container instance already exists
    $ExistingInstance = oci container-instances container-instance list `
        --compartment-id $env:OCI_COMPARTMENT_ID `
        --display-name $DisplayName `
        --query 'data.items[0].id' `
        --raw-output 2>$null
    
    if ($ExistingInstance) {
        Write-Log "Updating existing container instance: $ExistingInstance"
        # For container instances, we need to delete and recreate
        Write-Log "Stopping old instance..."
        oci container-instances container-instance delete `
            --container-instance-id $ExistingInstance `
            --force `
            --wait-for-state TERMINATED
    }
    
    # Create new container instance
    Write-Log "Creating new container instance..."
    
    $CreateResponse = oci container-instances container-instance create `
        --compartment-id $env:OCI_COMPARTMENT_ID `
        --display-name $DisplayName `
        --availability-domain (oci iam availability-domain list --compartment-id $env:OCI_COMPARTMENT_ID --query 'data[0].name' --raw-output) `
        --shape $env:OCI_SHAPE `
        --shape-config '{"ocpus":1.0,"memory-in-gbs":1.0}' `
        --vnics "[{\"subnet-id\":\"$env:OCI_SUBNET_ID\",\"is-public-ip-assigned\":true}]" `
        --containers "[{
            \"display-name\":\"$ContainerName\",
            \"image-url\":\"$ImageName\",
            \"environment-variables\":{
                \"NODE_ENV\":\"production\",
                \"NEXT_TELEMETRY_DISABLED\":\"1\"
            },
            \"resource-config\":{
                \"memory-limit-in-gbs\":1.0,
                \"vcpus-limit\":1.0
            }
        }]" `
        --wait-for-state ACTIVE `
        --wait-for-state FAILED
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Deployment failed!" -Level Error
        return $false
    }
    
    # Get public IP
    $InstanceId = $CreateResponse | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty id
    $PublicIp = oci container-instances container-instance get `
        --container-instance-id $InstanceId `
        --query 'data.vnics[0]."public-ip"' `
        --raw-output
    
    Write-Log "Deployment successful!" -Level Success
    Write-Log "Public IP: $PublicIp" -Level Success
    Write-Log "Access at: http://${PublicIp}:3000" -Level Success
    
    return $true
}

function Watch-AndDeploy {
    param([string]$Branch)
    
    Write-Log "Starting continuous deployment watch on branch: $Branch" -Level Success
    Write-Log "Checking for changes every $WatchInterval seconds..."
    
    $LastDeployedCommit = $null
    
    while ($true) {
        try {
            $LatestCommit = Get-LatestCommit -Branch $Branch
            
            if ($LatestCommit -and ($LatestCommit -ne $LastDeployedCommit)) {
                Write-Log "New commit detected: $LatestCommit" -Level Success
                Write-Log "Starting deployment pipeline..."
                
                # Pull latest code
                Push-Location $RepoRoot
                try {
                    git fetch origin
                    git checkout $Branch
                    git pull origin $Branch
                } finally {
                    Pop-Location
                }
                
                # Build and deploy
                $ImageName = Build-ContainerImage -CommitSha $LatestCommit
                if ($ImageName) {
                    $Success = Deploy-ToOCI -ImageName $ImageName -CommitSha $LatestCommit
                    if ($Success) {
                        $LastDeployedCommit = $LatestCommit
                        Write-Log "Deployment completed for commit $LatestCommit" -Level Success
                    }
                } else {
                    Write-Log "Build failed, skipping deployment" -Level Error
                }
            } else {
                Write-Host "." -NoNewline
            }
            
            Start-Sleep -Seconds $WatchInterval
        } catch {
            Write-Log "Error in watch loop: $_" -Level Error
            Start-Sleep -Seconds $WatchInterval
        }
    }
}

# Main execution
try {
    Write-Log "=== OCI Continuous Deployment ===" -Level Success
    Write-Log "Mode: $Mode"
    Write-Log "Branch: $Branch"
    Write-Log ""
    
    Test-Prerequisites
    
    if ($Mode -eq 'watch') {
        Watch-AndDeploy -Branch $Branch
    } else {
        # Single deployment
        $LatestCommit = Get-LatestCommit -Branch $Branch
        if (-not $LatestCommit) {
            throw "Could not fetch latest commit"
        }
        
        Write-Log "Deploying commit: $LatestCommit"
        
        # Pull latest code
        Push-Location $RepoRoot
        try {
            git fetch origin
            git checkout $Branch
            git pull origin $Branch
        } finally {
            Pop-Location
        }
        
        $ImageName = Build-ContainerImage -CommitSha $LatestCommit
        if ($ImageName) {
            Deploy-ToOCI -ImageName $ImageName -CommitSha $LatestCommit
        }
    }
} catch {
    Write-Log "Fatal error: $_" -Level Error
    exit 1
}
