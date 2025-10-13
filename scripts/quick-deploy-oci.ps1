#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick deploy Next.js to OCI Object Storage (static site)
    
.DESCRIPTION
    Deploys your Next.js app as static site to OCI Object Storage bucket
    Similar to Vercel's deployment but on Oracle Cloud
#>

param(
    [string]$BucketName = "comsats-ite-frontend"
)

$ErrorActionPreference = 'Stop'

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  Deploying to Oracle Cloud Infrastructure                     ║
║  Static Frontend Deployment                                   ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Get OCI details
Write-Host "`n[1/6] Getting OCI configuration..." -ForegroundColor Yellow
$Namespace = oci os ns get --query 'data' --raw-output
$Region = oci iam region-subscription list --query 'data[0]."region-name"' --raw-output
$CompartmentId = (Get-Content "$env:USERPROFILE\.oci\config" | Select-String 'tenancy\s*=\s*(\S+)').Matches.Groups[1].Value

Write-Host "  Region: $Region" -ForegroundColor Cyan
Write-Host "  Namespace: $Namespace" -ForegroundColor Cyan
Write-Host "  Bucket: $BucketName" -ForegroundColor Cyan

# Build Next.js app for static export
Write-Host "`n[2/6] Building Next.js application..." -ForegroundColor Yellow
$env:NEXT_OUTPUT = 'export'
$env:NEXT_TELEMETRY_DISABLED = '1'

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Cyan
    pnpm install --frozen-lockfile
}

Write-Host "  Building static export..." -ForegroundColor Cyan
pnpm run build

if (-not (Test-Path "out")) {
    throw "Static export failed - 'out' directory not found"
}

Write-Host "  ✓ Build completed successfully" -ForegroundColor Green

# Create/ensure bucket exists
Write-Host "`n[3/6] Setting up Object Storage bucket..." -ForegroundColor Yellow

$BucketExists = oci os bucket get --bucket-name $BucketName --namespace-name $Namespace 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Creating new bucket..." -ForegroundColor Cyan
    oci os bucket create `
        --compartment-id $CompartmentId `
        --name $BucketName `
        --public-access-type ObjectRead `
        --storage-tier Standard | Out-Null
} else {
    Write-Host "  Using existing bucket" -ForegroundColor Cyan
}

Write-Host "  ✓ Bucket ready" -ForegroundColor Green

# Upload files
Write-Host "`n[4/6] Uploading files to Object Storage..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Cyan

oci os object bulk-upload `
    --namespace-name $Namespace `
    --bucket-name $BucketName `
    --src-dir out `
    --overwrite `
    --no-follow-symlinks `
    --include "*" `
    --content-type "text/html" `
    2>&1 | Out-Null

# Set proper content types for specific files
Write-Host "  Setting content types..." -ForegroundColor Cyan

# Get all uploaded files
$Files = Get-ChildItem -Path out -Recurse -File

foreach ($File in $Files) {
    $RelPath = $File.FullName.Substring((Resolve-Path "out").Path.Length + 1).Replace('\', '/')
    
    $ContentType = switch -Regex ($File.Extension) {
        '\.html$' { 'text/html' }
        '\.css$' { 'text/css' }
        '\.js$' { 'application/javascript' }
        '\.json$' { 'application/json' }
        '\.png$' { 'image/png' }
        '\.jpg$|\.jpeg$' { 'image/jpeg' }
        '\.svg$' { 'image/svg+xml' }
        '\.ico$' { 'image/x-icon' }
        '\.woff$|\.woff2$' { 'font/woff2' }
        '\.ttf$' { 'font/ttf' }
        '\.webmanifest$' { 'application/manifest+json' }
        default { 'application/octet-stream' }
    }
    
    oci os object put `
        --namespace-name $Namespace `
        --bucket-name $BucketName `
        --name $RelPath `
        --file $File.FullName `
        --content-type $ContentType `
        --force `
        2>&1 | Out-Null
}

Write-Host "  ✓ Upload completed" -ForegroundColor Green

# Make index.html the default
Write-Host "`n[5/6] Configuring website hosting..." -ForegroundColor Yellow

# Create PAR (Pre-Authenticated Request) for public access or use bucket website
oci os bucket update `
    --namespace-name $Namespace `
    --bucket-name $BucketName `
    --public-access-type ObjectRead `
    2>&1 | Out-Null

Write-Host "  ✓ Website hosting configured" -ForegroundColor Green

# Generate public URLs
Write-Host "`n[6/6] Deployment complete!" -ForegroundColor Green

$BaseUrl = "https://objectstorage.$Region.oraclecloud.com/n/$Namespace/b/$BucketName/o"

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  🎉 Deployment Successful!                                     ║
╚════════════════════════════════════════════════════════════════╝

Your website is now live at:

📍 Main URL:
   $BaseUrl/index.html

📍 Direct bucket access:
   https://objectstorage.$Region.oraclecloud.com/n/$Namespace/b/$BucketName/o/

🔗 To access routes, append the path:
   $BaseUrl/about/index.html
   $BaseUrl/contact/index.html

💡 Next steps:
   1. Visit your site at the URL above
   2. Set up custom domain (optional)
   3. Enable CDN for better performance (optional)

"@ -ForegroundColor Cyan

# Try to open in browser
Write-Host "Opening in browser..." -ForegroundColor Yellow
Start-Process "$BaseUrl/index.html"

Write-Host "`nDeployment completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green
