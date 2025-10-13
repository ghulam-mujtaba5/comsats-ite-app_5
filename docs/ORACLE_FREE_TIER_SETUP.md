# Oracle Cloud Always Free Tier Setup Guide

This guide will help you set up **continuous deployment** to Oracle Cloud's **Always Free Tier** using GitHub Actions.

## 🎯 What You'll Get

- ✅ **100% Free Forever** - Oracle Always Free Tier
- ✅ **Automatic Deployment** - Every push to `main` deploys automatically
- ✅ **ARM-based VM** - 4 OCPUs, 24GB RAM (Ampere A1)
- ✅ **Full Next.js Support** - All API routes, SSR, everything works
- ✅ **No Credit Card Charges** - Stays within free tier limits

---

## 📋 Prerequisites

1. Oracle Cloud account (free tier)
2. GitHub repository with your code
3. Basic terminal/SSH knowledge

---

## 🚀 Setup Steps

### Step 1: Create OCI Compute Instance (Always Free)

1. **Login to Oracle Cloud Console**: https://cloud.oracle.com

2. **Create a Compute Instance**:
   ```
   Navigation: Compute → Instances → Create Instance
   ```

3. **Configure Instance** (Always Free Settings):
   - **Name**: `comsats-app-server`
   - **Image**: `Oracle Linux 8` or `Ubuntu 22.04`
   - **Shape**: `VM.Standard.A1.Flex` (ARM-based - Always Free)
   - **OCPUs**: 4 (max for free tier)
   - **Memory**: 24 GB (max for free tier)
   - **Boot Volume**: 50 GB (max for free tier)
   - **Network**: Create new VCN or use existing
   - **Public IP**: Assign a permanent public IP
   - **SSH Keys**: Generate or upload your SSH public key

4. **Note Down**:
   - ✍️ Public IP address: `___________________`
   - ✍️ SSH private key saved to: `___________________`

### Step 2: Configure Firewall Rules

1. **Open Port 80 in Security List**:
   ```
   Navigation: Networking → Virtual Cloud Networks → Your VCN → Security Lists → Default Security List
   ```

2. **Add Ingress Rule**:
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Destination Port Range**: `80`
   - **Description**: `HTTP for Next.js app`

3. **On the VM itself** (SSH into your instance):
   ```bash
   # Allow HTTP through firewall
   sudo firewall-cmd --permanent --add-port=80/tcp
   sudo firewall-cmd --reload
   
   # OR for Ubuntu:
   sudo ufw allow 80/tcp
   sudo ufw enable
   ```

### Step 3: Install Docker on Compute Instance

SSH into your instance:
```bash
ssh -i path/to/your-ssh-key opc@YOUR_INSTANCE_IP
```

Install Docker:

**For Oracle Linux 8:**
```bash
# Install Docker
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker opc
```

**For Ubuntu:**
```bash
# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker ubuntu
```

**Log out and log back in** for group changes to take effect.

Verify:
```bash
docker --version
```

### Step 4: Get OCI API Keys

1. **Generate API Key**:
   ```
   Navigation: Profile Icon (top-right) → User Settings → API Keys → Add API Key
   ```

2. **Download**:
   - Private key (PEM file)
   - Copy the configuration file preview shown

3. **Note Down** from the config preview:
   - ✍️ `user` (OCI_USER_OCID): `ocid1.user.oc1...`
   - ✍️ `fingerprint` (OCI_FINGERPRINT): `aa:bb:cc:dd:...`
   - ✍️ `tenancy` (OCI_TENANCY_OCID): `ocid1.tenancy.oc1...`
   - ✍️ `region` (OCI_REGION): `ap-mumbai-1`
   - ✍️ Private key content from downloaded PEM file

### Step 5: Set Up GitHub Secrets

Go to your GitHub repository:
```
Settings → Secrets and variables → Actions → New repository secret
```

