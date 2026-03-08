# Vercel Deployment Guide

## Method 1: Deploy via Vercel Dashboard (Easiest - No CLI)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add AI Crop Intelligence Platform"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** (use GitHub account)
3. Click **Add New** → **Project**
4. **Import** your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: `public`
6. Click **Deploy**

### Step 3: Add Environment Variables

1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Name | Value |
|------|-------|
| `AWS_REGION` | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | `your-access-key` |
| `AWS_SECRET_ACCESS_KEY` | `your-secret-key` |
| `KNOWLEDGE_BASE_ID` | `ZQS6EKVSG7` |
| `NODE_ENV` | `production` |

4. Click **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

### Step 5: Open Your App

Your app will be live at: `https://your-project-name.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? agritech-platform
# - Directory? ./
```

### Step 4: Set Environment Variables

```bash
vercel env add AWS_REGION
# Enter: us-east-1

vercel env add AWS_ACCESS_KEY_ID
# Enter: your-access-key

vercel env add AWS_SECRET_ACCESS_KEY
# Enter: your-secret-key

vercel env add KNOWLEDGE_BASE_ID
# Enter: ZQS6EKVSG7

vercel env add NODE_ENV
# Enter: production
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Vercel Features

✅ **Automatic HTTPS** - Free SSL certificate  
✅ **Global CDN** - Fast worldwide  
✅ **Auto-scaling** - Handles traffic spikes  
✅ **Zero config** - Works out of the box  
✅ **Git integration** - Auto-deploy on push  
✅ **Free tier** - Perfect for demos  

---

## Project Structure for Vercel

```
ai-crop-intelligence-platform/
├── api/
│   └── index.js          # Serverless function entry
├── public/
│   └── index.html        # Static frontend
├── server.js             # Express app
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

---

## Automatic Deployments

Once connected to GitHub:

1. Push to `main` branch
2. Vercel automatically deploys
3. Get preview URL for each commit
4. Production URL updates on merge

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel deploys automatically!
```

---

## Custom Domain (Optional)

1. Go to project **Settings** → **Domains**
2. Add your domain: `www.yourdomain.com`
3. Update DNS records as shown
4. Vercel handles SSL automatically

---

## Monitoring & Logs

### View Logs

1. Go to project dashboard
2. Click **Deployments**
3. Click on a deployment
4. View **Build Logs** and **Function Logs**

### Real-time Logs (CLI)

```bash
vercel logs
```

---

## Troubleshooting

### Error: "Serverless Function has timed out"

Vercel free tier has 10-second timeout. If Bedrock queries take longer:

**Solution**: Upgrade to Pro plan ($20/month) for 60-second timeout.

### Error: "Environment variables not found"

**Solution**: 
1. Add variables in Vercel dashboard
2. Redeploy the project

### Error: "Module not found"

**Solution**: Ensure all dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

## Vercel vs Heroku

| Feature | Vercel | Heroku |
|---------|--------|--------|
| **Setup** | 2 minutes | 5 minutes |
| **Free tier** | Generous | Limited hours |
| **Cold start** | ~1 second | ~10 seconds |
| **SSL** | Automatic | Manual setup |
| **CDN** | Global | No |
| **Best for** | Demos, production | Long-running apps |

---

## Cost

- **Free tier**: 
  - 100 GB bandwidth/month
  - 100 serverless function executions/day
  - Unlimited projects
  - Perfect for your demo!

- **Pro tier** ($20/month):
  - Unlimited bandwidth
  - Unlimited executions
  - 60-second function timeout
  - Team collaboration

---

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs

# List deployments
vercel ls

# Remove project
vercel remove
```

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test the live URL
3. ✅ Share with stakeholders
4. ✅ Set up custom domain (optional)
5. ✅ Enable auto-deploy from GitHub

---

## Support

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Status: https://vercel-status.com/
