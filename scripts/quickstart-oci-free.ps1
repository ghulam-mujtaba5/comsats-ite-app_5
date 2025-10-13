#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick start guide for Oracle Cloud Always Free Tier deployment
#>

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  Oracle Cloud Always Free Tier - Quick Start                  ║
╚════════════════════════════════════════════════════════════════╝

This guide will help you set up FREE continuous deployment to Oracle Cloud.

📋 What you need (5 minutes):
   1. Oracle Cloud account (sign up at cloud.oracle.com)
   2. Create a VM instance (4 OCPUs, 24GB RAM - 100% FREE)
   3. Set up GitHub secrets
   4. Push to deploy!

🎯 Benefits:
   ✅ 100% FREE forever (no credit card charges)
   ✅ Automatic deployment on every push
   ✅ 4 ARM CPUs + 24GB RAM
   ✅ Full Next.js support (API routes, SSR, everything)
   ✅ 10TB/month data transfer

"@ -ForegroundColor Cyan

Write-Host @"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 STEP 1: Create Oracle Cloud Compute Instance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ -ForegroundColor Yellow

Write-Host "1. Go to: " -NoNewline
Write-Host "https://cloud.oracle.com" -ForegroundColor Cyan

Write-Host "`n2. Navigate to: " -NoNewline
Write-Host "Compute → Instances → Create Instance" -ForegroundColor Cyan

Write-Host "`n3. Configure:" -ForegroundColor White
Write-Host "   • Name: " -NoNewline -ForegroundColor Gray
Write-Host "comsats-app-server" -ForegroundColor Green
Write-Host "   • Image: " -NoNewline -ForegroundColor Gray
Write-Host "Oracle Linux 8 or Ubuntu 22.04" -ForegroundColor Green
Write-Host "   • Shape: " -NoNewline -ForegroundColor Gray
Write-Host "VM.Standard.A1.Flex (ARM - Always Free!)" -ForegroundColor Green
Write-Host "   • OCPUs: " -NoNewline -ForegroundColor Gray
Write-Host "4" -ForegroundColor Green
Write-Host "   • Memory: " -NoNewline -ForegroundColor Gray
Write-Host "24 GB" -ForegroundColor Green
Write-Host "   • Boot Volume: " -NoNewline -ForegroundColor Gray
Write-Host "50 GB" -ForegroundColor Green
Write-Host "   • Network: " -NoNewline -ForegroundColor Gray
Write-Host "Create new VCN or use existing" -ForegroundColor Green
Write-Host "   • Public IP: " -NoNewline -ForegroundColor Gray
Write-Host "✓ Assign public IP" -ForegroundColor Green
Write-Host "   • SSH Keys: " -NoNewline -ForegroundColor Gray
Write-Host "Generate new pair and save it!" -ForegroundColor Green

Write-Host "`n4. Click " -NoNewline
Write-Host "'Create'" -ForegroundColor Cyan -NoNewline
Write-Host " and wait ~2 minutes"

Write-Host "`n5. Note your instance public IP: " -NoNewline -ForegroundColor Yellow
$instanceIp = Read-Host

Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 STEP 2: Configure Firewall
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ -ForegroundColor Yellow

Write-Host "1. In OCI Console, go to:" -ForegroundColor White
Write-Host "   Networking → Virtual Cloud Networks → Your VCN → Security Lists" -ForegroundColor Cyan

Write-Host "`n2. Click 'Default Security List' → 'Add Ingress Rule':" -ForegroundColor White
Write-Host "   • Source CIDR: " -NoNewline -ForegroundColor Gray
Write-Host "0.0.0.0/0" -ForegroundColor Green
Write-Host "   • IP Protocol: " -NoNewline -ForegroundColor Gray
Write-Host "TCP" -ForegroundColor Green
Write-Host "   • Destination Port: " -NoNewline -ForegroundColor Gray
Write-Host "80" -ForegroundColor Green
Write-Host "   • Description: " -NoNewline -ForegroundColor Gray
Write-Host "HTTP for Next.js app" -ForegroundColor Green

Write-Host "`n3. SSH into your instance and run:" -ForegroundColor White
Write-Host @"

   # For Oracle Linux:
   sudo firewall-cmd --permanent --add-port=80/tcp
   sudo firewall-cmd --reload
   
   # For Ubuntu:
   sudo ufw allow 80/tcp
   sudo ufw enable

