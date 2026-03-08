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

// In-Memory Storage for MVP Demo
const inMemoryStore = {
  sowingCalendars: new Map(),
  irrigationSchedules: new Map(),
  nutrientPlans: new Map(),
  riskAssessments: new Map(),
  alerts: new Map()
};

// Helper function to generate unique IDs
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

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

// ============================================
// NEW FEATURES: Sowing Calendars, Nutrient Management, Risk Assessment
// ============================================

// 5. Generate Sowing Calendar (Requirement 13)
app.post('/api/v1/calendar/sowing', async (req, res) => {
  try {
    const { cropName, locationId, language = 'en' } = req.body;

    if (!cropName || !locationId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['cropName', 'locationId']
      });
    }

    const question = `For ${cropName} crop in location ${locationId}, provide:
1. Optimal sowing windows with specific start and end dates based on regional monsoon patterns
2. Monsoon onset and withdrawal dates for this region
3. Expected rainfall during the season
4. Climate conditions for each sowing window
5. Optimality score (0-100) for each window

${language === 'hi' ? 'Please provide the response in Hindi.' : ''}`;

    console.log(`📅 Generating sowing calendar for ${cropName}...`);

    const response = await queryKnowledgeBase(question);

    const calendarId = generateId('sowing');
    const calendar = {
      calendarId,
      cropName,
      cropNameHindi: cropName, // TODO: Add translation
      locationId,
      sowingWindows: [], // Parsed from response
      monsoonData: {}, // Parsed from response
      recommendations: response.output.text,
      createdAt: new Date().toISOString()
    };

    inMemoryStore.sowingCalendars.set(calendarId, calendar);

    res.json({
      success: true,
      calendar,
      sources: response.citations || []
    });

  } catch (error) {
    console.error('Error generating sowing calendar:', error);
    res.status(500).json({
      error: 'Failed to generate sowing calendar',
      message: error.message
    });
  }
});

// 6. Generate Daily Irrigation Schedule (Requirement 13)
app.post('/api/v1/calendar/irrigation', async (req, res) => {
  try {
    const { cropName, growthStage, locationId, language = 'en' } = req.body;

    if (!cropName || !growthStage || !locationId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['cropName', 'growthStage', 'locationId']
      });
    }

    const question = `For ${cropName} crop at ${growthStage} growth stage in location ${locationId}, provide:
1. Day-by-day irrigation schedule with specific dates
2. Water volume in liters per hectare for each irrigation event
3. Total seasonal water requirement
4. Growth stage-specific water optimization recommendations
5. Irrigation frequency based on crop needs and water availability

${language === 'hi' ? 'Please provide the response in Hindi.' : ''}`;

    console.log(`💧 Generating irrigation schedule for ${cropName} at ${growthStage}...`);

    const response = await queryKnowledgeBase(question);

    const scheduleId = generateId('irrigation');
    const schedule = {
      scheduleId,
      cropName,
      cropNameHindi: cropName, // TODO: Add translation
      growthStage,
      locationId,
      dailySchedule: [], // Parsed from response
      totalSeasonalWater: 0, // Parsed from response
      recommendations: response.output.text,
      createdAt: new Date().toISOString()
    };

    inMemoryStore.irrigationSchedules.set(scheduleId, schedule);

    res.json({
      success: true,
      schedule,
      sources: response.citations || []
    });

  } catch (error) {
    console.error('Error generating irrigation schedule:', error);
    res.status(500).json({
      error: 'Failed to generate irrigation schedule',
      message: error.message
    });
  }
});

// 7. Calculate Nutrient Management Plan (Requirement 14)
app.post('/api/v1/nutrient-management/calculate', async (req, res) => {
  try {
    const { cropName, soilTestResults, language = 'en' } = req.body;

    if (!cropName || !soilTestResults) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['cropName', 'soilTestResults']
      });
    }

    // Validate soil test results structure
    const requiredFields = ['nitrogenPpm', 'phosphorusPpm', 'potassiumPpm', 'phLevel'];
    const missingFields = requiredFields.filter(field => !soilTestResults[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Incomplete soil test results',
        missingFields
      });
    }

    const question = `For ${cropName} crop with soil test results:
- Nitrogen: ${soilTestResults.nitrogenPpm} ppm
- Phosphorus: ${soilTestResults.phosphorusPpm} ppm
- Potassium: ${soilTestResults.potassiumPpm} ppm
- pH Level: ${soilTestResults.phLevel}
- Organic Carbon: ${soilTestResults.organicCarbonPercent || 'Not provided'}%
- Electrical Conductivity: ${soilTestResults.electricalConductivity || 'Not provided'}

Provide precise fertilizer recommendations:
1. NPK fertilizer doses in kg/hectare
2. Urea doses (IMPORTANT: Do not exceed 200 kg/hectare for most crops, 250 kg/hectare for rice to prevent soil damage)
3. DAP (Di-Ammonium Phosphate) doses
4. Split-dose schedule: Basal application and top-dressing with exact timing in days after sowing
5. Organic fertilizer alternatives (FYM, compost, vermicompost) with equivalent nutrient values
6. Warnings if existing nitrogen levels are high and Urea application may damage soil health

${language === 'hi' ? 'Please provide the response in Hindi.' : ''}`;

    console.log(`🌱 Calculating nutrient management plan for ${cropName}...`);

    const response = await queryKnowledgeBase(question);

    // Static fertilizer prices (INR per kg) for cost estimation
    const fertilizerPrices = {
      'Urea': 6.5,
      'DAP': 27,
      'NPK': 25,
      'Potash': 18,
      'FYM': 2,
      'Compost': 3
    };

    const planId = generateId('nutrient');
    const plan = {
      planId,
      cropName,
      cropNameHindi: cropName, // TODO: Add translation
      soilTestResults,
      fertilizerDoses: [], // Parsed from response
      organicAlternatives: [], // Parsed from response
      costEstimate: {
        totalCostINR: 0,
        breakdown: [],
        prices: fertilizerPrices
      },
      warnings: [], // Parsed from response
      recommendations: response.output.text,
      createdAt: new Date().toISOString()
    };

    inMemoryStore.nutrientPlans.set(planId, plan);

    res.json({
      success: true,
      plan,
      sources: response.citations || []
    });

  } catch (error) {
    console.error('Error calculating nutrient management plan:', error);
    res.status(500).json({
      error: 'Failed to calculate nutrient management plan',
      message: error.message
    });
  }
});

