# AI-Crop-Intelligence-Platform

AI-powered crop intelligence platform for Indian farmers using Amazon Bedrock Knowledge Base.

## Features

✅ AI-powered crop recommendations  
✅ Fertilizer and irrigation planning  
✅ Bilingual support (English & Hindi)  
✅ Mobile-responsive interface  
✅ Real-time agricultural insights  

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your AWS credentials:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
KNOWLEDGE_BASE_ID=ZQS6EKVSG7
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 4. Open the App

Go to: http://localhost:3000

## API Endpoints

### POST /api/recommendations

Get crop recommendations based on farmer input.

**Request:**
```json
{
  "tdsValue": 500,
  "phLevel": 7.0,
  "borewellDepth": 50,
  "soilType": "loamy",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": "Based on your soil conditions...",
  "sources": [...],
  "input": {...}
}
```

### POST /api/crop-info

Get detailed information about a specific crop.

**Request:**
```json
{
  "cropName": "wheat",
  "language": "en"
}
```

### POST /api/query

General agricultural query.

**Request:**
```json
{
  "question": "What are the best crops for monsoon season?",
  "language": "en"
}
```

### GET /api/soil-types

Get list of available soil types.

## Project Structure

```
ai-crop-intelligence-platform/
├── server.js                 # Express API server
├── package.json             # Dependencies
├── .env                     # Environment variables (create this)
├── .env.example            # Environment template
├── public/
│   └── index.html          # Frontend UI
├── scripts/
│   ├── upload-datasets-to-s3.js      # Upload CSV to S3
│   └── query-knowledge-base.js       # Query Bedrock KB
└── .kiro/
    └── specs/              # Project specifications
```

## Technology Stack

- **Backend**: Node.js + Express
- **AI**: Amazon Bedrock (Nova Lite model)
- **Knowledge Base**: Amazon Bedrock Knowledge Base
- **Storage**: Amazon S3
- **Database**: DynamoDB (planned)
- **Frontend**: HTML/CSS/JavaScript (vanilla)

## Development

### Add More Data

1. Add CSV files to `scripts/data/csv-files/`
2. Run upload script:
```bash
cd scripts
npm run upload
```
3. Sync Knowledge Base in AWS Console

### Test API

```bash
# Health check
curl http://localhost:3000/health

# Get recommendations
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "tdsValue": 500,
    "phLevel": 7.0,
    "borewellDepth": 50,
    "soilType": "loamy"
  }'
```

## Deployment

### Deploy to AWS

1. **Frontend**: Deploy to S3 + CloudFront
2. **Backend**: Deploy to EC2, ECS, or Lambda
3. **Database**: Use DynamoDB for farmer data
4. **Knowledge Base**: Already configured ✅

### Environment Variables for Production

```bash
NODE_ENV=production
AWS_REGION=us-east-1
KNOWLEDGE_BASE_ID=ZQS6EKVSG7
PORT=3000
```

## Cost Estimate

- **Development**: Free tier eligible
- **Production (10K farmers/month)**:
  - API hosting: $20-50/month
  - Bedrock queries: $20-30/month
  - S3 storage: $1-5/month
  - **Total**: ~$50-100/month

## Next Steps

1. ✅ Basic API working
2. ⏳ Add DynamoDB for data persistence
3. ⏳ Implement user authentication
4. ⏳ Add government API integration
5. ⏳ Build React/React Native frontend
6. ⏳ Deploy to production

## Support

For issues or questions:
- Check AWS Bedrock console for Knowledge Base status
- Verify AWS credentials are configured
- Ensure Knowledge Base is synced with latest data

## License

MIT
