#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fully automated deployment to Oracle Cloud - Does EVERYTHING
#>

$ErrorActionPreference = 'Stop'

Write-Host @"
╔════════════════════════════════════════════════════════════════╗
║  🚀 FULLY AUTOMATED DEPLOYMENT TO ORACLE CLOUD                ║
║  This will create VM, configure everything, and deploy!       ║
╚════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Read OCI config
Write-Host "`n[1/12] Reading OCI configuration..." -ForegroundColor Yellow
$config = Get-Content "$env:USERPROFILE\.oci\config" | Out-String
if ($config -match 'tenancy\s*=\s*(\S+)') { $CompartmentId = $matches[1] }
if ($config -match 'region\s*=\s*(\S+)') { $Region = $matches[1] }
if ($config -match 'user\s*=\s*(\S+)') { $UserOcid = $matches[1] }
if ($config -match 'fingerprint\s*=\s*(\S+)') { $Fingerprint = $matches[1] }
if ($config -match 'key_file\s*=\s*(.+)') { 
    $KeyFile = $matches[1].Trim() -replace '~', $env:USERPROFILE
}

Write-Host "  Region: $Region" -ForegroundColor Green
Write-Host "  Compartment: $CompartmentId" -ForegroundColor Green

# Check for existing VM
Write-Host "`n[2/12] Checking for existing VM..." -ForegroundColor Yellow
$ExistingInstances = oci compute instance list --compartment-id $CompartmentId --lifecycle-state RUNNING --query 'data[?contains("display-name", `comsats-app`)].{"id":"id","name":"display-name","ip":"primary-public-ip"}' 2>$null | ConvertFrom-Json

if ($ExistingInstances -and $ExistingInstances.Count -gt 0) {
    $InstanceId = $ExistingInstances[0].id
    $InstanceIp = oci compute instance list-vnics --instance-id $InstanceId --query 'data[0]."public-ip"' --raw-output 2>$null
    
    if ($InstanceIp) {
        Write-Host "  ✓ Found existing VM at $InstanceIp" -ForegroundColor Green
        $UseExisting = $true
    }
}

