# 🚀 Deployment Guide - COMSATS ITE App

Complete guide for deploying your Next.js application to Oracle Cloud with **continuous deployment**.

## 📊 Deployment Options Comparison

| Feature | Current (Vercel) | Oracle Free Tier | Oracle Static |
|---------|------------------|------------------|---------------|
| **Cost** | $20/month | **$0 FREE** | **$0 FREE** |
| **Resources** | Serverless | 4 CPUs, 24GB RAM | Object Storage |
| **API Routes** | ✅ Yes | ✅ Yes | ❌ Limited |
| **SSR/ISR** | ✅ Yes | ✅ Yes | ❌ No |
| **Auto Deploy** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Easy | ⚠️ Manual | ⚠️ Manual |
| **SSL/HTTPS** | ✅ Auto | ⚠️ Manual | ⚠️ Manual |
| **Build Time** | ~2 min | ~5 min | ~3 min |

## 🎯 Recommended: Oracle Cloud Always Free Tier

### Why Oracle Free Tier?
- ✅ **$0 forever** - No credit card charges, ever
- ✅ **Powerful VM** - 4 ARM CPUs + 24GB RAM
- ✅ **Full Next.js** - All features work (API routes, SSR, ISR)
- ✅ **Auto deployment** - Push to GitHub → auto deploy
- ✅ **10TB/month** data transfer included

### Quick Setup (5 minutes)

1. **Run the quick start wizard**:
   ```powershell
   pwsh scripts/quickstart-oci-free.ps1
   ```

2. **Or follow the manual guide**:
   See [docs/ORACLE_FREE_TIER_SETUP.md](docs/ORACLE_FREE_TIER_SETUP.md)

### What Gets Created

1. **OCI Compute Instance**:
   - VM.Standard.A1.Flex (ARM processor)
   - 4 OCPUs, 24GB RAM, 50GB storage
   - Public IP address
   - Oracle Linux 8 or Ubuntu 22.04

2. **GitHub Actions Workflow**:
   - File: `.github/workflows/deploy-oci-docker.yml`
   - Triggers on every push to `main`
   - Builds Docker image
   - Deploys to your VM automatically

3. **Docker Container**:
   - Runs your Next.js app
   - Exposed on port 80
   - Auto-restarts on failure
   - All environment variables configured

## 📖 Step-by-Step Instructions

### Prerequisites

- Oracle Cloud account (free): https://cloud.oracle.com
- GitHub account with your repository
- OCI CLI configured (we set this up for you!)
- GitHub CLI authenticated

### Step 1: Create OCI Resources

**Option A: Use our setup script** (recommended):
```powershell
pwsh scripts/quickstart-oci-free.ps1
```

**Option B: Manual setup**:
Follow [docs/ORACLE_FREE_TIER_SETUP.md](docs/ORACLE_FREE_TIER_SETUP.md)

### Step 2: Configure GitHub Secrets

The setup script will guide you through this, but you need:

**OCI Secrets**:
- `OCI_USER_OCID` - Your user OCID
- `OCI_FINGERPRINT` - API key fingerprint
- `OCI_TENANCY_OCID` - Tenancy OCID
- `OCI_REGION` - Region (e.g., ap-mumbai-1)
- `OCI_PRIVATE_KEY` - API private key content
- `OCI_INSTANCE_IP` - VM public IP address
- `OCI_SSH_PRIVATE_KEY` - SSH key for VM

