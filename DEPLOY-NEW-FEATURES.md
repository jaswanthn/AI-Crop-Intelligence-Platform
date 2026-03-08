# Deploy New Features to EC2

## Quick Deployment Guide

Your three new features are ready to deploy! Follow these steps to update your EC2 instance.

## Option 1: Upload Files via SCP (Recommended)

### Step 1: From your local machine

```bash
# Navigate to your project directory
cd /path/to/AI-Crop-Intelligence-Platform

# Upload updated server.js
scp -i ~/.ssh/agritech-key.pem server.js ubuntu@54.91.239.135:~/

# Upload updated index.html
scp -i ~/.ssh/agritech-key.pem public/index.html ubuntu@54.91.239.135:~/public/
```

### Step 2: SSH into EC2 and restart

```bash
# SSH into EC2
ssh -i ~/.ssh/agritech-key.pem ubuntu@54.91.239.135

# Restart the app
pm2 restart agritech-platform

# Check if it's running
pm2 status

# View logs to confirm new features loaded
pm2 logs agritech-platform --lines 20
```

You should see in the logs:
```
🌾 AI-Crop-Intelligence-Platform API running on port 3000
📍 Health check: http://localhost:3000/health
🔗 API endpoints:
   POST /api/recommendations - Get crop recommendations
   POST /api/crop-info - Get specific crop information
   POST /api/query - General agricultural query
   GET  /api/soil-types - Get available soil types

🆕 NEW FEATURES:
   POST /api/v1/calendar/sowing - Generate sowing calendar
   POST /api/v1/calendar/irrigation - Generate irrigation schedule
   GET  /api/v1/calendar/export/:id - Export calendar (PDF/iCal)
   POST /api/v1/nutrient-management/calculate - Calculate fertilizer doses
   POST /api/v1/risk-assessment - Assess pest/disease/weather risks
```

### Step 3: Test in browser

Open: `http://54.91.239.135:3000`

You should see 5 tabs:
- 🌱 Crop Recommendations (existing)
- 📅 Sowing Calendar (NEW)
- 💧 Irrigation Schedule (NEW)
- 🧪 Fertilizer Calculator (NEW)
- ⚠️ Risk Assessment (NEW)

## Option 2: Using Git (If you have a repository)

### Step 1: Commit and push changes

```bash
# From local machine
git add server.js public/index.html NEW-FEATURES.md
git commit -m "Add three new features: sowing calendars, fertilizer calculator, risk assessment"
git push origin main
```

### Step 2: Pull on EC2

```bash
# SSH into EC2
ssh -i ~/.ssh/agritech-key.pem ubuntu@54.91.239.135

# Navigate to app directory
cd ~/ai-crop-intelligence-platform

# Pull latest changes
git pull origin main

# Restart app
pm2 restart agritech-platform

# Check logs
pm2 logs agritech-platform
```

## Testing the New Features

### Test 1: Sowing Calendar

1. Open `http://54.91.239.135:3000`
2. Click "📅 Sowing Calendar" tab
3. Enter:
   - Crop Name: Wheat
   - Location ID: Maharashtra-Pune
4. Click "Generate Sowing Calendar"
5. Wait for AI response
6. Try downloading PDF or iCal

### Test 2: Irrigation Schedule

1. Click "💧 Irrigation Schedule" tab
2. Enter:
   - Crop Name: Rice
   - Growth Stage: Vegetative
   - Location ID: Maharashtra-Pune
3. Click "Generate Irrigation Schedule"
4. Review day-by-day water requirements

### Test 3: Fertilizer Calculator

1. Click "🧪 Fertilizer Calculator" tab
2. Enter:
   - Crop Name: Cotton
   - Nitrogen: 250 ppm
   - Phosphorus: 15 ppm
   - Potassium: 120 ppm
   - pH Level: 6.5
3. Click "Calculate Fertilizer Doses"
4. Review NPK/Urea/DAP recommendations
5. Check for Urea safety warnings

### Test 4: Risk Assessment

1. Click "⚠️ Risk Assessment" tab
2. Enter:
   - Crop Name: Wheat
   - Growth Stage: Flowering
   - Location ID: Maharashtra-Pune