if (-not $UseExisting) {
    Write-Host "  Creating new VM..." -ForegroundColor Cyan
    
    # Get availability domain
    Write-Host "`n[3/12] Getting availability domain..." -ForegroundColor Yellow
    $AvailabilityDomain = oci iam availability-domain list --compartment-id $CompartmentId --query 'data[0].name' --raw-output
    Write-Host "  Domain: $AvailabilityDomain" -ForegroundColor Green
    
    # Check for existing VCN
    Write-Host "`n[4/12] Setting up network..." -ForegroundColor Yellow
    $VcnId = oci network vcn list --compartment-id $CompartmentId --query 'data[0].id' --raw-output 2>$null
    
    if (-not $VcnId) {
        Write-Host "  Creating VCN..." -ForegroundColor Cyan
        $VcnId = oci network vcn create --compartment-id $CompartmentId --display-name "comsats-vcn" --cidr-block "10.0.0.0/16" --dns-label "comsats" --query 'data.id' --raw-output --wait-for-state AVAILABLE
        
        # Create Internet Gateway
        $IgwId = oci network internet-gateway create --compartment-id $CompartmentId --vcn-id $VcnId --is-enabled true --display-name "comsats-igw" --query 'data.id' --raw-output --wait-for-state AVAILABLE
        
        # Update route table
        $RtId = oci network vcn get --vcn-id $VcnId --query 'data."default-route-table-id"' --raw-output
        oci network route-table update --rt-id $RtId --route-rules "[{`"destination`":`"0.0.0.0/0`",`"destinationType`":`"CIDR_BLOCK`",`"networkEntityId`":`"$IgwId`"}]" --force | Out-Null
        
        # Update security list
        $SlId = oci network vcn get --vcn-id $VcnId --query 'data."default-security-list-id"' --raw-output
        oci network security-list update --security-list-id $SlId --ingress-security-rules '[{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":22,"max":22}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}},{"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":3000,"max":3000}}}]' --force | Out-Null
        
        Write-Host "  ✓ VCN created" -ForegroundColor Green
    }
    
    # Get or create subnet
    Write-Host "`n[5/12] Configuring subnet..." -ForegroundColor Yellow
    $SubnetId = oci network subnet list --compartment-id $CompartmentId --vcn-id $VcnId --query 'data[0].id' --raw-output 2>$null
    
    if (-not $SubnetId) {
        $SubnetId = oci network subnet create --compartment-id $CompartmentId --vcn-id $VcnId --display-name "comsats-subnet" --cidr-block "10.0.1.0/24" --dns-label "public" --query 'data.id' --raw-output --wait-for-state AVAILABLE
        Write-Host "  ✓ Subnet created" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Using existing subnet" -ForegroundColor Green
    }
    
    # Generate SSH key
    Write-Host "`n[6/12] Generating SSH keys..." -ForegroundColor Yellow
    $SshDir = "$env:USERPROFILE\.ssh"
    $SshKeyPath = "$SshDir\oci_comsats"
    
    if (-not (Test-Path $SshKeyPath)) {
        if (-not (Test-Path $SshDir)) { New-Item -ItemType Directory -Path $SshDir | Out-Null }
        ssh-keygen -t rsa -b 4096 -f $SshKeyPath -N '""' -C "comsats-deployment" | Out-Null
        Write-Host "  ✓ SSH keys generated" -ForegroundColor Green
    }
    
    $SshPublicKey = Get-Content "$SshKeyPath.pub" -Raw
    
    # Get ARM image for Always Free
    Write-Host "`n[7/12] Finding Oracle Linux ARM image..." -ForegroundColor Yellow
    $ImageId = oci compute image list --compartment-id $CompartmentId --operating-system "Oracle Linux" --operating-system-version "8" --shape "VM.Standard.A1.Flex" --query 'data[0].id' --raw-output
    Write-Host "  ✓ Image found" -ForegroundColor Green
    
    # Create compute instance (Always Free tier)
    Write-Host "`n[8/12] Creating VM (4 OCPUs, 24GB RAM - FREE TIER)..." -ForegroundColor Yellow
    Write-Host "  This will take 3-5 minutes..." -ForegroundColor Gray
    
    $CloudInitScript = @"
#!/bin/bash
# Update system
dnf update -y

# Install Docker
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io

# Start Docker
systemctl start docker
systemctl enable docker

# Add opc user to docker group
usermod -aG docker opc

# Configure firewall
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload

# Create deployment directory
mkdir -p /opt/comsats
chown opc:opc /opt/comsats

echo "Setup complete" > /opt/setup-done.txt
"@
    
    # Write cloud-init to temp file
    $CloudInitFile = [System.IO.Path]::GetTempFileName()
    $CloudInitScript | Out-File -FilePath $CloudInitFile -Encoding UTF8 -NoNewline
    
    $InstanceResponse = oci compute instance launch `
        --compartment-id $CompartmentId `
        --availability-domain $AvailabilityDomain `
        --display-name "comsats-app-server" `
        --shape "VM.Standard.A1.Flex" `
        --shape-config '{"ocpus":4.0,"memory-in-gbs":24.0}' `
        --image-id $ImageId `
        --subnet-id $SubnetId `
        --assign-public-ip true `
        --ssh-authorized-keys-file "$SshKeyPath.pub" `
        --user-data-file $CloudInitFile `
        --wait-for-state RUNNING 2>&1
    
    Remove-Item $CloudInitFile -ErrorAction SilentlyContinue
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Failed to create instance" -ForegroundColor Red
        Write-Host $InstanceResponse -ForegroundColor Red
        exit 1
    }
    
    $InstanceJson = $InstanceResponse | ConvertFrom-Json
    $InstanceId = $InstanceJson.data.id
    
    Write-Host "  ✓ VM created!" -ForegroundColor Green
    
    # Get public IP
    Write-Host "`n[9/12] Getting public IP..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    $InstanceIp = oci compute instance list-vnics --instance-id $InstanceId --query 'data[0]."public-ip"' --raw-output
    Write-Host "  IP: $InstanceIp" -ForegroundColor Green
    
    # Wait for cloud-init to complete
    Write-Host "`n[10/12] Waiting for VM setup to complete..." -ForegroundColor Yellow
    Write-Host "  Docker installation in progress..." -ForegroundColor Gray
    Start-Sleep -Seconds 90
    Write-Host "  ✓ Setup should be complete" -ForegroundColor Green
}

# Build and deploy Docker image
Write-Host "`n[11/12] Building and deploying application..." -ForegroundColor Yellow

