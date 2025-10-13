#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick setup wizard for OCI continuous deployment

.DESCRIPTION
    Interactive setup that configures everything needed for Vercel-style deployment
#>

$ErrorActionPreference = 'Stop'

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  OCI Continuous Deployment Setup Wizard                       ║
║  Vercel-style GitHub → Oracle Cloud deployment                ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Check prerequisites
Write-Host "`n[1/7] Checking prerequisites..." -ForegroundColor Yellow

$Prerequisites = @{
    'oci' = 'OCI CLI - Install from https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm'
    'gh' = 'GitHub CLI - Install from https://cli.github.com/'
    'docker' = 'Docker Desktop - Install from https://www.docker.com/products/docker-desktop/'
    'git' = 'Git - Install from https://git-scm.com/'
}

foreach ($cmd in $Prerequisites.Keys) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        Write-Host "  ✓ $cmd found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $cmd not found - $($Prerequisites[$cmd])" -ForegroundColor Red
        $MissingPrereq = $true
    }
}

if ($MissingPrereq) {
    Write-Host "`nPlease install missing prerequisites and run again." -ForegroundColor Red
    exit 1
}

# Authenticate GitHub
Write-Host "`n[2/7] Authenticating GitHub CLI..." -ForegroundColor Yellow
try {
    gh auth status 2>&1 | Out-Null
    Write-Host "  ✓ Already authenticated" -ForegroundColor Green
} catch {
    Write-Host "  Running: gh auth login" -ForegroundColor Cyan
    gh auth login
}

# Configure OCI
Write-Host "`n[3/7] Checking OCI CLI configuration..." -ForegroundColor Yellow
try {
    $Region = oci iam region list --query 'data[0].name' --raw-output 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ OCI CLI configured (Region: $Region)" -ForegroundColor Green
    } else {
        throw "Not configured"
    }
} catch {
    Write-Host "  Running: oci setup config" -ForegroundColor Cyan
    oci setup config
}

# Get OCI details
Write-Host "`n[4/7] Gathering OCI information..." -ForegroundColor Yellow

$Namespace = oci os ns get --query 'data' --raw-output
$Region = oci iam region-subscription list --query 'data[0]."region-name"' --raw-output
$Tenancy = oci iam tenancy get --tenancy-id (oci iam region-subscription list --query 'data[0]."tenancy-id"' --raw-output) --query 'data.name' --raw-output

Write-Host "  Namespace: $Namespace" -ForegroundColor Cyan
Write-Host "  Region: $Region" -ForegroundColor Cyan
Write-Host "  Tenancy: $Tenancy" -ForegroundColor Cyan

# List compartments
Write-Host "`n[5/7] Select compartment..." -ForegroundColor Yellow
$Compartments = oci iam compartment list --all --query 'data[*].{name:name, id:id}' | ConvertFrom-Json

Write-Host "`nAvailable compartments:"
for ($i = 0; $i -lt $Compartments.Count; $i++) {
    Write-Host "  [$i] $($Compartments[$i].name)" -ForegroundColor Cyan
}

$CompIndex = Read-Host "`nSelect compartment number (or press Enter for root/0)"
if ([string]::IsNullOrWhiteSpace($CompIndex)) { $CompIndex = 0 }
$CompartmentId = $Compartments[[int]$CompIndex].id

Write-Host "  Selected: $($Compartments[[int]$CompIndex].name)" -ForegroundColor Green

# Check/Create VCN
Write-Host "`n[6/7] Checking network configuration..." -ForegroundColor Yellow

$Vcns = oci network vcn list --compartment-id $CompartmentId --query 'data[*].{name:"display-name", id:id}' | ConvertFrom-Json

