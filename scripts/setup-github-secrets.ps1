#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Set up GitHub repository secrets for OCI deployment
#>

param(
    [string]$RepoOwner = "campusaxis",
    [string]$RepoName = "comsats-ite-app_5"
)

$ErrorActionPreference = 'Stop'

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  GitHub Secrets Setup for OCI Deployment                      ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Check if gh CLI is authenticated
Write-Host "`n[1/3] Checking GitHub CLI authentication..." -ForegroundColor Yellow
try {
    $ghStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not authenticated"
    }
    Write-Host "  ✓ GitHub CLI authenticated" -ForegroundColor Green
} catch {
    Write-Host "  ✗ GitHub CLI not authenticated" -ForegroundColor Red
    Write-Host "`nPlease run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Read OCI config
Write-Host "`n[2/3] Reading OCI configuration..." -ForegroundColor Yellow
$ociConfigPath = "$env:USERPROFILE\.oci\config"
if (-not (Test-Path $ociConfigPath)) {
    Write-Host "  ✗ OCI config not found at: $ociConfigPath" -ForegroundColor Red
    exit 1
}

$ociConfig = Get-Content $ociConfigPath -Raw
$config = @{}

if ($ociConfig -match 'user\s*=\s*(\S+)') { $config['OCI_USER_OCID'] = $matches[1] }
if ($ociConfig -match 'fingerprint\s*=\s*(\S+)') { $config['OCI_FINGERPRINT'] = $matches[1] }
if ($ociConfig -match 'tenancy\s*=\s*(\S+)') { $config['OCI_TENANCY_OCID'] = $matches[1] }
if ($ociConfig -match 'region\s*=\s*(\S+)') { $config['OCI_REGION'] = $matches[1] }
if ($ociConfig -match 'key_file\s*=\s*(.+)') { 
    $keyPath = $matches[1].Trim()
    $keyPath = $keyPath -replace '~', $env:USERPROFILE
    if (Test-Path $keyPath) {
        $config['OCI_PRIVATE_KEY'] = Get-Content $keyPath -Raw
    }
}

Write-Host "  Found OCI configuration:" -ForegroundColor Cyan
Write-Host "    Region: $($config['OCI_REGION'])" -ForegroundColor Gray
Write-Host "    User OCID: $($config['OCI_USER_OCID'].Substring(0, 30))..." -ForegroundColor Gray
Write-Host "    Tenancy OCID: $($config['OCI_TENANCY_OCID'].Substring(0, 30))..." -ForegroundColor Gray

# Prompt for additional secrets
Write-Host "`n[3/3] Collecting deployment secrets..." -ForegroundColor Yellow

# OCI Instance IP
Write-Host "`n  Enter OCI Compute Instance Public IP:" -ForegroundColor Cyan -NoNewline
$ociInstanceIp = Read-Host
if ([string]::IsNullOrWhiteSpace($ociInstanceIp)) {
    Write-Host "  ✗ Instance IP is required" -ForegroundColor Red
    exit 1
}
$config['OCI_INSTANCE_IP'] = $ociInstanceIp

# SSH Private Key
Write-Host "`n  Enter path to SSH private key for VM:" -ForegroundColor Cyan -NoNewline
$sshKeyPath = Read-Host
if ([string]::IsNullOrWhiteSpace($sshKeyPath)) {
    Write-Host "  ✗ SSH key is required" -ForegroundColor Red
    exit 1
}
$sshKeyPath = $sshKeyPath.Trim('"').Trim("'")
if (Test-Path $sshKeyPath) {
    $config['OCI_SSH_PRIVATE_KEY'] = Get-Content $sshKeyPath -Raw
} else {
    Write-Host "  ✗ SSH key file not found: $sshKeyPath" -ForegroundColor Red
    exit 1
}

# Read application secrets from .env.local
Write-Host "`n  Reading application secrets from .env.local..." -ForegroundColor Cyan
$envLocalPath = Join-Path $PSScriptRoot "..\..\.env.local"
if (Test-Path $envLocalPath) {
    $envContent = Get-Content $envLocalPath -Raw
    
    if ($envContent -match 'RESEND_API_KEY\s*=\s*(.+)') { 
        $config['RESEND_API_KEY'] = $matches[1].Trim() 
    }
    if ($envContent -match 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)') { 
        $config['SUPABASE_SERVICE_ROLE_KEY'] = $matches[1].Trim() 
    }
    if ($envContent -match 'NEXT_PUBLIC_SITE_URL\s*=\s*(.+)') { 
        $config['NEXT_PUBLIC_SITE_URL'] = $matches[1].Trim() 
    }
    if ($envContent -match 'NEXT_PUBLIC_GA_MEASUREMENT_ID\s*=\s*(.+)') { 
        $config['NEXT_PUBLIC_GA_MEASUREMENT_ID'] = $matches[1].Trim() 
    }
    if ($envContent -match 'MONGODB_URI\s*=\s*"?([^"\r\n]+)"?') { 
        $config['MONGODB_URI'] = $matches[1].Trim() 
    }
    if ($envContent -match 'MONGODB_DB\s*=\s*"?([^"\r\n]+)"?') { 
        $config['MONGODB_DB'] = $matches[1].Trim() 
    }
    if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)') { 
        $config['NEXT_PUBLIC_SUPABASE_URL'] = $matches[1].Trim() 
    }
    if ($envContent -match 'NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)') { 
        $config['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = $matches[1].Trim() 
    }
    if ($envContent -match 'SUPABASE_DB_PASSWORD\s*=\s*(.+)') { 
        $config['SUPABASE_DB_PASSWORD'] = $matches[1].Trim() 
    }
    if ($envContent -match 'SUPABASE_DB_URL\s*=\s*(.+)') { 
        $config['SUPABASE_DB_URL'] = $matches[1].Trim() 
    }
    
    Write-Host "    ✓ Loaded $($config.Count) secrets from .env.local" -ForegroundColor Green
}

# Update NEXT_PUBLIC_SITE_URL to use instance IP
$config['NEXT_PUBLIC_SITE_URL'] = "http://$ociInstanceIp"

# Set GitHub secrets
Write-Host "`n  Setting GitHub repository secrets..." -ForegroundColor Yellow
$repo = "$RepoOwner/$RepoName"

$secretsSet = 0
$secretsFailed = 0

foreach ($key in $config.Keys) {
    $value = $config[$key]
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host "    ⊘ Skipping $key (empty value)" -ForegroundColor Gray
        continue
    }
    
    try {
        # Use gh CLI to set secret
        $value | gh secret set $key --repo $repo
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ $key" -ForegroundColor Green
            $secretsSet++
        } else {
            Write-Host "    ✗ Failed to set $key" -ForegroundColor Red
            $secretsFailed++
        }
    } catch {
        Write-Host "    ✗ Error setting ${key}: $($_.Exception.Message)" -ForegroundColor Red
        $secretsFailed++
    }
}

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  ✅ GitHub Secrets Configuration Complete!                     ║
╚════════════════════════════════════════════════════════════════╝

📊 Summary:
   ✓ Secrets set: $secretsSet
   ✗ Failed: $secretsFailed
   
🚀 Next Steps:
   1. Commit and push your code:
      git add .
      git commit -m "Add OCI deployment workflow"
      git push origin main
   
   2. Watch deployment:
      GitHub → Actions → Deploy to Oracle Cloud
   
   3. Access your app:
      http://$ociInstanceIp

📚 Full setup guide: docs/ORACLE_FREE_TIER_SETUP.md

"@ -ForegroundColor Cyan
