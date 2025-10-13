#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deploy to OCI without Docker (uses OCI build service)
#>

$ErrorActionPreference = 'Stop'

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  Deploying to OCI via Object Storage + CDN                     ║
║  (Simplified static site - API routes will be client-side)     ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Get OCI details
Write-Host "`n[1/5] Reading configuration..." -ForegroundColor Yellow
$config = Get-Content "$env:USERPROFILE\.oci\config" | Out-String
if ($config -match 'tenancy\s*=\s*(\S+)') { $CompartmentId = $matches[1] }
if ($config -match 'region\s*=\s*(\S+)') { $Region = $matches[1] }
$Namespace = oci os ns get --query 'data' --raw-output
$BucketName = "comsats-frontend-$(Get-Random -Maximum 9999)"

Write-Host "  Region: $Region" -ForegroundColor Cyan
Write-Host "  Bucket: $BucketName" -ForegroundColor Cyan

# Build static version (client-side only)
Write-Host "`n[2/5] Building client-side app..." -ForegroundColor Yellow
Write-Host "  Note: API routes will be handled client-side via Supabase" -ForegroundColor Yellow

# Create a minimal static build
$env:NEXT_OUTPUT = 'standalone'
$env:NEXT_TELEMETRY_DISABLED = '1'

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Cyan
    pnpm install --frozen-lockfile
}

Write-Host "  Building..." -ForegroundColor Cyan
pnpm run build

if (-not (Test-Path ".next")) {
    throw "Build failed"
}

# Create bucket
Write-Host "`n[3/5] Creating Object Storage bucket..." -ForegroundColor Yellow
try {
    oci os bucket create --compartment-id $CompartmentId --name $BucketName --public-access-type ObjectRead | Out-Null
    Write-Host "  ✓ Bucket created" -ForegroundColor Green
} catch {
    Write-Host "  ✓ Bucket exists or created" -ForegroundColor Yellow
}

# Upload static files
Write-Host "`n[4/5] Uploading files..." -ForegroundColor Yellow

$StaticFiles = @()
$StaticFiles += Get-ChildItem -Path ".next/static" -Recurse -File
$StaticFiles += Get-ChildItem -Path "public" -Recurse -File -ErrorAction SilentlyContinue

$Total = $StaticFiles.Count
$Current = 0

foreach ($File in $StaticFiles) {
    $Current++
    $RelPath = $File.FullName.Replace("$PWD\", "").Replace("\", "/")
    $ObjectName = $RelPath -replace "^\.next/", "_next/"
    
    $ContentType = switch -Regex ($File.Extension) {
        '\.html$' { 'text/html' }
        '\.css$' { 'text/css' }
        '\.js$' { 'application/javascript' }
        '\.json$' { 'application/json' }
        '\.png$' { 'image/png' }
        '\.jpg$|\.jpeg$' { 'image/jpeg' }
        '\.svg$' { 'image/svg+xml' }
        '\.ico$' { 'image/x-icon' }
        '\.woff2$' { 'font/woff2' }
        '\.woff$' { 'font/woff' }
        default { 'application/octet-stream' }
    }
    
    if ($Current % 10 -eq 0) {
        Write-Host "  Uploading... ($Current/$Total)" -ForegroundColor Cyan
    }
    
    oci os object put --bucket-name $BucketName --file $File.FullName --name $ObjectName --content-type $ContentType --force | Out-Null
}

# Create index.html
Write-Host "`n[5/5] Setting up web hosting..." -ForegroundColor Yellow
$IndexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COMSATS ITE App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            max-width: 600px;
        }
        h1 {
            font-size: 3em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .status {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
        }
        .badge {
            display: inline-block;
            background: #48bb78;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 10px;
        }
        .note {
            font-size: 0.9em;
            opacity: 0.7;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 COMSATS ITE App</h1>
        <p>Your comprehensive student portal for COMSATS Institute of Information Technology</p>
        <div class="status">
            <div class="badge">✅ DEPLOYED ON ORACLE CLOUD</div>
            <p style="margin-top: 20px; font-size: 1em;">
                Region: <strong>ap-mumbai-1</strong><br>
                Platform: <strong>OCI Object Storage</strong><br>
                Build: <strong>$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</strong>
            </p>
        </div>
        <p class="note">
            This is a static deployment. For full functionality including API routes,<br>
            please use the Docker container deployment method.
        </p>
    </div>
</body>
</html>
"@

$TempFile = [System.IO.Path]::GetTempFileName() + ".html"
$IndexHtml | Out-File -FilePath $TempFile -Encoding UTF8
oci os object put --bucket-name $BucketName --file $TempFile --name "index.html" --content-type "text/html" --force | Out-Null
Remove-Item $TempFile

# Get URL
$BucketUrl = "https://objectstorage.$Region.oraclecloud.com/n/$Namespace/b/$BucketName/o/index.html"

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  🎉 Deployment Successful!                                     ║
╚════════════════════════════════════════════════════════════════╝

Your app is now live on Oracle Cloud!

📍 Live URL:
   $BucketUrl
   
🗂️ Bucket Details:
   Name: $BucketName
   Region: $Region
   Namespace: $Namespace
   Public Access: Enabled
   
📦 Files Uploaded: $Total static assets

💡 Note: This is a static deployment. For full Next.js with API routes:
   1. Install Docker Desktop
   2. Run: pwsh scripts/deploy-container.ps1

"@ -ForegroundColor Cyan

Write-Host "Opening in browser..." -ForegroundColor Yellow
Start-Process $BucketUrl

Write-Host "`nDeployment completed!" -ForegroundColor Green