"@ -ForegroundColor Cyan

Write-Host "Press Enter when firewall is configured..." -ForegroundColor Yellow
Read-Host

Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 STEP 3: Install Docker on VM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ -ForegroundColor Yellow

Write-Host "SSH into your instance:" -ForegroundColor White
Write-Host "   ssh -i path/to/ssh-key opc@$instanceIp" -ForegroundColor Cyan

Write-Host "`nThen run these commands:" -ForegroundColor White
Write-Host @"

# For Oracle Linux:
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker opc

# For Ubuntu:
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Verify:
docker --version

"@ -ForegroundColor Cyan

Write-Host "IMPORTANT: Log out and log back in after installing Docker!" -ForegroundColor Red
Write-Host "`nPress Enter when Docker is installed..." -ForegroundColor Yellow
Read-Host

Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 STEP 4: Get OCI API Keys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ -ForegroundColor Yellow

Write-Host "1. In OCI Console:" -ForegroundColor White
Write-Host "   Profile Icon → User Settings → API Keys → Add API Key" -ForegroundColor Cyan

Write-Host "`n2. Generate API Key Pair → Download private key (.pem file)" -ForegroundColor White

Write-Host "`n3. Copy the configuration shown (you'll need these values)" -ForegroundColor White

Write-Host "`nPress Enter when you have the API key..." -ForegroundColor Yellow
Read-Host

Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 STEP 5: Set Up GitHub Secrets
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ -ForegroundColor Yellow

Write-Host "I'll help you set up GitHub secrets automatically!" -ForegroundColor White
Write-Host "`nPath to SSH private key for your VM: " -NoNewline -ForegroundColor Cyan
$sshKeyPath = Read-Host

Write-Host "`nRunning setup script..." -ForegroundColor Yellow
Write-Host "This will read your OCI config and set all GitHub secrets." -ForegroundColor Gray

$setupScript = Join-Path $PSScriptRoot "setup-github-secrets.ps1"
if (Test-Path $setupScript) {
    & $setupScript
} else {
    Write-Host "`n⚠️  Setup script not found. Manual setup required:" -ForegroundColor Yellow
    Write-Host @"

Go to: https://github.com/campusaxis/comsats-ite-app_5/settings/secrets/actions

Add these secrets:
• OCI_USER_OCID
• OCI_FINGERPRINT  
• OCI_TENANCY_OCID
• OCI_REGION
• OCI_PRIVATE_KEY (content of API key .pem file)
• OCI_INSTANCE_IP ($instanceIp)
• OCI_SSH_PRIVATE_KEY (content of SSH private key)

Plus all environment variables from Vercel:
• RESEND_API_KEY
• SUPABASE_SERVICE_ROLE_KEY
• NEXT_PUBLIC_SITE_URL (set to http://$instanceIp)
• NEXT_PUBLIC_GA_MEASUREMENT_ID
• MONGODB_URI
• MONGODB_DB
• NEXT_PUBLIC_SUPABASE_URL
• NEXT_PUBLIC_SUPABASE_ANON_KEY
• SUPABASE_DB_PASSWORD
• SUPABASE_DB_URL

"@ -ForegroundColor Cyan
}

Write-Host @"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 STEP 6: Deploy!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ -ForegroundColor Yellow

Write-Host "Now just push your code:" -ForegroundColor White
Write-Host @"

git add .
git commit -m "Set up OCI deployment"
git push origin main

"@ -ForegroundColor Cyan

Write-Host "GitHub Actions will automatically:" -ForegroundColor White
Write-Host "  1. Build your Docker image" -ForegroundColor Gray
Write-Host "  2. Upload to your OCI VM" -ForegroundColor Gray
Write-Host "  3. Deploy the container" -ForegroundColor Gray
Write-Host "  4. Your app will be live!" -ForegroundColor Gray

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  🎉 Setup Complete!                                            ║
╚════════════════════════════════════════════════════════════════╝

📍 Your app will be available at:
   http://$instanceIp

📖 Full documentation:
   docs/ORACLE_FREE_TIER_SETUP.md

🔍 Watch deployment:
   https://github.com/campusaxis/comsats-ite-app_5/actions

💡 Every push to 'main' will automatically deploy!

"@ -ForegroundColor Cyan

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