3. Click "Assess Risks"
4. Review pest/disease predictions
5. Check weather-based alerts
6. See harvest timing recommendations

### Test 5: Bilingual Support

1. Click "हिंदी" button at the top
2. Test any feature
3. Verify response is in Hindi

## Troubleshooting

### Issue: App not starting

```bash
# Check PM2 status
pm2 status

# If stopped, start it
pm2 start server.js --name agritech-platform

# View error logs
pm2 logs agritech-platform --err
```

### Issue: Port 3000 not accessible

```bash
# Check if app is listening on port 3000
sudo netstat -tlnp | grep 3000

# Check EC2 security group allows port 3000
# Go to AWS Console → EC2 → Security Groups
# Verify inbound rule for port 3000 from 0.0.0.0/0
```

### Issue: AWS Bedrock errors

```bash
# Verify .env file has correct credentials
cat ~/.env

# Should contain:
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# KNOWLEDGE_BASE_ID=ZQS6EKVSG7
```

### Issue: Old version still showing

```bash
# Hard restart PM2
pm2 delete agritech-platform
pm2 start server.js --name agritech-platform
pm2 save

# Clear browser cache
# Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

## Performance Tips

### Monitor Memory Usage

```bash
# Check memory
free -h

# If low memory, restart PM2
pm2 restart agritech-platform
```

### View Real-time Logs

```bash
# Follow logs in real-time
pm2 logs agritech-platform --lines 100
```

### Check API Response Times

```bash
# Test API speed
time curl -X POST http://localhost:3000/api/v1/calendar/sowing \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Wheat","locationId":"Maharashtra-Pune","language":"en"}'
```

## Demo Preparation Checklist

- [ ] Deploy updated files to EC2
- [ ] Restart PM2 process
- [ ] Test all 5 tabs in browser
- [ ] Test bilingual support (English/Hindi)
- [ ] Test calendar export (PDF/iCal)
- [ ] Prepare demo scenarios (see NEW-FEATURES.md)
- [ ] Test on mobile device
- [ ] Check response times are acceptable
- [ ] Verify AWS Bedrock Knowledge Base is responding
- [ ] Have backup plan if internet is slow

## Demo Scenarios

### Scenario 1: Wheat Farmer Planning Season
1. Show Sowing Calendar for Wheat
2. Demonstrate optimal sowing windows
3. Export calendar to PDF
4. Show how farmer can use offline

### Scenario 2: Rice Farmer Needs Fertilizer Advice
1. Show Fertilizer Calculator
2. Enter soil test results
3. Demonstrate Urea safety limits
4. Show cost estimates
5. Display organic alternatives

### Scenario 3: Cotton Farmer Worried About Pests
1. Show Risk Assessment
2. Demonstrate pest outbreak predictions
3. Show preventive measures
4. Display harvest timing optimization
5. Explain priority-based alerts

## Success Metrics

After deployment, verify:
- ✅ All 5 tabs are visible and functional
- ✅ Each feature returns AI-powered recommendations
- ✅ Calendar export works (PDF and iCal)
- ✅ Bilingual support works (English/Hindi)
- ✅ Mobile responsive design works
- ✅ No console errors in browser
- ✅ PM2 shows app is running
- ✅ Response times are under 10 seconds

## Next Steps After Demo

1. **Collect Feedback** - Note what users like/dislike
2. **Upgrade Storage** - Migrate from in-memory to DynamoDB
3. **Add Real APIs** - Integrate weather and market price APIs
4. **Implement SMS Alerts** - Add AWS SNS for notifications
5. **Add Authentication** - Implement user login/signup
6. **Analytics** - Add usage tracking and charts
7. **Offline Support** - Convert to Progressive Web App (PWA)

## Support

If you encounter issues during deployment:
1. Check PM2 logs: `pm2 logs agritech-platform`
2. Verify AWS credentials in `.env`
3. Test API endpoints with curl
4. Check EC2 security group settings
5. Restart PM2 if needed

Your app is ready for demo! 🚀