// 8. Assess Risks (Pest, Disease, Weather, Harvest Timing) (Requirement 15)
app.post('/api/v1/risk-assessment', async (req, res) => {
  try {
    const { cropName, growthStage, locationId, language = 'en' } = req.body;

    if (!cropName || !growthStage || !locationId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['cropName', 'growthStage', 'locationId']
      });
    }

    const question = `For ${cropName} crop at ${growthStage} growth stage in location ${locationId}, provide comprehensive risk assessment:

1. PEST RISKS:
   - Identify specific pests (bollworm, aphids, stem borer, etc.)
   - Outbreak probability (0-100%) based on current weather patterns
   - Preventive measures
   - Treatment recommendations if outbreak occurs

2. DISEASE RISKS:
   - Identify potential diseases for this crop and growth stage
   - Outbreak probability (0-100%) based on weather and crop conditions
   - Preventive measures
   - Treatment recommendations

3. WEATHER RISKS:
   - Frost risk and probability
   - Heatwave risk and probability
   - Heavy rain/flooding risk
   - Protective actions for each risk

4. HARVEST TIMING OPTIMIZATION:
   - Optimal harvest date for maximum yield
   - Market price considerations (assume current market is stable)
   - Harvest window (start and end dates)

IMPORTANT: For any risk with probability > 60%, mark it as HIGH PRIORITY alert.

${language === 'hi' ? 'Please provide the response in Hindi.' : ''}`;

    console.log(`⚠️ Assessing risks for ${cropName} at ${growthStage}...`);

    const response = await queryKnowledgeBase(question);

    const assessmentId = generateId('risk');
    const assessment = {
      assessmentId,
      cropName,
      cropNameHindi: cropName, // TODO: Add translation
      growthStage,
      locationId,
      pestRisks: [], // Parsed from response
      diseaseRisks: [], // Parsed from response
      weatherRisks: [], // Parsed from response
      harvestOptimization: {}, // Parsed from response
      prioritizedAlerts: [], // Generated based on >60% probability
      recommendations: response.output.text,
      createdAt: new Date().toISOString()
    };

    inMemoryStore.riskAssessments.set(assessmentId, assessment);

    res.json({
      success: true,
      assessment,
      sources: response.citations || []
    });

  } catch (error) {
    console.error('Error assessing risks:', error);
    res.status(500).json({
      error: 'Failed to assess risks',
      message: error.message
    });
  }
});

// 9. Get Calendar Export (PDF/iCal) (Requirement 13)
app.get('/api/v1/calendar/export/:calendarId', (req, res) => {
  try {
    const { calendarId } = req.params;
    const { format = 'pdf' } = req.query;

    // Check both sowing calendars and irrigation schedules
    const calendar = inMemoryStore.sowingCalendars.get(calendarId) || 
                     inMemoryStore.irrigationSchedules.get(calendarId);

    if (!calendar) {
      return res.status(404).json({
        error: 'Calendar not found',
        calendarId
      });
    }

    if (format === 'pdf') {
      // Simple text-based PDF export for MVP
      const pdfContent = `
AI-Crop-Intelligence-Platform
Calendar Export

Crop: ${calendar.cropName}
Created: ${calendar.createdAt}

${calendar.recommendations}

---
Generated by AI-Crop-Intelligence-Platform
      `.trim();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${calendarId}.txt"`);
      res.send(pdfContent);
    } else if (format === 'ical') {
      // Simple iCal format for MVP
      const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI-Crop-Intelligence-Platform//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${calendar.cropName} Calendar
X-WR-TIMEZONE:Asia/Kolkata
BEGIN:VEVENT
DTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${calendar.cropName} - Review Calendar
DESCRIPTION:${calendar.recommendations.substring(0, 200)}
END:VEVENT
END:VCALENDAR`;

      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename="${calendarId}.ics"`);
      res.send(icalContent);
    } else {
      res.status(400).json({
        error: 'Invalid format',
        supportedFormats: ['pdf', 'ical']
      });
    }

  } catch (error) {
    console.error('Error exporting calendar:', error);
    res.status(500).json({
      error: 'Failed to export calendar',
      message: error.message
    });
  }
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
    console.log(`\n🆕 NEW FEATURES:`);
    console.log(`   POST /api/v1/calendar/sowing - Generate sowing calendar`);
    console.log(`   POST /api/v1/calendar/irrigation - Generate irrigation schedule`);
    console.log(`   GET  /api/v1/calendar/export/:id - Export calendar (PDF/iCal)`);
    console.log(`   POST /api/v1/nutrient-management/calculate - Calculate fertilizer doses`);
    console.log(`   POST /api/v1/risk-assessment - Assess pest/disease/weather risks`);
  });
}

// Export for Vercel
module.exports = app;