Add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `OCI_USER_OCID` | Your user OCID | `ocid1.user.oc1..aaaaaa...` |
| `OCI_FINGERPRINT` | API key fingerprint | `aa:bb:cc:dd:ee:...` |
| `OCI_TENANCY_OCID` | Your tenancy OCID | `ocid1.tenancy.oc1..aaaaaa...` |
| `OCI_REGION` | Your region | `ap-mumbai-1` |
| `OCI_PRIVATE_KEY` | Content of PEM file | `-----BEGIN RSA PRIVATE KEY-----\n...` |
| `OCI_INSTANCE_IP` | VM public IP | `152.67.123.45` |
| `OCI_SSH_PRIVATE_KEY` | SSH private key for VM | `-----BEGIN RSA PRIVATE KEY-----\n...` |

**Application Environment Variables** (from Vercel):
| Secret Name | Value from Vercel |
|-------------|-------------------|
| `RESEND_API_KEY` | `re_Hup7daQU_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` |
| `NEXT_PUBLIC_SITE_URL` | `https://campusaxis.site` (update to your IP/domain) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-LRBBBT2FCN` |
| `MONGODB_URI` | `mongodb+srv://db:db@...` |
| `MONGODB_DB` | `campusaxis0` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ctixprrqbnfivhepifsa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_DB_PASSWORD` | `4DaV%pM&BZ.nxKQ` |
| `SUPABASE_DB_URL` | `postgres://postgres:...` |

### Step 6: Test Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add OCI deployment workflow"
   git push origin main
   ```

2. **Watch GitHub Actions**:
   ```
   GitHub → Actions tab → Watch the deployment
   ```

3. **Access Your App**:
   ```
   http://YOUR_INSTANCE_IP
   ```

---

## 🔄 How Continuous Deployment Works

1. You push code to GitHub `main` branch
2. GitHub Actions workflow triggers automatically
3. Builds Docker image with your latest code
4. Uploads image to your OCI compute instance
5. Stops old container, starts new one
6. Your app is live with zero downtime!

---

## 📊 Free Tier Limits

Your deployment stays 100% free with:
- ✅ 4 ARM-based OCPUs
- ✅ 24 GB RAM
- ✅ 50 GB boot volume
- ✅ 10 TB outbound data transfer per month
- ✅ Public IPv4 address
- ✅ Unlimited incoming traffic

**No charges. No expiration. Free forever.**

---

## 🔧 Useful Commands

### SSH into your VM:
```bash
ssh -i path/to/ssh-key opc@YOUR_IP
```

### View running containers:
```bash
sudo docker ps
```

### View logs:
```bash
sudo docker logs comsats-app
sudo docker logs -f comsats-app  # Follow logs
```

### Restart container:
```bash
sudo docker restart comsats-app
```

### Manual deployment:
```bash
# Trigger manually from GitHub Actions tab
Actions → Deploy to Oracle Cloud → Run workflow
```

---

## 🌐 Custom Domain Setup (Optional)

1. **Get your domain** (e.g., from Namecheap, Cloudflare)

2. **Add DNS A Record**:
   ```
   Type: A
   Name: @
   Value: YOUR_INSTANCE_IP
   TTL: 3600
   ```

3. **Update secrets**:
   - Change `NEXT_PUBLIC_SITE_URL` to your domain
   - Re-deploy

4. **Set up Nginx (for HTTPS)**:
   ```bash
   sudo dnf install -y nginx certbot python3-certbot-nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🐛 Troubleshooting

### Deployment fails?
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure Docker is running on VM: `sudo systemctl status docker`

### Can't access the site?
- Check firewall rules (port 80 open)
- Verify container is running: `sudo docker ps`
- Check logs: `sudo docker logs comsats-app`

### Out of disk space?
```bash
# Clean old Docker images
sudo docker system prune -a -f
```

---

## 💡 Tips

1. **Monitor your deployment**: GitHub Actions provides logs for every deployment
2. **Rollback**: Re-run a previous successful workflow to rollback
3. **Environment-specific configs**: Add production environment variables in GitHub Secrets
4. **Scale up**: If you need more resources, OCI offers paid tiers starting at $0.01/hour

---

## 📞 Support

- Oracle Cloud Docs: https://docs.oracle.com/en-us/iaas/
- GitHub Actions Docs: https://docs.github.com/en/actions
- OCI Free Tier: https://www.oracle.com/cloud/free/

---

**🎉 You're all set! Every push to `main` will automatically deploy to your Oracle Cloud instance.**
