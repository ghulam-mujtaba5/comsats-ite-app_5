# Vercel-Style Continuous Deployment to Oracle Cloud

This setup provides **Vercel-like continuous deployment** using GitHub CLI + OCI CLI instead of GitHub Actions.

## How It Works

Unlike GitHub Actions (which run in GitHub's cloud), this system:
- Runs locally or on your own server
- Uses **GitHub CLI** to monitor your repository
- Uses **OCI CLI** to deploy directly to Oracle Container Instances
- Provides real-time continuous deployment like Vercel

## Architecture

```
GitHub Repo (push) → Monitor Script (local/server)
                           ↓
                     Build Container Image
                           ↓
                     Push to OCI Registry
                           ↓
                     Deploy to Container Instance
                           ↓
                     Live App (Public IP)
```

## Prerequisites

### 1. Install Tools

You already have:
- ✅ OCI CLI (version 3.68.0 at `C:\Users\ghula\bin\oci.exe`)

Still need:
- GitHub CLI: `winget install GitHub.cli` or download from https://cli.github.com/
- Docker Desktop: https://www.docker.com/products/docker-desktop/ (for building images)
- Git (already installed)

### 2. Authenticate GitHub CLI

```powershell
gh auth login
# Choose: GitHub.com → HTTPS → Login with browser
```

### 3. Configure OCI CLI (if not done)

```powershell
oci setup config
```

You'll need:
- User OCID
- Tenancy OCID
- Region
- API key (will generate if needed)

### 4. Set Up OCI Infrastructure

#### Create VCN and Subnet (if needed)

```powershell
# Get your compartment OCID
$COMPARTMENT_ID = oci iam compartment list --query 'data[0].id' --raw-output

# Create VCN
$VCN_ID = oci network vcn create `
  --compartment-id $COMPARTMENT_ID `
  --display-name "comsats-vcn" `
  --cidr-block "10.0.0.0/16" `
  --dns-label "comsats" `
  --query 'data.id' --raw-output `
  --wait-for-state AVAILABLE

# Create Internet Gateway
$IGW_ID = oci network internet-gateway create `
  --compartment-id $COMPARTMENT_ID `
  --vcn-id $VCN_ID `
  --is-enabled true `
  --display-name "comsats-igw" `
  --query 'data.id' --raw-output `
  --wait-for-state AVAILABLE

# Update default route table
$RT_ID = oci network vcn get --vcn-id $VCN_ID --query 'data."default-route-table-id"' --raw-output

oci network route-table update `
  --rt-id $RT_ID `
  --route-rules "[{\"destination\":\"0.0.0.0/0\",\"destinationType\":\"CIDR_BLOCK\",\"networkEntityId\":\"$IGW_ID\"}]" `
  --force

# Create public subnet
$SUBNET_ID = oci network subnet create `
  --compartment-id $COMPARTMENT_ID `
  --vcn-id $VCN_ID `
  --display-name "comsats-public-subnet" `
  --cidr-block "10.0.1.0/24" `
  --dns-label "public" `
  --query 'data.id' --raw-output `
  --wait-for-state AVAILABLE

# Update security list to allow HTTP/HTTPS
$SL_ID = oci network vcn get --vcn-id $VCN_ID --query 'data."default-security-list-id"' --raw-output

oci network security-list update `
  --security-list-id $SL_ID `
  --ingress-security-rules '[
    {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":3000,"max":3000}}},
    {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},
    {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}}
  ]' `
  --force

Write-Host "VCN ID: $VCN_ID"
Write-Host "Subnet ID: $SUBNET_ID"
```

#### Configure Container Registry Authentication

```powershell
# Get your namespace
$NAMESPACE = oci os ns get --query 'data' --raw-output

# Get your region
$REGION = oci iam region-subscription list --query 'data[0]."region-name"' --raw-output

# Login to Docker (for pushing images)
$USERNAME = "$NAMESPACE/<your-username>"
$AUTH_TOKEN = "<generate-from-console>"  # Identity → Users → Your User → Auth Tokens

docker login "${REGION}.ocir.io" -u $USERNAME -p $AUTH_TOKEN
```

Generate auth token at: https://cloud.oracle.com/identity/domains/my-profile/api-keys

### 5. Configure Deployment Settings

Copy the example config:

```powershell
Copy-Item .env.deploy.example .env.deploy
```

Edit `.env.deploy` with your values:

```env
OCI_COMPARTMENT_ID=ocid1.compartment.oc1..aaaaaaaaxxxxx
OCI_SUBNET_ID=ocid1.subnet.oc1..aaaaaaaaxxxxx  # From above
OCI_REGION=us-ashburn-1
OCI_IMAGE_NAME=comsats-ite-app
OCI_SHAPE=CI.Standard.E4.Flex
```

## Usage

### One-Time Deployment

Deploy the current main branch once:

```powershell
pwsh scripts/deploy-to-oci.ps1 -Mode once
```

### Continuous Deployment (Vercel-Style)

Start watching for commits and auto-deploy:

```powershell
pwsh scripts/deploy-to-oci.ps1 -Mode watch -Branch main
```

This will:
- Check GitHub every 60 seconds for new commits
- Automatically pull, build, and deploy when changes are detected
- Show deployment status and public URL

### Deploy Specific Branch

```powershell
pwsh scripts/deploy-to-oci.ps1 -Mode watch -Branch dev
```

### Run as Background Service

For production, run in a detached terminal or as a service:

```powershell
# PowerShell - run in background
Start-Process pwsh -ArgumentList "-File scripts/deploy-to-oci.ps1 -Mode watch" -WindowStyle Hidden

# Or use Windows Task Scheduler for automatic startup
```

## Deployment Flow

1. **Monitor**: Script polls GitHub for new commits using `gh api`
2. **Detect**: When new commit found, pulls latest code
3. **Build**: Creates Docker container with Next.js app
4. **Push**: Uploads image to OCI Container Registry
5. **Deploy**: Creates/updates OCI Container Instance
6. **Access**: Returns public IP address

## Access Your App

After deployment completes, the script prints:

```
Public IP: 123.456.789.0
Access at: http://123.456.789.0:3000
```

## Advanced Configuration

### Custom Environment Variables

Add to your container in `.env.deploy`:

```env
# Add any env vars your app needs
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

Modify `deploy-to-oci.ps1` line ~238 to include them in the container environment.

### Use Load Balancer

For production with custom domain:

```powershell
# Create load balancer
$LB_ID = oci lb load-balancer create `
  --compartment-id $COMPARTMENT_ID `
  --display-name "comsats-lb" `
  --shape-name "flexible" `
  --subnet-ids "[\"$SUBNET_ID\"]" `
  --shape-details '{"minimum-bandwidth-in-mbps":10,"maximum-bandwidth-in-mbps":100}' `
  --is-private false `
  --wait-for-state ACTIVE

# Point your domain CNAME to the LB public IP
```

### GitHub Webhooks (Alternative)

Instead of polling, set up webhook listener:

1. Create webhook endpoint (Express/FastAPI server)
2. Register in GitHub repo settings
3. Trigger deployment on `push` events

## Comparison to Vercel

| Feature | Vercel | This Setup |
|---------|--------|------------|
| Auto-deploy on push | ✅ | ✅ |
| Preview deployments | ✅ | ⚠️ (manual) |
| Custom domains | ✅ | ✅ (via OCI LB) |
| SSL certificates | ✅ | ✅ (via OCI LB) |
| Edge functions | ✅ | ❌ |
| Analytics | ✅ | ⚠️ (OCI monitoring) |
| Cost (small app) | $20/mo | ~$5-10/mo |

## Troubleshooting

### "GitHub CLI not authenticated"

```powershell
gh auth login
gh auth status
```

### "OCI CLI not configured"

```powershell
oci setup config
oci iam region list  # Test
```

### "Docker build failed"

Ensure Docker Desktop is running and authenticated to OCIR.

### "Container instance creation failed"

- Check you have service limits for Container Instances
- Verify subnet has internet gateway attached
- Check security list allows egress traffic

### Check Container Logs

```powershell
$INSTANCE_ID = oci container-instances container-instance list `
  --compartment-id $COMPARTMENT_ID `
  --query 'data.items[0].id' --raw-output

oci logging-search search-logs `
  --search-query "search \"$COMPARTMENT_ID\" | where type='oci_container_instances'"
```

## Cost Estimate

For a small Next.js app with light traffic:

- Container Instance (1 OCPU, 1GB RAM): ~$0.015/hour = ~$11/month
- Container Registry: Free (500 GB storage)
- Load Balancer (flexible 10 Mbps): ~$0.014/hour = ~$10/month
- Network egress: ~$1-5/month (10GB free)

**Total: ~$20-25/month** (vs Vercel Pro at $20/mo but with more control)

## Next Steps

1. Set up custom domain with OCI DNS
2. Add SSL certificate to load balancer
3. Configure OCI monitoring and alarms
4. Set up backup/disaster recovery
5. Implement blue-green deployments

## Support

For issues:
- OCI CLI: https://docs.oracle.com/en-us/iaas/tools/oci-cli/latest/
- GitHub CLI: https://cli.github.com/manual/
- Container Instances: https://docs.oracle.com/en-us/iaas/Content/container-instances/home.htm
