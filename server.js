const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } = require('@aws-sdk/client-bedrock-agent-runtime');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Bedrock Client
const bedrockClient = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const CONFIG = {
  knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID || 'ZQS6EKVSG7',
  modelArn: 'arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0',
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI-Crop-Intelligence-Platform API is running' });
});

// Query Knowledge Base
async function queryKnowledgeBase(question) {
  const command = new RetrieveAndGenerateCommand({
    input: {
      text: question,
    },
    retrieveAndGenerateConfiguration: {
      type: 'KNOWLEDGE_BASE',
      knowledgeBaseConfiguration: {
        knowledgeBaseId: CONFIG.knowledgeBaseId,
        modelArn: CONFIG.modelArn,
      },
    },
  });

  const response = await bedrockClient.send(command);
  return response;
}

// API Endpoints

// 1. Get crop recommendations based on farmer input
app.post('/api/recommendations', async (req, res) => {
  try {
    const { tdsValue, phLevel, borewellDepth, soilType, language = 'en' } = req.body;

    // Validate input
    if (!tdsValue || !phLevel || !borewellDepth || !soilType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['tdsValue', 'phLevel', 'borewellDepth', 'soilType']
      });
    }

    // Build question for Knowledge Base
    const question = `Based on the following agricultural parameters:
- Water TDS: ${tdsValue} ppm
- Soil pH: ${phLevel}
- Borewell depth: ${borewellDepth} meters
- Soil type: ${soilType}

Please provide:
1. Top 3 most suitable crops with suitability scores
2. Fertilizer recommendations (types, quantities, timing)
3. Irrigation schedule (frequency, water volume)
4. Expected yield estimates

${language === 'hi' ? 'Please provide the response in Hindi.' : ''}`;

    console.log(`📊 Processing recommendation request for ${soilType} soil...`);

    const response = await queryKnowledgeBase(question);

    res.json({
      success: true,
      recommendations: response.output.text,
      sources: response.citations || [],
      input: { tdsValue, phLevel, borewellDepth, soilType }
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message
    });
  }
});

// 2. Get specific crop information
app.post('/api/crop-info', async (req, res) => {
  try {
    const { cropName, language = 'en' } = req.body;

    if (!cropName) {
      return res.status(400).json({ error: 'Crop name is required' });
    }

    const question = `Provide detailed information about ${cropName} crop including:
- Ideal soil conditions
- Water requirements
- Fertilizer needs
- Growth duration
- Expected yield
${language === 'hi' ? 'Please provide the response in Hindi.' : ''}`;

    const response = await queryKnowledgeBase(question);

    res.json({
      success: true,
      cropInfo: response.output.text,
      sources: response.citations || []
    });

  } catch (error) {
    console.error('Error getting crop info:', error);
    res.status(500).json({
      error: 'Failed to get crop information',
      message: error.message
    });
  }
});

// 3. General agricultural query
app.post('/api/query', async (req, res) => {
  try {
    const { question, language = 'en' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const fullQuestion = language === 'hi' 
      ? `${question}\n\nPlease provide the response in Hindi.`
      : question;

    const response = await queryKnowledgeBase(fullQuestion);

    res.json({
      success: true,
      answer: response.output.text,
      sources: response.citations || []
    });

  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message
    });
  }
});

// 4. Get available soil types
app.get('/api/soil-types', (req, res) => {
  res.json({
    soilTypes: [
      { value: 'clay', label: 'Clay', labelHindi: 'चिकनी मिट्टी' },
      { value: 'sandy', label: 'Sandy', labelHindi: 'रेतीली मिट्टी' },
      { value: 'loamy', label: 'Loamy', labelHindi: 'दोमट मिट्टी' },
      { value: 'silty', label: 'Silty', labelHindi: 'गाद मिट्टी' },
      { value: 'peaty', label: 'Peaty', labelHindi: 'पीटयुक्त मिट्टी' },
      { value: 'chalky', label: 'Chalky', labelHindi: 'चाकयुक्त मिट्टी' },
      { value: 'laterite', label: 'Laterite', labelHindi: 'लैटेराइट मिट्टी' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server (only if not in Vercel serverless environment)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🌾 AI-Crop-Intelligence-Platform API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API endpoints:`);
    console.log(`   POST /api/recommendations - Get crop recommendations`);
    console.log(`   POST /api/crop-info - Get specific crop information`);
    console.log(`   POST /api/query - General agricultural query`);
    console.log(`   GET  /api/soil-types - Get available soil types`);
  });
}

// Export for Vercel
module.exports = app;
