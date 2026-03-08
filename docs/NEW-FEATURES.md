# New Features - AI Crop Intelligence Platform

## Overview

Three major features have been added to enhance precision agriculture capabilities:

1. **Sowing & Irrigation Calendars** - Precision timing for planting and water management
2. **Nutrient Management & Fertilizer Calculator** - Prevent Urea overuse with precise calculations
3. **Risk Mitigation** - Pest prediction alerts and harvest timing optimization

## Features

### 1. Sowing Calendar (📅 Tab)

Generate crop-specific sowing calendars based on regional monsoon patterns and climate data.

**API Endpoint:** `POST /api/v1/calendar/sowing`

**Request Body:**
```json
{
  "cropName": "Wheat",
  "locationId": "Maharashtra-Pune",
  "language": "en"
}
```

**Features:**
- Optimal sowing windows with start/end dates
- Monsoon pattern integration
- Climate condition analysis
- Export to PDF or iCal format

### 2. Irrigation Schedule (💧 Tab)

Generate day-by-day irrigation schedules optimized for each crop growth stage.

**API Endpoint:** `POST /api/v1/calendar/irrigation`

**Request Body:**
```json
{
  "cropName": "Rice",
  "growthStage": "vegetative",
  "locationId": "Maharashtra-Pune",
  "language": "en"
}
```

**Features:**
- Day-by-day water requirements
- Growth stage optimization
- Total seasonal water calculation
- Export to PDF or iCal format

### 3. Fertilizer Dose Calculator (🧪 Tab)

Calculate precise fertilizer doses based on soil test results with Urea safety limits.

**API Endpoint:** `POST /api/v1/nutrient-management/calculate`

**Request Body:**
```json
{
  "cropName": "Cotton",
  "soilTestResults": {
    "nitrogenPpm": 250,
    "phosphorusPpm": 15,
    "potassiumPpm": 120,
    "phLevel": 6.5,
    "organicCarbonPercent": 0.5
  },
  "language": "en"
}
```

**Features:**
- NPK, Urea, DAP dose calculations
- Urea over-application prevention (max 200 kg/hectare, 250 for rice)
- Split-dose schedule (basal + top-dressing)
- Cost estimates with breakdown
- Organic fertilizer alternatives
- Soil health warnings

### 4. Risk Assessment (⚠️ Tab)

Assess pest/disease outbreaks, weather risks, and optimize harvest timing.

**API Endpoint:** `POST /api/v1/risk-assessment`

**Request Body:**
```json
{
  "cropName": "Wheat",
  "growthStage": "flowering",
  "locationId": "Maharashtra-Pune",
  "language": "en"
}
```

**Features:**
- Pest outbreak prediction (bollworm, aphids, etc.)
- Disease risk assessment
- Weather-based alerts (frost, heatwave, heavy rain)
- Harvest timing optimization
- Preventive measures and treatments
- Priority-based alert system (>60% probability = high priority)

## Calendar Export

**API Endpoint:** `GET /api/v1/calendar/export/:calendarId?format=pdf|ical`

Export generated calendars in PDF or iCal format for offline reference.

## Technical Implementation

### Backend (server.js)
- In-memory storage using JavaScript Maps (perfect for MVP demo)
- AWS Bedrock Knowledge Base integration (ID: ZQS6EKVSG7)
- Amazon Nova Lite model for AI inference
- 5 new API endpoints

### Frontend (public/index.html)
- Tab-based interface for easy navigation
- Mobile-responsive design (320px+)
- Bilingual support (English/Hindi)
- Real-time form validation
- Export functionality for calendars

### Data Storage
- In-memory Maps for demo (data persists during server session)
- Easy to upgrade to DynamoDB for production
- No database setup required for MVP

## Usage

### Starting the Server

```bash
# Install dependencies (if not already done)
npm install

# Start the server
node server.js
```

The server will start on port 3000 (or PORT environment variable).

### Accessing the Application

Open your browser and navigate to:
- Local: `http://localhost:3000`
- EC2: `http://YOUR_EC2_IP:3000`

### Using the Features

1. **Select a tab** - Choose from 5 available features
2. **Fill the form** - Enter required information
3. **Submit** - Get AI-powered recommendations
4. **Export** (for calendars) - Download PDF or iCal files