**Application Secrets** (from your Vercel settings):
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `MONGODB_URI`
- `MONGODB_DB`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_DB_URL`

**Automated setup**:
```powershell
pwsh scripts/setup-github-secrets.ps1
```

### Step 3: Deploy

Just push to GitHub!

```bash
git add .
git commit -m "Set up OCI deployment"
git push origin main
```

Watch the deployment:
- Go to GitHub → Actions tab
- See the "Deploy to Oracle Cloud" workflow running
- ~5 minutes later, your app is live!

### Step 4: Access Your App

```
http://YOUR_INSTANCE_IP
```

## 🔄 Continuous Deployment Workflow

Every time you push to `main`:

1. ✅ GitHub Actions triggers automatically
2. 🔨 Builds Docker image with latest code
3. 📦 Uploads image to OCI VM
4. 🚀 Deploys new container (stops old one)
5. ✨ Your app is live with zero downtime!

**Build time**: ~5 minutes
**Deployment frequency**: Every push
**Rollback**: Re-run previous successful workflow

## 🛠️ Managing Your Deployment

### View Logs

SSH into your VM:
```bash
ssh -i path/to/ssh-key opc@YOUR_IP
```

View container logs:
```bash
sudo docker logs comsats-app
sudo docker logs -f comsats-app  # Follow logs in real-time
```

### Restart Application

```bash
sudo docker restart comsats-app
```

### Manual Deployment

Trigger from GitHub Actions:
1. Go to Actions → Deploy to Oracle Cloud
2. Click "Run workflow" → "Run workflow"

### Update Environment Variables

1. Update GitHub secrets
2. Re-run the workflow or push new code

### Check Container Status

```bash
sudo docker ps
sudo docker stats comsats-app
```

## 🌐 Custom Domain Setup (Optional)

### 1. Configure DNS

Add A record pointing to your instance IP:
```
Type: A
Name: @
Value: YOUR_INSTANCE_IP
TTL: 3600
```

### 2. Install Nginx + SSL

SSH into your VM:

```bash
# Install Nginx and Certbot
sudo dnf install -y nginx certbot python3-certbot-nginx

# Configure Nginx as reverse proxy
sudo tee /etc/nginx/conf.d/app.conf > /dev/null <<EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Get SSL certificate (free)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Update GitHub Secrets

Change `NEXT_PUBLIC_SITE_URL` to your domain:
```
https://yourdomain.com
```

Re-deploy to apply changes.

## 🐛 Troubleshooting

### Deployment fails?
- Check GitHub Actions logs for errors
- Verify all secrets are set correctly
- Ensure Docker is running: `sudo systemctl status docker`
- Check disk space: `df -h`

### Can't access the site?
- Verify firewall rules (port 80 open)
- Check container is running: `sudo docker ps`
- View logs: `sudo docker logs comsats-app`
- Test locally on VM: `curl localhost:3000`

### Build fails?
- Check if dependencies are up to date
- Verify environment variables are set
- Look for syntax errors in code

### Out of disk space?
```bash
# Clean old Docker images
sudo docker system prune -a -f
```

### Need to rollback?
1. Go to GitHub Actions
2. Find previous successful deployment
3. Click "Re-run all jobs"

## 💰 Cost Breakdown

### Current (Vercel)
- **Hobby Plan**: $0/month (limited)
- **Pro Plan**: $20/month
- **Build minutes**: Limited

### Oracle Free Tier
- **Compute**: $0 (VM.Standard.A1.Flex)
- **Storage**: $0 (50GB boot volume)
- **Network**: $0 (10TB/month)
- **Backup**: Optional ($0.0255/GB/month)

**Total**: **$0/month forever** 🎉

## 📚 Additional Resources

- [Oracle Free Tier Details](https://www.oracle.com/cloud/free/)
- [OCI Documentation](https://docs.oracle.com/en-us/iaas/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## 🎓 What You've Learned

- ✅ Setting up Oracle Cloud Always Free Tier
- ✅ Configuring continuous deployment with GitHub Actions
- ✅ Dockerizing Next.js applications
- ✅ Managing cloud infrastructure
- ✅ Setting up SSL/TLS certificates
- ✅ Deploying full-stack applications

## 🚀 Next Steps

1. **Set up monitoring**: Use OCI Monitoring service (free)
2. **Configure backups**: Automatic VM backups
3. **Add staging environment**: Create another VM for testing
4. **Set up CDN**: Use Cloudflare (free) for better performance
5. **Enable auto-scaling**: Add load balancer (paid)

## 📞 Support

- **Issues**: Open a GitHub issue
- **Oracle Support**: https://www.oracle.com/support/
- **Community**: Oracle Cloud Infrastructure forums

---

**🎉 Congratulations! You now have a professional, production-ready deployment with continuous integration!**

Your app automatically deploys on every push, runs on powerful free infrastructure, and you've learned valuable DevOps skills along the way.