if ($Vcns.Count -eq 0) {
    Write-Host "  No VCN found. Creating one..." -ForegroundColor Yellow
    
    $VcnName = Read-Host "  VCN name (default: comsats-vcn)"
    if ([string]::IsNullOrWhiteSpace($VcnName)) { $VcnName = "comsats-vcn" }
    
    Write-Host "  Creating VCN with Internet Gateway and public subnet..." -ForegroundColor Cyan
    
    # Create VCN
    $VcnId = oci network vcn create `
        --compartment-id $CompartmentId `
        --display-name $VcnName `
        --cidr-block "10.0.0.0/16" `
        --dns-label "comsats" `
        --query 'data.id' --raw-output `
        --wait-for-state AVAILABLE
    
    # Create Internet Gateway
    $IgwId = oci network internet-gateway create `
        --compartment-id $CompartmentId `
        --vcn-id $VcnId `
        --is-enabled true `
        --display-name "$VcnName-igw" `
        --query 'data.id' --raw-output `
        --wait-for-state AVAILABLE
    
    # Update route table
    $RtId = oci network vcn get --vcn-id $VcnId --query 'data."default-route-table-id"' --raw-output
    oci network route-table update `
        --rt-id $RtId `
        --route-rules "[{`"destination`":`"0.0.0.0/0`",`"destinationType`":`"CIDR_BLOCK`",`"networkEntityId`":`"$IgwId`"}]" `
        --force | Out-Null
    
    # Update security list
    $SlId = oci network vcn get --vcn-id $VcnId --query 'data."default-security-list-id"' --raw-output
    oci network security-list update `
        --security-list-id $SlId `
        --ingress-security-rules '[{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":3000,"max":3000}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}}]' `
        --force | Out-Null
    
    # Create subnet
    $SubnetId = oci network subnet create `
        --compartment-id $CompartmentId `
        --vcn-id $VcnId `
        --display-name "$VcnName-public" `
        --cidr-block "10.0.1.0/24" `
        --dns-label "public" `
        --query 'data.id' --raw-output `
        --wait-for-state AVAILABLE
    
    Write-Host "  ✓ VCN created successfully" -ForegroundColor Green
} else {
    Write-Host "`nAvailable VCNs:"
    for ($i = 0; $i -lt $Vcns.Count; $i++) {
        Write-Host "  [$i] $($Vcns[$i].name)" -ForegroundColor Cyan
    }
    
    $VcnIndex = Read-Host "`nSelect VCN number (or press Enter for 0)"
    if ([string]::IsNullOrWhiteSpace($VcnIndex)) { $VcnIndex = 0 }
    $VcnId = $Vcns[[int]$VcnIndex].id
    
    # Get subnet from VCN
    $Subnets = oci network subnet list --compartment-id $CompartmentId --vcn-id $VcnId --query 'data[*].{name:"display-name", id:id}' | ConvertFrom-Json
    
    if ($Subnets.Count -eq 0) {
        Write-Host "  No subnets found. Please create one manually." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`nAvailable subnets:"
    for ($i = 0; $i -lt $Subnets.Count; $i++) {
        Write-Host "  [$i] $($Subnets[$i].name)" -ForegroundColor Cyan
    }
    
    $SubnetIndex = Read-Host "`nSelect subnet number (or press Enter for 0)"
    if ([string]::IsNullOrWhiteSpace($SubnetIndex)) { $SubnetIndex = 0 }
    $SubnetId = $Subnets[[int]$SubnetIndex].id
    
    Write-Host "  ✓ Using existing VCN and subnet" -ForegroundColor Green
}

# Docker registry authentication
Write-Host "`n[7/7] Configuring Docker for OCI Registry..." -ForegroundColor Yellow

$Username = Read-Host "  Enter your OCI username (format: $Namespace/your.email@example.com)"
if ([string]::IsNullOrWhiteSpace($Username)) {
    $Username = "$Namespace/$(whoami)"
}

Write-Host @"
  
  To authenticate Docker with OCI Registry, you need an Auth Token.
  
  Generate one at:
  https://cloud.oracle.com/identity/domains/my-profile/api-keys
  
  1. Click "Generate Token"
  2. Copy the token (you won't see it again!)
  3. Paste it below
"@ -ForegroundColor Yellow

$AuthToken = Read-Host "  Auth Token" -AsSecureString
$AuthTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($AuthToken))

Write-Host "  Logging in to Docker..." -ForegroundColor Cyan
echo $AuthTokenPlain | docker login "$Region.ocir.io" -u $Username --password-stdin

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Docker authenticated" -ForegroundColor Green
} else {
    Write-Host "  ✗ Docker authentication failed" -ForegroundColor Red
}

# Create .env.deploy
Write-Host "`n[8/7] Creating deployment configuration..." -ForegroundColor Yellow

$ImageName = Read-Host "  Container image name (default: comsats-ite-app)"
if ([string]::IsNullOrWhiteSpace($ImageName)) { $ImageName = "comsats-ite-app" }

$EnvContent = @"
# OCI Deployment Configuration
# Auto-generated by setup wizard on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

OCI_COMPARTMENT_ID=$CompartmentId
OCI_SUBNET_ID=$SubnetId
OCI_REGION=$Region
OCI_IMAGE_NAME=$ImageName
OCI_SHAPE=CI.Standard.E4.Flex

# Add your application environment variables below:
# DATABASE_URL=
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
"@

$EnvContent | Out-File -FilePath ".env.deploy" -Encoding UTF8

Write-Host "  ✓ Configuration saved to .env.deploy" -ForegroundColor Green

# Summary
Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  Setup Complete! 🎉                                            ║
╚════════════════════════════════════════════════════════════════╝

Your continuous deployment is ready to use!

Quick Start:
  1. One-time deploy:
     pwsh scripts/deploy-to-oci.ps1 -Mode once

  2. Watch mode (auto-deploy on push):
     pwsh scripts/deploy-to-oci.ps1 -Mode watch

Configuration saved to: .env.deploy

Next steps:
  - Review .env.deploy and add any app environment variables
  - Run your first deployment
  - Set up custom domain (see docs/DEPLOY_CONTINUOUS_OCI.md)

Documentation: docs/DEPLOY_CONTINUOUS_OCI.md

"@ -ForegroundColor Green