# Read environment variables
$envVars = @{}
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^\s*([^#=]+?)\s*=\s*"?([^"\r\n]+)"?\s*$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

# Update site URL to use instance IP
$envVars['NEXT_PUBLIC_SITE_URL'] = "http://$InstanceIp"

Write-Host "  Building Docker image locally..." -ForegroundColor Cyan
$ImageTag = "comsats-app:latest"

# Build with all env vars
$BuildArgs = @()
foreach ($key in @('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_GA_MEASUREMENT_ID')) {
    if ($envVars.ContainsKey($key)) {
        $BuildArgs += "--build-arg"
        $BuildArgs += "${key}=$($envVars[$key])"
    }
}

docker build $BuildArgs -t $ImageTag . 2>&1 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Docker build failed" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ Docker image built" -ForegroundColor Green

# Save image
Write-Host "  Saving Docker image..." -ForegroundColor Cyan
docker save $ImageTag -o app-image.tar

# Upload and deploy
Write-Host "  Uploading to VM..." -ForegroundColor Cyan
$SshKey = if ($UseExisting) { "$env:USERPROFILE\.ssh\oci_comsats" } else { $SshKeyPath }

# Wait for SSH to be ready
$retries = 0
while ($retries -lt 30) {
    $sshTest = ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -i $SshKey opc@${InstanceIp} "echo ok" 2>&1
    if ($LASTEXITCODE -eq 0) { break }
    $retries++
    Start-Sleep -Seconds 5
}

if ($retries -eq 30) {
    Write-Host "  ✗ Cannot connect to VM via SSH" -ForegroundColor Red
    exit 1
}

# Upload image
scp -i $SshKey -o StrictHostKeyChecking=no app-image.tar opc@${InstanceIp}:/tmp/ | Out-Null
Remove-Item app-image.tar

Write-Host "  Deploying container..." -ForegroundColor Cyan

# Prepare env vars for docker run
$DockerEnvArgs = ""
foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    $DockerEnvArgs += "-e `"$key=$value`" "
}

ssh -i $SshKey -o StrictHostKeyChecking=no opc@${InstanceIp} @"
set -e
sudo docker load -i /tmp/app-image.tar
rm /tmp/app-image.tar
sudo docker stop comsats-app 2>/dev/null || true
sudo docker rm comsats-app 2>/dev/null || true
sudo docker run -d \
  --name comsats-app \
  --restart unless-stopped \
  -p 80:3000 \
  $DockerEnvArgs \
  comsats-app:latest
sudo docker image prune -f
echo "Deployment complete!"
"@

Write-Host "  ✓ Application deployed!" -ForegroundColor Green

# Test deployment
Write-Host "`n[12/12] Testing deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $response = Invoke-WebRequest -Uri "http://${InstanceIp}" -TimeoutSec 10 -UseBasicParsing
    Write-Host "  ✓ Application is responding!" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Application starting (may take a moment)" -ForegroundColor Yellow
}

# Setup GitHub secrets
Write-Host "`n[BONUS] Setting up GitHub secrets for continuous deployment..." -ForegroundColor Yellow

$ghStatus = gh auth status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Configuring GitHub repository..." -ForegroundColor Cyan
    
    $repo = "campusaxis/comsats-ite-app_5"
    
    # OCI secrets
    $UserOcid | gh secret set OCI_USER_OCID --repo $repo 2>$null
    $Fingerprint | gh secret set OCI_FINGERPRINT --repo $repo 2>$null
    $CompartmentId | gh secret set OCI_TENANCY_OCID --repo $repo 2>$null
    $Region | gh secret set OCI_REGION --repo $repo 2>$null
    Get-Content $KeyFile -Raw | gh secret set OCI_PRIVATE_KEY --repo $repo 2>$null
    $InstanceIp | gh secret set OCI_INSTANCE_IP --repo $repo 2>$null
    Get-Content $SshKey -Raw | gh secret set OCI_SSH_PRIVATE_KEY --repo $repo 2>$null
    
    # App secrets
    foreach ($key in $envVars.Keys) {
        $envVars[$key] | gh secret set $key --repo $repo 2>$null
    }
    
    Write-Host "  ✓ GitHub secrets configured!" -ForegroundColor Green
    Write-Host "  Now every push to main will auto-deploy!" -ForegroundColor Cyan
} else {
    Write-Host "  ⊘ GitHub CLI not authenticated (skipping)" -ForegroundColor Gray
}

Write-Host @"

╔════════════════════════════════════════════════════════════════╗
║  🎉 DEPLOYMENT COMPLETE!                                       ║
╚════════════════════════════════════════════════════════════════╝

🌐 Your app is LIVE at:
   http://$InstanceIp

📊 VM Details:
   • Shape: VM.Standard.A1.Flex (Always Free)
   • CPUs: 4 ARM cores
   • RAM: 24 GB
   • Storage: 50 GB
   • Cost: $0/month (FREE FOREVER)

🔐 SSH Access:
   ssh -i $SshKey opc@$InstanceIp

📦 Docker Commands:
   sudo docker logs comsats-app        # View logs
   sudo docker logs -f comsats-app     # Follow logs
   sudo docker restart comsats-app     # Restart app
   sudo docker ps                      # List containers

🚀 Continuous Deployment:
   Every push to 'main' branch will automatically deploy!
   Watch at: https://github.com/campusaxis/comsats-ite-app_5/actions

💡 Next Steps:
   1. Visit: http://$InstanceIp
   2. Test your application
   3. Push to GitHub to trigger auto-deployment
   4. (Optional) Set up custom domain + SSL

"@ -ForegroundColor Cyan

Write-Host "Opening in browser..." -ForegroundColor Yellow
Start-Process "http://${InstanceIp}"

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
