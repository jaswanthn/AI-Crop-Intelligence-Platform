# 🌾 AI Crop Intelligence Platform

> Comprehensive AI-powered agricultural decision support system for Indian farmers

[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange)](https://aws.amazon.com/bedrock/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🎯 What is This?

An end-to-end AI platform that helps Indian farmers make data-driven decisions about:
- **What to grow** - AI-powered crop recommendations
- **When to plant** - Precision sowing calendars based on monsoon patterns
- **How to water** - Daily irrigation schedules optimized for each growth stage
- **What fertilizers to use** - Precise NPK doses to prevent soil damage
- **What risks to watch** - Early warnings for pests, diseases, and weather

**Built with:** AWS Bedrock Knowledge Base + 15+ agricultural datasets + Amazon Nova Lite AI model

---

## ✨ Key Features

### 🌱 Core Features
1. **AI Crop Recommendations** - Top 3 suitable crops with suitability scores
2. **Precision Sowing Calendar** - Optimal planting windows with monsoon data
3. **Intelligent Irrigation Scheduling** - Day-by-day water management
4. **Fertilizer Dose Calculator** - Prevents Urea over-application
5. **Comprehensive Risk Assessment** - Pest, disease, weather, and harvest timing

### 🚀 Smart Workflow
- **One-Click Analysis** - Generate all 4 analyses in parallel
- **Auto-Population** - Data persists across all tabs
- **Bilingual Support** - English + Hindi (हिंदी)
- **Export Options** - PDF and iCal formats

### 📊 Data-Driven
- 15+ agricultural datasets (50MB+)
- 9 years of groundwater data (2012-2021)
- Soil, weather, and crop data for all Indian regions
- Real-time AI processing with AWS Bedrock

**👉 See [docs/FEATURES.md](docs/FEATURES.md) for complete feature list**

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- AWS account with Bedrock access
- AWS credentials configured

### 1. Clone & Install

```bash
git clone <repository-url>
cd AI-Crop-Intelligence-Platform
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
KNOWLEDGE_BASE_ID=ZQS6EKVSG7
PORT=3000
```

### 3. Start Server

```bash
npm start
```

Server starts at: **http://localhost:3000**

### 4. Test with Sample Data

**Maharashtra Cotton Farm:**
```
Water TDS: 450 ppm
Soil pH: 7.2
Borewell Depth: 45 meters
Soil Type: Clay
```

**👉 See [docs/QUICK-START.md](docs/QUICK-START.md) for detailed testing guide**

---

## 📁 Project Structure

```
AI-Crop-Intelligence-Platform/
├── server.js                    # Express API server (9 endpoints)
├── package.json                 # Dependencies
├── .env                         # Environment variables (create this)
│
├── public/
│   └── index.html              # Frontend (5-tab interface)
│
├── scripts/
│   ├── upload-datasets-to-s3.js    # Upload CSV to S3
│   ├── query-knowledge-base.js     # Test Bedrock queries
│   ├── package.json                # Script dependencies
│   └── data/csv-files/             # 15+ agricultural datasets
│
├── docs/
│   ├── FEATURES.md                 # Complete feature list
│   ├── QUICK-START.md              # Testing guide
│   ├── EC2-DEPLOY.md               # AWS EC2 deployment
│   ├── VERCEL-DEPLOY.md            # Vercel deployment
│   ├── NEW-FEATURES.md             # Latest features
│   └── ENHANCED-WORKFLOW.md        # Workflow documentation
│
└── .kiro/specs/                    # Project specifications
    └── ai-crop-intelligence-platform/
        ├── requirements.md         # 12 requirements, 67 criteria
        ├── design.md               # System architecture
        └── tasks.md                # Implementation tasks
```

---

## 🔌 API Endpoints

### Original Features (4 endpoints)
```bash
POST   /api/recommendations          # Get crop recommendations
POST   /api/crop-info                # Get specific crop info
POST   /api/query                    # General agricultural query
GET    /api/soil-types               # Get available soil types
```

### New Features (5 endpoints)
```bash
POST   /api/v1/calendar/sowing       # Generate sowing calendar
POST   /api/v1/calendar/irrigation   # Generate irrigation schedule
GET    /api/v1/calendar/export/:id   # Export calendar (PDF/iCal)
POST   /api/v1/nutrient-management/calculate  # Calculate fertilizer doses
POST   /api/v1/risk-assessment       # Assess risks
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "tdsValue": 450,
    "phLevel": 7.2,
    "borewellDepth": 45,
    "soilType": "clay",
    "language": "en"
  }'
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js 20.x + Express 4.x |
| **AI Model** | Amazon Nova Lite (Bedrock) |
| **Knowledge Base** | AWS Bedrock Knowledge Base |
| **Storage** | Amazon S3 |
| **Embeddings** | Amazon Titan Embeddings |
| **Frontend** | HTML5 + CSS3 + Vanilla JS |
| **Deployment** | AWS EC2 / Vercel |
| **Process Manager** | PM2 |

---

## 📊 Data Sources

### Agricultural Datasets (15+ files)
- **Crop Data**: NPK requirements, rainfall, temperature, humidity
- **Groundwater**: 9 years of data (2012-2021), pre/post-monsoon levels
- **Soil**: Characteristics by region, pH, nutrients, texture
- **Climate**: Solar irradiance, temperature, rainfall patterns
- **Risk**: Historical disaster data for predictions
- **Geographic**: Indian administrative boundaries

**Total Size:** ~50MB of agricultural intelligence

**👉 See [scripts/README.md](scripts/README.md) for data upload instructions**

---

## 🚢 Deployment

### Option 1: AWS EC2 (Production)
```bash
# See EC2-DEPLOY.md for complete guide
ssh ubuntu@your-ec2-ip
git clone <repo>
cd AI-Crop-Intelligence-Platform
npm install
pm2 start server.js --name agritech-platform
```

**👉 See [docs/EC2-DEPLOY.md](docs/EC2-DEPLOY.md) for detailed instructions**

### Option 2: Vercel (Serverless)
```bash
# See docs/VERCEL-DEPLOY.md for complete guide
npm install -g vercel
vercel
```

**👉 See [docs/VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md) for detailed instructions**

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Test All Endpoints
```bash
# Run comprehensive test
bash test-new-features.sh
```

### Manual Testing
Use the test data in [docs/QUICK-START.md](docs/QUICK-START.md):
- Maharashtra Cotton Farm
- Punjab Wheat Farm  
- Karnataka Rice Farm

---

## 💰 Cost Estimate

### Development (Free Tier)
- AWS Bedrock: Free tier eligible
- S3 Storage: Free tier (5GB)
- EC2 t2.micro: Free tier (750 hours/month)

### Production (10K farmers/month)
| Service | Cost |
|---------|------|
| AWS Bedrock (Nova Lite) | ₹1,500-2,500/month |
| S3 Storage (50MB) | ₹50/month |
| EC2 t2.small | ₹500-800/month |
| **Total** | **₹2,000-3,500/month** |

**ROI for Farmers:**
- Fertilizer savings: ₹5,000-10,000/hectare
- Water savings: 30% reduction
- Yield increase: 20-30%

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/README.md](docs/README.md) | Documentation index and navigation |
| [docs/FEATURES.md](docs/FEATURES.md) | Complete feature list with details |
| [docs/QUICK-START.md](docs/QUICK-START.md) | Testing guide with sample data |
| [docs/EC2-DEPLOY.md](docs/EC2-DEPLOY.md) | AWS EC2 deployment guide |
| [docs/VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md) | Vercel deployment guide |
| [docs/NEW-FEATURES.md](docs/NEW-FEATURES.md) | Latest features documentation |
| [docs/ENHANCED-WORKFLOW.md](docs/ENHANCED-WORKFLOW.md) | Workflow details |
| [scripts/README.md](scripts/README.md) | Data upload instructions |

**👉 See [docs/README.md](docs/README.md) for complete documentation index**

---

## 🎯 Use Cases

### For Farmers
- Choose the right crop for their soil and water conditions
- Know exactly when to plant for maximum yield
- Optimize water usage and save costs
- Prevent soil damage from fertilizer overuse
- Get early warnings for pests and diseases

### For Agricultural Officers
- Provide data-driven recommendations to farmers
- Monitor regional crop patterns
- Plan irrigation infrastructure
- Predict and prevent crop failures

### For Researchers
- Access comprehensive agricultural datasets
- Test new farming strategies
- Analyze climate impact on crops
- Develop new AI models

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

**Data Sources:**
- Indian Council of Agricultural Research (ICAR)
- Central Ground Water Board (CGWB)
- India Meteorological Department (IMD)
- Kaggle agricultural datasets

**Technology:**
- AWS Bedrock & S3
- Amazon Nova Lite Model
- Express.js & Node.js

---

## 📞 Support

### Common Issues

**Server won't start:**
- Check AWS credentials in `.env`
- Verify Node.js version (18+)
- Run `npm install` again

**API returns errors:**
- Check Knowledge Base ID is correct
- Verify AWS region is `us-east-1`
- Ensure Knowledge Base is synced

**No AI responses:**
- Check AWS Bedrock console
- Verify Knowledge Base has data
- Check AWS credentials have Bedrock permissions

### Get Help
- Check [docs/QUICK-START.md](docs/QUICK-START.md) for troubleshooting
- Review AWS Bedrock console for errors
- Check server logs: `pm2 logs agritech-platform`
- See [docs/README.md](docs/README.md) for all documentation

---

**Built with ❤️ for Indian Farmers**

*Empowering agriculture through AI and data*


