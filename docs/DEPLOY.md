# Heroku Deployment Guide

## Step-by-Step Deployment

### 1. Install Heroku CLI

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Windows:**
Download from: https://devcenter.heroku.com/articles/heroku-cli

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login to Heroku

```bash
heroku login
```

This will open a browser window. Log in with your Heroku account (create one if needed at heroku.com).

### 3. Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for Heroku deployment"
```

### 4. Create Heroku App

```bash
# Create app (Heroku will generate a random name)
heroku create

# Or create with a specific name
heroku create agritech-platform-demo
```

You'll see output like:
```
Creating ⬢ agritech-platform-demo... done
https://agritech-platform-demo.herokuapp.com/ | https://git.heroku.com/agritech-platform-demo.git
```

### 5. Set Environment Variables

```bash
# Set AWS credentials
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_ACCESS_KEY_ID=your-access-key-here
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret-key-here

# Set Knowledge Base ID
heroku config:set KNOWLEDGE_BASE_ID=ZQS6EKVSG7

# Set Node environment
heroku config:set NODE_ENV=production
```

### 6. Deploy to Heroku

```bash
# Push to Heroku
git push heroku main

# Or if your branch is named 'master'
git push heroku master
```

You'll see build logs. Wait for:
```
remote: -----> Launching...
remote:        Released v1
remote:        https://agritech-platform-demo.herokuapp.com/ deployed to Heroku
```

### 7. Open Your App

```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

### 8. View Logs (if needed)

```bash
# View real-time logs
heroku logs --tail

# View recent logs
heroku logs
```

## Troubleshooting

### Error: "Application Error"

Check logs:
```bash
heroku logs --tail
```

Common issues:
1. **Missing environment variables** - Set them with `heroku config:set`
2. **Port binding** - Make sure server.js uses `process.env.PORT`
3. **Dependencies** - Ensure all packages are in `package.json`

### Update Environment Variables

```bash
# View current config
heroku config

# Update a variable
heroku config:set AWS_ACCESS_KEY_ID=new-key

# Remove a variable
heroku config:unset VARIABLE_NAME
```

### Redeploy After Changes

```bash
git add .
git commit -m "Update description"
git push heroku main
```

### Scale Dynos

```bash
# Check current dynos
heroku ps

# Scale up (if needed)
heroku ps:scale web=1
```

## Heroku Free Tier Limits

- ✅ 550-1000 free dyno hours/month
- ✅ Sleeps after 30 min of inactivity
- ✅ Wakes up on first request (may take 10-30 seconds)
- ✅ Perfect for demos and prototypes

## Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add www.yourdomain.com

# View DNS targets
heroku domains
```

Then update your DNS records to point to Heroku.

## Useful Commands

```bash
# Restart app
heroku restart

# Run commands on Heroku
heroku run node --version

# Access bash shell
heroku run bash

# View app info
heroku info

# Delete app (careful!)
heroku apps:destroy --app your-app-name
```

## Cost

- **Free tier**: $0/month (with limitations)
- **Hobby tier**: $7/month (no sleep, custom domains)
- **Production tier**: $25+/month (better performance)

For your 3-day demo, free tier is perfect!

## Next Steps After Deployment

1. ✅ Test the live URL
2. ✅ Share URL with stakeholders
3. ✅ Monitor logs during demo
4. ✅ Keep Heroku dashboard open during presentation

## Support

- Heroku Dashboard: https://dashboard.heroku.com/apps
- Heroku Docs: https://devcenter.heroku.com/
- Status: https://status.heroku.com/
