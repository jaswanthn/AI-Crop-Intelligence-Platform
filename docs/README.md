# 📚 Documentation Index

Complete documentation for the AI Crop Intelligence Platform.

## 📖 Quick Navigation

### Getting Started
- **[../README.md](../README.md)** - Project overview and quick start
- **[QUICK-START.md](QUICK-START.md)** - 5-minute setup with test data

### Features & Capabilities
- **[FEATURES.md](FEATURES.md)** - Complete feature list with technical details
- **[NEW-FEATURES.md](NEW-FEATURES.md)** - Latest features (Sowing, Irrigation, Fertilizer, Risk)
- **[ENHANCED-WORKFLOW.md](ENHANCED-WORKFLOW.md)** - Intelligent workflow documentation

### Deployment Guides
- **[EC2-DEPLOY.md](EC2-DEPLOY.md)** - AWS EC2 deployment (Production)
- **[VERCEL-DEPLOY.md](VERCEL-DEPLOY.md)** - Vercel serverless deployment
- **[DEPLOY.md](DEPLOY.md)** - General deployment overview
- **[DEPLOY-NEW-FEATURES.md](DEPLOY-NEW-FEATURES.md)** - Deploying new features

### Development
- **[IMPLEMENTATION-COMPLETE.md](IMPLEMENTATION-COMPLETE.md)** - Implementation summary
- **[../scripts/README.md](../scripts/README.md)** - Data upload scripts
- **[../scripts/QUERY-README.md](../scripts/QUERY-README.md)** - Knowledge Base query testing

### Specifications
- **[../.kiro/specs/ai-crop-intelligence-platform/requirements.md](../.kiro/specs/ai-crop-intelligence-platform/requirements.md)** - 12 requirements, 67 acceptance criteria
- **[../.kiro/specs/ai-crop-intelligence-platform/design.md](../.kiro/specs/ai-crop-intelligence-platform/design.md)** - System architecture and design
- **[../.kiro/specs/ai-crop-intelligence-platform/tasks.md](../.kiro/specs/ai-crop-intelligence-platform/tasks.md)** - Implementation tasks

---

## 🎯 Documentation by Role

### For Farmers
1. Start with [QUICK-START.md](QUICK-START.md) - Learn how to use the platform
2. See [FEATURES.md](FEATURES.md) - Understand what the platform can do

### For Developers
1. Read [../README.md](../README.md) - Setup and API overview
2. Check [FEATURES.md](FEATURES.md) - Technical implementation details
3. Review [../scripts/README.md](../scripts/README.md) - Data management
4. See specifications in `../.kiro/specs/` - Requirements and design

### For DevOps
1. Follow [EC2-DEPLOY.md](EC2-DEPLOY.md) - Production deployment
2. Or [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md) - Serverless deployment
3. Check [DEPLOY-NEW-FEATURES.md](DEPLOY-NEW-FEATURES.md) - Update procedures

### For Product Managers
1. Review [FEATURES.md](FEATURES.md) - Complete feature list
2. Check [NEW-FEATURES.md](NEW-FEATURES.md) - Latest additions
3. See [requirements.md](../.kiro/specs/ai-crop-intelligence-platform/requirements.md) - Product requirements

---

## 📊 Documentation Structure

```
docs/
├── README.md                      # This file (documentation index)
├── FEATURES.md                    # Complete feature list
├── QUICK-START.md                 # Getting started guide
├── NEW-FEATURES.md                # Latest features
├── ENHANCED-WORKFLOW.md           # Workflow documentation
├── EC2-DEPLOY.md                  # AWS EC2 deployment
├── VERCEL-DEPLOY.md               # Vercel deployment
├── DEPLOY.md                      # General deployment
├── DEPLOY-NEW-FEATURES.md         # Feature deployment
└── IMPLEMENTATION-COMPLETE.md     # Implementation summary

../scripts/
├── README.md                      # Data upload guide
└── QUERY-README.md                # Query testing guide

../.kiro/specs/ai-crop-intelligence-platform/
├── requirements.md                # Product requirements
├── design.md                      # System design
└── tasks.md                       # Implementation tasks
```

---

## 🔍 Find What You Need

### "How do I set up the project?"
→ [../README.md](../README.md) - Quick Start section

### "What features are available?"
→ [FEATURES.md](FEATURES.md) - Complete feature list

### "How do I test the platform?"
→ [QUICK-START.md](QUICK-START.md) - Test scenarios with sample data

### "How do I deploy to production?"
→ [EC2-DEPLOY.md](EC2-DEPLOY.md) or [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md)

### "How do I upload new datasets?"
→ [../scripts/README.md](../scripts/README.md) - S3 upload guide

### "What's the system architecture?"
→ [../.kiro/specs/ai-crop-intelligence-platform/design.md](../.kiro/specs/ai-crop-intelligence-platform/design.md)

### "What are the API endpoints?"
→ [../README.md](../README.md) - API Endpoints section

### "How does the workflow work?"
→ [ENHANCED-WORKFLOW.md](ENHANCED-WORKFLOW.md) - Detailed workflow

---

## 📝 Documentation Standards

All documentation follows these standards:
- **Markdown format** for easy reading and version control
- **Code examples** with syntax highlighting
- **Step-by-step instructions** for procedures
- **Screenshots** where helpful (coming soon)
- **Links** to related documentation
- **Last updated** dates at the bottom

---

## 🤝 Contributing to Documentation

Found an error or want to improve documentation?

1. Edit the relevant `.md` file
2. Follow the existing format and style
3. Add examples where helpful
4. Update the "Last Updated" date
5. Submit a pull request

---

## 📞 Need Help?

If you can't find what you're looking for:
1. Check the [../README.md](../README.md) FAQ section
2. Review the [QUICK-START.md](QUICK-START.md) troubleshooting
3. Check AWS Bedrock console for service status
4. Review server logs: `pm2 logs agritech-platform`

---

**Last Updated:** March 2026
