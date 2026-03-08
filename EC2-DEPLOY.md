# AWS EC2 Deployment Guide - Step by Step

## Part 1: Launch EC2 Instance (10 minutes)

### Step 1: Go to EC2 Console

1. Open [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Make sure you're in **US East (N. Virginia)** region (top-right dropdown)
3. Click **Launch Instance** (orange button)

### Step 2: Configure Instance

**Name and tags:**
- Name: `agritech-platform`

**Application and OS Images (AMI):**
- Select: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
- Architecture: **64-bit (x86)**
- ✅ Free tier eligible

**Instance type:**
- Select: **t2.micro** (Free tier eligible)
- 1 vCPU, 1 GB RAM

**Key pair (login):**
- Click **Create new key pair**
- Key pair name: `agritech-key`
- Key pair type: **RSA**
- Private key file format: **.pem** (for Mac/Linux) or **.ppk** (for Windows)
- Click **Create key pair**
- **IMPORTANT**: Save the downloaded file! You can't download it again.

**Network settings:**
- Click **Edit**
- Auto-assign public IP: **Enable**
- Firewall (security groups): **Create security group**
- Security group name: `agritech-sg`
- Description: `Security group for AgriTech platform`

**Add these rules:**

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| HTTP | TCP | 80 | Anywhere (0.0.0.0/0) | Web access |
| HTTPS | TCP | 443 | Anywhere (0.0.0.0/0) | Secure web |
| Custom TCP | TCP | 3000 | Anywhere (0.0.0.0/0) | Node.js app |

**Configure storage:**
- Size: **8 GB** (Free tier eligible)
- Volume type: **gp3**

### Step 3: Launch

1. Review your settings
2. Click **Launch instance**
3. Wait for instance state to show **Running** (2-3 minutes)
4. Note your **Public IPv4 address** (e.g., 3.85.123.45)

---

## Part 2: Connect to EC2 (5 minutes)

### Step 1: Prepare Your Key

**On Mac/Linux:**
```bash
# Move key to safe location
mv ~/Downloads/agritech-key.pem ~/.ssh/

# Set correct permissions
chmod 400 ~/.ssh/agritech-key.pem
```

**On Windows:**
- Use PuTTY with the .ppk file
- Or use Windows Subsystem for Linux (WSL)

### Step 2: Connect via SSH

```bash
# Replace YOUR_EC2_IP with your actual IP
ssh -i ~/.ssh/agritech-key.pem ubuntu@YOUR_EC2_IP
```

You'll see a prompt like:
```
Are you sure you want to continue connecting (yes/no/[fingerprint])? 
```
Type: `yes`

You should now see:
```
ubuntu@ip-172-31-xx-xx:~$
```

✅ You're connected!

---

## Part 3: Install Node.js (5 minutes)

Run these commands on your EC2 instance:

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
# Should show: v20.x.x

npm --version
# Should show: 10.x.x
```

---

## Part 4: Deploy Your App (10 minutes)

### Option A: Upload Files Directly (Recommended)

**From your local machine** (open a new terminal, don't close SSH):

```bash
# Navigate to your project folder
cd /path/to/ai-crop-intelligence-platform

# Create a tarball (excluding node_modules and .env)
tar -czf app.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='scripts/data' \
  --exclude='temp-downloads' \
  server.js package.json public/ .env.example

# Upload to EC2
scp -i ~/.ssh/agritech-key.pem app.tar.gz ubuntu@YOUR_EC2_IP:~/

# Back to your SSH session, extract files
cd ~
tar -xzf app.tar.gz
```

### Option B: Clone from GitHub

**On EC2:**
```bash
# Install git
sudo apt install git -y

# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

## Part 5: Configure Environment (5 minutes)

**On EC2:**

```bash
# Create .env file
nano .env
```

**Add these lines** (replace with your actual values):
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
KNOWLEDGE_BASE_ID=ZQS6EKVSG7
PORT=3000
NODE_ENV=production
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## Part 6: Install Dependencies & Start App (5 minutes)

```bash
# Install dependencies
npm install

# Install PM2 (process manager)
sudo npm install -g pm2

# Start the app
pm2 start server.js --name agritech-platform

# Check status
pm2 status

# View logs
pm2 logs agritech-platform

# Make PM2 start on system reboot
pm2 startup
# Copy and run the command it shows

pm2 save
```

---

## Part 7: Test Your App (2 minutes)

**Open your browser:**
```
http://YOUR_EC2_IP:3000
```

You should see your AgriTech platform! 🎉

---

## Part 8: Set Up Nginx (Optional but Recommended - 10 minutes)

This allows you to access your app on port 80 (without :3000)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/agritech
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save and exit** (Ctrl+X, Y, Enter)

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/agritech /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

**Now access your app at:**
```
http://YOUR_EC2_IP
```
(No port number needed!)

---

## Part 9: Set Up Custom Domain (Optional - 15 minutes)

### Step 1: Get a Domain

Buy a domain from:
- Namecheap
- GoDaddy
- AWS Route 53

### Step 2: Point Domain to EC2

**In your domain registrar's DNS settings:**

Add an **A Record**:
- Type: `A`
- Name: `@` (or leave blank for root domain)
- Value: `YOUR_EC2_IP`
- TTL: `300`

Add a **CNAME Record** (for www):
- Type: `CNAME`
- Name: `www`
- Value: `yourdomain.com`
- TTL: `300`

### Step 3: Update Nginx

```bash
sudo nano /etc/nginx/sites-available/agritech
```

Change:
```nginx
server_name YOUR_EC2_IP;
```

To:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

```bash
# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Add SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)
```

**Your app is now at:**
```
https://yourdomain.com
```

---

## Useful Commands

### Managing Your App

```bash
# View app status
pm2 status

# View logs
pm2 logs agritech-platform

# Restart app
pm2 restart agritech-platform

# Stop app
pm2 stop agritech-platform

# Start app
pm2 start agritech-platform

# View real-time logs
pm2 logs agritech-platform --lines 100
```

### Updating Your App

```bash
# Stop the app
pm2 stop agritech-platform

# Pull latest code (if using Git)
git pull origin main

# Or upload new files via SCP

# Install new dependencies
npm install

# Restart app
pm2 restart agritech-platform
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
# Press 'q' to exit

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### Can't connect via SSH

**Solution:**
1. Check security group allows SSH (port 22) from your IP
2. Verify key file permissions: `chmod 400 agritech-key.pem`
3. Check instance is running in EC2 console

### App not accessible on port 3000

**Solution:**
1. Check security group allows port 3000
2. Verify app is running: `pm2 status`
3. Check logs: `pm2 logs`

### Nginx shows error

**Solution:**
```bash
# Check Nginx configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Out of memory

**Solution:**
```bash
# Add swap space
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Security Best Practices

✅ **DO:**
- Keep system updated: `sudo apt update && sudo apt upgrade`
- Use strong passwords
- Limit SSH access to your IP only
- Enable firewall: `sudo ufw enable`
- Regular backups
- Monitor logs

❌ **DON'T:**
- Share your .pem key file
- Allow SSH from 0.0.0.0/0 in production
- Run as root user
- Commit .env to Git

---

## Cost Estimate

**Free Tier (First 12 months):**
- t2.micro instance: 750 hours/month (FREE)
- 30 GB storage: FREE
- 15 GB data transfer out: FREE

**After Free Tier:**
- t2.micro: ~$8-10/month
- Storage: ~$1/month
- Data transfer: ~$1-5/month
- **Total: ~$10-16/month**

---

## Quick Reference

**Your EC2 Details:**
- Instance ID: `i-xxxxxxxxx` (from EC2 console)
- Public IP: `YOUR_EC2_IP`
- SSH: `ssh -i ~/.ssh/agritech-key.pem ubuntu@YOUR_EC2_IP`
- App URL: `http://YOUR_EC2_IP:3000` or `http://YOUR_EC2_IP` (with Nginx)

**Important Files:**
- App: `~/server.js`
- Environment: `~/.env`
- Nginx config: `/etc/nginx/sites-available/agritech`
- Logs: `pm2 logs` or `/var/log/nginx/`

---

## Next Steps

1. ✅ Deploy app to EC2
2. ✅ Test with sample data
3. ✅ Set up Nginx (optional)
4. ✅ Get custom domain (optional)
5. ✅ Add SSL certificate (optional)
6. ✅ Share URL with stakeholders

Your AI-Crop-Intelligence-Platform is now live on AWS! 🚀
