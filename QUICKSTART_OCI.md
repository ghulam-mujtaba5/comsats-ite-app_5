# Quick Start Guide - OCI Deployment

## ✅ What's Already Configured

- GitHub CLI: Authenticated and ready
- OCI CLI: Configured for region `ap-mumbai-1`
- Compartment: Using root tenancy
- `.env.deploy`: Created with your details

## 🚀 Next Steps

### Option 1: Automated Setup (Recommended - 5 minutes)

Run the setup wizard to create all networking infrastructure automatically:

```powershell
pwsh scripts/setup-oci-deploy.ps1
```

The wizard will:
- Create VCN (Virtual Cloud Network)
- Create subnet with internet gateway
- Configure security rules for ports 80, 443, 3000
- Set up Docker authentication to OCI Registry
- Update `.env.deploy` with subnet ID

### Option 2: Manual Setup (15-20 minutes)

If you prefer manual control, follow these steps:

#### 1. Create VCN

```powershell
$COMPARTMENT_ID = "ocid1.tenancy.oc1..aaaaaaaaqowyqc5byuqsrkbytxk7i727t563a5blhodeqp26nv3ty77xpgpa"

# Create VCN
$VCN_ID = oci network vcn create `
  --compartment-id $COMPARTMENT_ID `
  --display-name "comsats-vcn" `
  --cidr-block "10.0.0.0/16" `
  --dns-label "comsats" `
  --query 'data.id' --raw-output `
  --wait-for-state AVAILABLE

Write-Host "VCN created: $VCN_ID"
```

#### 2. Create Internet Gateway

```powershell
$IGW_ID = oci network internet-gateway create `
  --compartment-id $COMPARTMENT_ID `
  --vcn-id $VCN_ID `
  --is-enabled true `
  --display-name "comsats-igw" `
  --query 'data.id' --raw-output `
  --wait-for-state AVAILABLE

Write-Host "Internet Gateway created: $IGW_ID"
```

#### 3. Update Route Table

```powershell
$RT_ID = oci network vcn get --vcn-id $VCN_ID --query 'data."default-route-table-id"' --raw-output

oci network route-table update `
  --rt-id $RT_ID `
  --route-rules "[{`"destination`":`"0.0.0.0/0`",`"destinationType`":`"CIDR_BLOCK`",`"networkEntityId`":`"$IGW_ID`"}]" `
  --force
```

#### 4. Update Security List

```powershell
$SL_ID = oci network vcn get --vcn-id $VCN_ID --query 'data."default-security-list-id"' --raw-output

oci network security-list update `
  --security-list-id $SL_ID `
  --ingress-security-rules '[
    {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":3000,"max":3000}}},
    {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},
    {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}}
  ]' `
  --force
```

#### 5. Create Public Subnet

```powershell
$SUBNET_ID = oci network subnet create `
  --compartment-id $COMPARTMENT_ID `
  --vcn-id $VCN_ID `
  --display-name "comsats-public-subnet" `
  --cidr-block "10.0.1.0/24" `
  --dns-label "public" `
  --query 'data.id' --raw-output `
  --wait-for-state AVAILABLE

Write-Host "Subnet created: $SUBNET_ID"
```

#### 6. Update `.env.deploy`

Replace `<TO_BE_CREATED>` with your actual subnet ID:

```powershell
$content = Get-Content .env.deploy -Raw
$content = $content -replace '<TO_BE_CREATED>', $SUBNET_ID
$content | Set-Content .env.deploy
```

#### 7. Configure Docker for OCI Registry

```powershell
# Get auth token from: https://cloud.oracle.com/identity/domains/my-profile/api-keys
$NAMESPACE = "bm1us4vb3gcj"
$USERNAME = "$NAMESPACE/your.email@example.com"
$AUTH_TOKEN = "<paste-your-auth-token>"

docker login ap-mumbai-1.ocir.io -u $USERNAME -p $AUTH_TOKEN
```

## 🎯 Deploy Your App

Once setup is complete:

### Test Deployment (once)
```powershell
pwsh scripts/deploy-to-oci.ps1 -Mode once
```

### Enable Continuous Deployment (Vercel-style)
```powershell
pwsh scripts/deploy-to-oci.ps1 -Mode watch
```

This will:
- Monitor GitHub for new commits every 60 seconds
- Automatically build Docker containers
- Deploy to OCI Container Instances
- Print the public IP to access your app

## 📝 Your Configuration Summary

```
Region: ap-mumbai-1
Namespace: bm1us4vb3gcj
Compartment: Root Tenancy
Image Name: comsats-ite-app
Shape: CI.Standard.E4.Flex (1 OCPU, 1GB RAM)
```

## 🔧 Troubleshooting

### Check OCI CLI works
```powershell
oci iam region list
```

### Check GitHub CLI works
```powershell
gh repo view
```

### Check Docker is running
```powershell
docker --version
docker ps
```

## 📚 Full Documentation

See `docs/DEPLOY_CONTINUOUS_OCI.md` for complete details.

## ⚡ Recommended Path

**Just run this to get everything set up automatically:**

```powershell
pwsh scripts/setup-oci-deploy.ps1
```

Then deploy:

```powershell
pwsh scripts/deploy-to-oci.ps1 -Mode once
```