## Demo Scenarios

### Scenario 1: Wheat Farmer in Maharashtra
1. Go to "Sowing Calendar" tab
2. Enter: Crop = "Wheat", Location = "Maharashtra-Pune"
3. Get optimal sowing windows based on monsoon patterns
4. Download calendar for offline reference

### Scenario 2: Rice Farmer Needs Fertilizer Advice
1. Go to "Fertilizer Calculator" tab
2. Enter: Crop = "Rice"
3. Enter soil test results (N=250, P=15, K=120, pH=6.5)
4. Get precise NPK/Urea/DAP doses with cost estimates
5. See Urea safety warnings if applicable

### Scenario 3: Cotton Farmer Worried About Pests
1. Go to "Risk Assessment" tab
2. Enter: Crop = "Cotton", Stage = "Flowering", Location = "Maharashtra-Pune"
3. Get pest outbreak predictions (bollworm, aphids)
4. See preventive measures and treatment recommendations
5. Get optimal harvest timing

## Environment Variables

No new environment variables required. Uses existing:
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `KNOWLEDGE_BASE_ID` - Bedrock KB ID (default: ZQS6EKVSG7)
- `PORT` - Server port (default: 3000)

## Deployment

### EC2 Deployment

The app is already deployed on EC2. To update with new features:

```bash
# SSH into EC2
ssh -i ~/.ssh/agritech-key.pem ubuntu@YOUR_EC2_IP

# Navigate to app directory
cd ~/ai-crop-intelligence-platform

# Pull latest code (if using Git)
git pull origin main

# Or upload new files via SCP
# (from local machine)
scp -i ~/.ssh/agritech-key.pem server.js ubuntu@YOUR_EC2_IP:~/
scp -i ~/.ssh/agritech-key.pem public/index.html ubuntu@YOUR_EC2_IP:~/public/

# Restart the app
pm2 restart agritech-platform

# Check logs
pm2 logs agritech-platform
```

## Testing

### Manual Testing

Test each feature by:
1. Filling out the form with valid data
2. Verifying the response is relevant and accurate
3. Testing export functionality (for calendars)
4. Testing with different crops and locations
5. Testing bilingual support (English/Hindi toggle)

### API Testing with curl

```bash
# Test Sowing Calendar
curl -X POST http://localhost:3000/api/v1/calendar/sowing \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Wheat","locationId":"Maharashtra-Pune","language":"en"}'

# Test Fertilizer Calculator
curl -X POST http://localhost:3000/api/v1/nutrient-management/calculate \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Rice","soilTestResults":{"nitrogenPpm":250,"phosphorusPpm":15,"potassiumPpm":120,"phLevel":6.5},"language":"en"}'

# Test Risk Assessment
curl -X POST http://localhost:3000/api/v1/risk-assessment \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Cotton","growthStage":"flowering","locationId":"Maharashtra-Pune","language":"en"}'
```

## Known Limitations (MVP)

1. **In-memory storage** - Data is lost on server restart (upgrade to DynamoDB for production)
2. **Static fertilizer prices** - Uses hardcoded prices (integrate market API for real-time prices)
3. **Simple calendar export** - Basic PDF/iCal format (can enhance with better formatting)
4. **No SMS alerts** - Manual checking only (add AWS SNS for automated alerts)
5. **Mock weather data** - Uses AI predictions (integrate IMD API for real weather forecasts)

## Future Enhancements

1. **Database Integration** - Migrate to AWS DynamoDB for persistent storage
2. **Real-time Market Prices** - Integrate AGMARKNET API
3. **Weather API Integration** - Connect to India Meteorological Department (IMD)
4. **SMS Alerts** - Implement AWS SNS for automated notifications
5. **User Authentication** - Add login/signup with JWT tokens
6. **Historical Tracking** - Store and display farmer's historical data
7. **Advanced Analytics** - Add charts and visualizations
8. **Offline Support** - Progressive Web App (PWA) capabilities

## Support

For issues or questions:
1. Check server logs: `pm2 logs agritech-platform`
2. Verify AWS credentials in `.env` file
3. Ensure Bedrock Knowledge Base is accessible
4. Check EC2 security group allows port 3000

## License

Proprietary - AI Crop Intelligence Platform
