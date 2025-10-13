#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy to OCI Container Instances (full Next.js app with SSR)
#>

param(
    [string]$InstanceName = "comsats-frontend"
)

$ErrorActionPreference = 'Stop'

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  Deploying Full Next.js App to OCI Container Instances        ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Get OCI details from config
Write-Host "`n[1/8] Reading OCI configuration..." -ForegroundColor Yellow
$config = Get-Content "$env:USERPROFILE\.oci\config" | Out-String
if ($config -match 'tenancy\s*=\s*(\S+)') { $CompartmentId = $matches[1] }
if ($config -match 'region\s*=\s*(\S+)') { $Region = $matches[1] }
$Namespace = oci os ns get --query 'data' --raw-output

Write-Host "  Region: $Region" -ForegroundColor Cyan
Write-Host "  Namespace: $Namespace" -ForegroundColor Cyan
Write-Host "  Compartment: $CompartmentId" -ForegroundColor Cyan

# Build Docker image locally
Write-Host "`n[2/8] Building Docker container..." -ForegroundColor Yellow

$ImageTag = "comsats-app:$(git rev-parse --short HEAD 2>$null || echo 'latest')"
$FullImageName = "$Region.ocir.io/$Namespace/$ImageTag"

Write-Host "  Image: $FullImageName" -ForegroundColor Cyan

# Create Dockerfile if needed
if (-not (Test-Path "Dockerfile")) {
    Write-Host "  Creating Dockerfile..." -ForegroundColor Yellow
    @"
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
"@ | Out-File -FilePath "Dockerfile" -Encoding UTF8
}

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "  Docker not found. Please install Docker Desktop." -ForegroundColor Red
    Write-Host "  Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Build
Write-Host "  Building with Docker..." -ForegroundColor Cyan
docker build -t $ImageTag -t $FullImageName .
if ($LASTEXITCODE -ne 0) {
    throw "Docker build failed"
}

# Push to OCI Registry
Write-Host "`n[3/8] Pushing to OCI Container Registry..." -ForegroundColor Yellow
Write-Host "  Pushing $FullImageName..." -ForegroundColor Cyan

docker push $FullImageName
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nDocker push failed. You may need to login first:" -ForegroundColor Red
    Write-Host "  docker login $Region.ocir.io -u $Namespace/<your-email>" -ForegroundColor Yellow
    Write-Host "`nGenerate an auth token at:" -ForegroundColor Yellow
    Write-Host "  https://cloud.oracle.com/identity/domains/my-profile/api-keys" -ForegroundColor Cyan
    exit 1
}

# Get or create VCN
Write-Host "`n[4/8] Checking network configuration..." -ForegroundColor Yellow
$Vcns = oci network vcn list --compartment-id $CompartmentId --query 'data[*].id' --raw-output 2>$null

if (-not $Vcns) {
    Write-Host "  Creating VCN..." -ForegroundColor Cyan
    $VcnId = oci network vcn create --compartment-id $CompartmentId --display-name "comsats-vcn" --cidr-block "10.0.0.0/16" --dns-label "comsats" --query 'data.id' --raw-output --wait-for-state AVAILABLE
    
    $IgwId = oci network internet-gateway create --compartment-id $CompartmentId --vcn-id $VcnId --is-enabled true --display-name "comsats-igw" --query 'data.id' --raw-output --wait-for-state AVAILABLE
    
    $RtId = oci network vcn get --vcn-id $VcnId --query 'data."default-route-table-id"' --raw-output
    oci network route-table update --rt-id $RtId --route-rules "[{`"destination`":`"0.0.0.0/0`",`"destinationType`":`"CIDR_BLOCK`",`"networkEntityId`":`"$IgwId`"}]" --force | Out-Null
    
    $SlId = oci network vcn get --vcn-id $VcnId --query 'data."default-security-list-id"' --raw-output
    oci network security-list update --security-list-id $SlId --ingress-security-rules '[{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":3000,"max":3000}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}}]' --force | Out-Null
    
    $SubnetId = oci network subnet create --compartment-id $CompartmentId --vcn-id $VcnId --display-name "comsats-subnet" --cidr-block "10.0.1.0/24" --dns-label "public" --query 'data.id' --raw-output --wait-for-state AVAILABLE
    
    Write-Host "  ✓ Network created" -ForegroundColor Green
} else {
    $VcnId = ($Vcns -split "`n")[0]
    $SubnetId = oci network subnet list --compartment-id $CompartmentId --vcn-id $VcnId --query 'data[0].id' --raw-output
    Write-Host "  ✓ Using existing network" -ForegroundColor Green
}

# Clean up old instances
Write-Host "`n[5/8] Cleaning up old instances..." -ForegroundColor Yellow
$OldInstances = oci container-instances container-instance list --compartment-id $CompartmentId --display-name $InstanceName --query 'data.items[*].id' --raw-output 2>$null

if ($OldInstances) {
    foreach ($OldId in ($OldInstances -split "`n")) {
        if ($OldId) {
            Write-Host "  Terminating $OldId..." -ForegroundColor Cyan
            oci container-instances container-instance delete --container-instance-id $OldId --force --wait-for-state TERMINATED 2>$null | Out-Null
        }
    }
}

# Get availability domain
Write-Host "`n[6/8] Getting availability domain..." -ForegroundColor Yellow
$AvailabilityDomain = oci iam availability-domain list --compartment-id $CompartmentId --query 'data[0].name' --raw-output

# Create new container instance
Write-Host "`n[7/8] Creating container instance..." -ForegroundColor Yellow
Write-Host "  This may take 3-5 minutes..." -ForegroundColor Cyan

$CreateResponse = oci container-instances container-instance create `
    --compartment-id $CompartmentId `
    --display-name $InstanceName `
    --availability-domain $AvailabilityDomain `
    --shape "CI.Standard.E4.Flex" `
    --shape-config '{"ocpus":1.0,"memory-in-gbs":2.0}' `
    --vnics "[{`"subnet-id`":`"$SubnetId`",`"is-public-ip-assigned`":true}]" `
    --containers "[{`"display-name`":`"app`",`"image-url`":`"$FullImageName`",`"environment-variables`":{`"NODE_ENV`":`"production`"},`"resource-config`":{`"memory-limit-in-gbs`":2.0,`"vcpus-limit`":1.0}}]" `
    --wait-for-state ACTIVE `
    --wait-for-state FAILED 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "  Deployment failed. Error:" -ForegroundColor Red
    Write-Host $CreateResponse -ForegroundColor Red
    exit 1
}

# Get public IP
Write-Host "`n[8/8] Getting deployment info..." -ForegroundColor Yellow
$ResponseJson = $CreateResponse | ConvertFrom-Json
$InstanceId = $ResponseJson.data.id
$PublicIp = $ResponseJson.data.vnics[0].'public-ip'

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  🎉 Deployment Successful!                                     ║
╚════════════════════════════════════════════════════════════════╝

Your Next.js app is now live!

📍 Access URLs:
   http://${PublicIp}:3000
   
🔍 Instance Details:
   Instance ID: $InstanceId
   Region: $Region
   Shape: CI.Standard.E4.Flex (1 OCPU, 2GB RAM)
   
💡 Next steps:
   1. Visit your app at the URL above
   2. Set up a load balancer for production
   3. Configure custom domain and SSL
   
📊 Monitor logs:
   oci logging-search search-logs --search-query "search \"$CompartmentId\""

"@ -ForegroundColor Cyan

# Try to open in browser
Write-Host "Opening in browser..." -ForegroundColor Yellow
Start-Process "http://${PublicIp}:3000"

Write-Host "`nDeployment completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green
