# Design Document: AI-Powered Crop Intelligence Platform

## Overview

The AI-Powered Crop Intelligence Platform is a mobile-responsive web application that combines government agricultural datasets with farmer-provided field measurements to deliver personalized crop recommendations. The system architecture follows a three-tier design: a presentation layer (mobile-responsive web UI), an application layer (data processing and AI analysis), and a data layer (AWS-hosted databases and caches).

The platform addresses the capital constraints of rural Indian farmers by eliminating the need for expensive IoT sensors while still providing data-driven insights. The architecture is designed with future extensibility in mind, allowing seamless integration of IoT devices (ESP32 microcontrollers) to replace manual inputs without requiring major refactoring.

**New Features (Requirements 13-15):**

The platform has been extended with three major feature sets:

1. **Sowing & Irrigation Calendars (Requirement 13):** Provides precision timing for planting and daily water management. The system generates crop-specific sowing calendars based on regional monsoon patterns and climate data, identifies optimal sowing windows, and sends alerts 7 days before favorable planting conditions. It also creates day-by-day irrigation schedules optimized for each crop growth stage, with calendar export functionality (iCal and PDF) for offline reference.

2. **Nutrient Management & Fertilizer Dose Calculator (Requirement 14):** Enables precise fertilizer application based on soil test results. The system calculates exact doses for NPK, Urea, DAP, and micronutrients while preventing Urea over-application through agronomic safety limits. It provides split-dose recommendations (basal + top-dressing) with exact timing, cost estimates based on current market prices, and organic fertilizer alternatives with equivalent nutrient values.

3. **Risk Mitigation & Harvest Optimization (Requirement 15):** Delivers early warnings and optimal harvest timing. The system predicts pest and disease outbreak probabilities using weather patterns and crop stage data, sends alerts when risks exceed 60%, identifies specific pests (bollworm, aphids) with preventive measures and treatments, generates weather-based risk alerts (frost, heatwave, heavy rain) with protective actions, and recommends optimal harvest timing considering both yield maximization and market price optimization.

Key design principles:
- Mobile-first responsive design for low-end smartphones
- Bilingual support (English and Hindi) throughout the interface
- Offline-capable data entry with sync-on-connect
- Modular data ingestion supporting multiple input sources
- Scalable AWS infrastructure with Bedrock Knowledge Base for AI operations
- Alert scheduling and notification system for timely farmer guidance

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[Mobile Web UI]
        LangSelector[Language Selector]
    end
    
    subgraph "Application Layer"
        API[API Gateway]
        Auth[Authentication Service]
        DataIngestion[Data Ingestion Module]
        FarmerInput[Farmer Input Module]
        AIEngine[AI Intelligence Engine]
        Cache[Cache Manager]
        CalendarExport[Calendar Export Service]
        AlertScheduler[Alert Scheduling Service]
        ExternalData[External Data Integration]
    end
    
    subgraph "Data Layer"
        DB[(Farmer Database)]
        GovCache[(Regional Data Cache)]
        AlertDB[(Alerts Database)]
        CalendarDB[(Calendars Database)]
    end
    
    subgraph "External Services"
        GovAPI[Government APIs]
        Bedrock[AWS Bedrock Knowledge Base]
        WeatherAPI[Weather Forecast API]
        MarketAPI[Market Price API]
        SNS[AWS SNS - SMS Alerts]
    end
    
    UI --> API
    LangSelector --> UI
    API --> Auth
    API --> DataIngestion
    API --> FarmerInput
    API --> AIEngine
    API --> CalendarExport
    API --> AlertScheduler
    
    DataIngestion --> GovAPI
    DataIngestion --> Cache
    Cache --> GovCache
    
    FarmerInput --> DB
    AIEngine --> DB
    AIEngine --> GovCache
    AIEngine --> Bedrock
    AIEngine --> ExternalData
    
    ExternalData --> WeatherAPI
    ExternalData --> MarketAPI
    ExternalData --> Cache
    
    CalendarExport --> CalendarDB
    AlertScheduler --> AlertDB
    AlertScheduler --> SNS
    
    style UI fill:#e1f5ff
    style AIEngine fill:#fff4e1
    style Bedrock fill:#fff4e1
    style DB fill:#f0f0f0
    style GovAPI fill:#e8f5e9
    style WeatherAPI fill:#e8f5e9
    style MarketAPI fill:#e8f5e9
```

### Component Interaction Flow

```mermaid
sequenceDiagram
    participant F as Farmer
    participant UI as Web UI
    participant API as API Gateway
    participant DI as Data Ingestion
    participant FI as Farmer Input
    participant AI as AI Engine
    participant DB as Database
    participant Gov as Government API
    
    F->>UI: Select location
    UI->>API: Request regional data
    API->>DI: Fetch regional data
    DI->>Gov: Query water/soil/mineral data
    Gov-->>DI: Return regional data
    DI->>DB: Cache regional data (30 days)
    DI-->>API: Return regional data
    API-->>UI: Display regional context
    
    F->>UI: Enter manual inputs (TDS, pH, depth, soil)
    UI->>API: Submit farmer data
    API->>FI: Validate and store inputs
    FI->>DB: Persist farmer data
    FI-->>API: Confirmation
    
    API->>AI: Request recommendations
    AI->>DB: Fetch regional + farmer data
    DB-->>AI: Return combined data
    AI->>AI: Calculate suitability scores
    AI->>AI: Generate fertilizer plan
    AI->>AI: Generate irrigation schedule
    AI->>AI: Estimate yield
    AI-->>API: Return recommendations
    API-->>UI: Display recommendations
    UI-->>F: Show results in selected language
```

### New Features Interaction Flow (Requirements 13-15)

```mermaid
sequenceDiagram
    participant F as Farmer
    participant UI as Web UI
    participant API as API Gateway
    participant AI as AI Engine
    participant Bedrock as AWS Bedrock KB
    participant Ext as External Data Service
    participant Alert as Alert Scheduler
    participant DB as Database
    
    Note over F,DB: Sowing Calendar Generation (Req 13)
    F->>UI: Request sowing calendar for crop
    UI->>API: POST /api/v1/calendar/sowing
    API->>AI: Generate sowing calendar
    AI->>Bedrock: Query monsoon patterns & climate data
    Bedrock-->>AI: Return climate insights
    AI->>AI: Calculate optimal sowing windows
    AI->>DB: Store calendar
    AI-->>API: Return sowing calendar
    API-->>UI: Display calendar with export options
    
    F->>UI: Download calendar as PDF
    UI->>API: GET /api/v1/calendar/export?format=pdf
    API->>DB: Retrieve calendar
    API->>API: Generate PDF
    API-->>UI: Return PDF file
    
    Note over Alert,F: Alert Scheduling (Req 13.10)
    Alert->>DB: Check calendars for upcoming sowing windows
    DB-->>Alert: Return calendars within 7 days
    Alert->>Alert: Generate sowing alerts
    Alert->>DB: Store alerts
    Alert->>F: Send SMS notification
    
    Note over F,DB: Nutrient Management (Req 14)
    F->>UI: Enter soil test results
    UI->>API: POST /api/v1/nutrient-management/calculate
    API->>AI: Calculate fertilizer doses
    AI->>Bedrock: Query fertilizer recommendations
    Bedrock-->>AI: Return NPK/Urea/DAP guidelines
    AI->>AI: Apply Urea safety limits
    AI->>AI: Generate split-dose schedule
    AI->>Ext: Fetch current fertilizer prices
    Ext-->>AI: Return market prices
    AI->>AI: Calculate cost estimates
    AI->>DB: Store nutrient plan
    AI-->>API: Return complete plan with costs
    API-->>UI: Display fertilizer recommendations
    
    Note over F,DB: Risk Assessment (Req 15)
    F->>UI: Request risk assessment
    UI->>API: POST /api/v1/risk-assessment
    API->>Ext: Fetch weather forecast
    Ext-->>API: Return 7-day forecast
    API->>Ext: Fetch market price trends
    Ext-->>API: Return price data
    API->>AI: Assess risks
    AI->>Bedrock: Query pest/disease patterns
    Bedrock-->>AI: Return risk factors
    AI->>AI: Calculate outbreak probabilities
    AI->>AI: Optimize harvest timing
    AI->>AI: Prioritize alerts by severity
    AI->>DB: Store risk assessment
    AI-->>API: Return prioritized alerts
    API-->>UI: Display risk dashboard
    
    Note over Alert,F: Risk Alert Triggering (Req 15.3-15.4)
    Alert->>DB: Check risk probabilities
    DB-->>Alert: Return risks > 60%
    Alert->>Alert: Generate high-priority alerts
    Alert->>DB: Store alerts
    Alert->>F: Send urgent SMS notification
```

## Components and Interfaces

### 1. Data Ingestion Module

**Responsibility:** Fetch and cache regional agricultural data from government APIs.

**Interfaces:**

```typescript
interface RegionalData {
  locationId: string;
  waterTableLevel: number; // meters below ground
  mineralContent: MineralComposition;
  soilDistrictData: SoilDistrictInfo;
  timestamp: Date;
  source: string;
}

interface MineralComposition {
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  organicCarbon: number; // percentage
  sulfur: number; // ppm
  zinc: number; // ppm
  iron: number; // ppm
}

interface SoilDistrictInfo {
  districtName: string;
  soilTexture: string;
  drainageClass: string;
  erosionLevel: string;
}

interface DataIngestionModule {
  fetchRegionalData(locationId: string): Promise<RegionalData>;
  getCachedData(locationId: string): Promise<RegionalData | null>;
  refreshCache(locationId: string): Promise<void>;
  validateDataFormat(data: any): boolean;
}
```

**Implementation Notes:**
- Use AWS Lambda for serverless API calls to government endpoints
- Implement exponential backoff for API failures
- Store cached data in Amazon ElastiCache (Redis) with 30-day TTL
- Validate data schema before caching to prevent corrupt data propagation

### 2. Farmer Input Module

**Responsibility:** Collect, validate, and persist manual field measurements from farmers.

**Interfaces:**

```typescript
interface FarmerInput {
  farmerId: string;
  locationId: string;
  tdsValue: number; // ppm
  phLevel: number; // 0-14 scale
  borewellDepth: number; // meters
  soilType: SoilType;
  timestamp: Date;
}

enum SoilType {
  CLAY = "clay",
  SANDY = "sandy",
  LOAMY = "loamy",
  SILTY = "silty",
  PEATY = "peaty",
  CHALKY = "chalky",
  LATERITE = "laterite"
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  messageHindi: string;
}

interface FarmerInputModule {
  validateInput(input: FarmerInput): ValidationResult;
  saveInput(input: FarmerInput): Promise<string>; // returns input ID
  getInputHistory(farmerId: string): Promise<FarmerInput[]>;
  getLatestInput(farmerId: string): Promise<FarmerInput | null>;
}
```

**Validation Rules:**
- TDS Value: 0-5000 ppm (typical range for agricultural water)
- pH Level: 0-14 (strict chemical scale)
- Borewell Depth: 0-500 meters (realistic depth range)
- Soil Type: Must match predefined enum values

**Implementation Notes:**
- Use AWS DynamoDB for farmer input storage (fast writes, scalable)
- Implement client-side validation for immediate feedback
- Store validation error messages in both English and Hindi
- Support offline data entry with local storage and sync on reconnect

### 3. AI Intelligence Engine

**Responsibility:** Analyze combined data to generate crop recommendations, fertilizer plans, irrigation schedules, yield predictions, sowing/irrigation calendars, nutrient management plans, and risk assessments.

**Interfaces:**

```typescript
interface CropRecommendation {
  cropName: string;
  cropNameHindi: string;
  suitabilityScore: number; // 0-100
  confidence: number; // 0-1
  reasoning: string[];
  reasoningHindi: string[];
}

interface FertilizerPlan {
  cropName: string;
  applications: FertilizerApplication[];
}

interface FertilizerApplication {
  fertilizerType: string;
  fertilizerTypeHindi: string;
  quantityKgPerHectare: number;
  applicationTiming: string; // e.g., "Before sowing", "30 days after sowing"
  applicationTimingHindi: string;
  growthStage: string;
}

interface IrrigationSchedule {
  cropName: string;
  frequencyDays: number;
  volumeLitersPerEvent: number;
  totalSeasonalWaterRequirement: number; // liters per hectare
  conservationRecommendations: string[];
  conservationRecommendationsHindi: string[];
}

interface YieldEstimation {
  cropName: string;
  estimatedYieldKgPerHectare: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: YieldFactor[];
}

interface YieldFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  descriptionHindi: string;
}

// New interfaces for Requirements 13-15

interface SowingCalendar {
  cropName: string;
  cropNameHindi: string;
  sowingWindows: SowingWindow[];
  monsoonPatternData: MonsoonPattern;
  regionalClimateFactors: string[];
  regionalClimateFactorsHindi: string[];
}

interface SowingWindow {
  startDate: Date;
  endDate: Date;
  optimalityScore: number; // 0-100
  climateConditions: string;
  climateConditionsHindi: string;
}

interface MonsoonPattern {
  onsetDate: Date;
  withdrawalDate: Date;
  expectedRainfallMm: number;
  reliability: number; // 0-1
}

interface DailyIrrigationSchedule {
  cropName: string;
  cropNameHindi: string;
  dailySchedule: IrrigationEvent[];
  totalSeasonalWaterLitersPerHectare: number;
  growthStageOptimizations: GrowthStageWaterRequirement[];
}

interface IrrigationEvent {
  date: Date;
  waterVolumeLitersPerHectare: number;
  growthStage: string;
  growthStageHindi: string;
  notes: string;
  notesHindi: string;
}

interface GrowthStageWaterRequirement {
  stage: string;
  stageHindi: string;
  durationDays: number;
  dailyWaterRequirementLitersPerHectare: number;
  criticalityLevel: "low" | "medium" | "high";
}

interface SoilTestResults {
  testDate: Date;
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  organicCarbonPercent: number;
  phLevel: number;
  electricalConductivity: number;
  sulfurPpm: number;
  zincPpm: number;
  ironPpm: number;
}

interface NutrientManagementPlan {
  cropName: string;
  cropNameHindi: string;
  soilTestResults: SoilTestResults;
  fertilizerDoses: FertilizerDose[];
  organicAlternatives: OrganicAlternative[];
  costEstimate: CostEstimate;
  warnings: NutrientWarning[];
}

interface FertilizerDose {
  fertilizerType: "NPK" | "Urea" | "DAP" | "Potash" | "Zinc" | "Other";
  fertilizerName: string;
  fertilizerNameHindi: string;
  splitDoses: SplitDoseApplication[];
  totalQuantityKgPerHectare: number;
  nutrientContent: {
    nitrogenPercent?: number;
    phosphorusPercent?: number;
    potassiumPercent?: number;
  };
}

interface SplitDoseApplication {
  applicationType: "basal" | "top-dressing";
  daysAfterSowing: number;
  quantityKgPerHectare: number;
  applicationMethod: string;
  applicationMethodHindi: string;
}

interface OrganicAlternative {
  organicFertilizerName: string;
  organicFertilizerNameHindi: string;
  equivalentNutrientValue: string;
  applicationRateKgPerHectare: number;
  expectedOutcome: string;
  expectedOutcomeHindi: string;
}

interface CostEstimate {
  totalCostINR: number;
  breakdown: CostBreakdown[];
  lastUpdated: Date;
}

interface CostBreakdown {
  item: string;
  itemHindi: string;
  quantityKg: number;
  pricePerKgINR: number;
  totalINR: number;
}

interface NutrientWarning {
  severity: "low" | "medium" | "high";
  warningType: "over-application" | "deficiency" | "toxicity";
  nutrient: string;
  message: string;
  messageHindi: string;
  recommendation: string;
  recommendationHindi: string;
}

interface RiskAssessment {
  cropName: string;
  cropNameHindi: string;
  currentGrowthStage: string;
  currentGrowthStageHindi: string;
  pestRisks: PestRisk[];
  diseaseRisks: DiseaseRisk[];
  weatherRisks: WeatherRisk[];
  harvestOptimization: HarvestRecommendation;
  prioritizedAlerts: RiskAlert[];
}

interface PestRisk {
  pestType: string;
  pestTypeHindi: string;
  outbreakProbability: number; // 0-100
  affectedGrowthStages: string[];
  preventiveMeasures: string[];
  preventiveMeasuresHindi: string[];
  treatmentRecommendations: string[];
  treatmentRecommendationsHindi: string[];
}

interface DiseaseRisk {
  diseaseType: string;
  diseaseTypeHindi: string;
  outbreakProbability: number; // 0-100
  affectedGrowthStages: string[];
  preventiveMeasures: string[];
  preventiveMeasuresHindi: string[];
  treatmentRecommendations: string[];
  treatmentRecommendationsHindi: string[];
}

interface WeatherRisk {
  riskType: "frost" | "heatwave" | "heavy_rain" | "drought" | "hail";
  riskTypeHindi: string;
  probability: number; // 0-100
  expectedDate: Date;
  duration: string;
  protectiveActions: string[];
  protectiveActionsHindi: string[];
  potentialDamage: string;
  potentialDamageHindi: string;
}

interface HarvestRecommendation {
  optimalHarvestDate: Date;
  harvestWindow: {
    startDate: Date;
    endDate: Date;
  };
  yieldMaximizationFactors: string[];
  yieldMaximizationFactorsHindi: string[];
  marketPriceOptimization: MarketPriceAnalysis;
  confidence: number; // 0-1
}

interface MarketPriceAnalysis {
  currentPriceINRPerQuintal: number;
  projectedPriceINRPerQuintal: number;
  pricetrend: "increasing" | "decreasing" | "stable";
  optimalSellingWindow: {
    startDate: Date;
    endDate: Date;
  };
  marketDemandLevel: "low" | "medium" | "high";
}

interface RiskAlert {
  alertId: string;
  alertType: "pest" | "disease" | "weather" | "harvest";
  severity: "low" | "medium" | "high" | "critical";
  timeSensitivity: number; // days until action needed
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  actionRequired: string[];
  actionRequiredHindi: string[];
  createdAt: Date;
}

interface AIEngine {
  analyzeCropSuitability(
    regional: RegionalData,
    manual: FarmerInput
  ): Promise<CropRecommendation[]>;
  
  generateFertilizerPlan(
    crop: string,
    regional: RegionalData,
    manual: FarmerInput
  ): Promise<FertilizerPlan>;
  
  generateIrrigationSchedule(
    crop: string,
    regional: RegionalData,
    manual: FarmerInput
  ): Promise<IrrigationSchedule>;
  
  estimateYield(
    crop: string,
    regional: RegionalData,
    manual: FarmerInput
  ): Promise<YieldEstimation>;
  
  // New methods for Requirements 13-15
  
  generateSowingCalendar(
    crop: string,
    regional: RegionalData
  ): Promise<SowingCalendar>;
  
  generateDailyIrrigationSchedule(
    crop: string,
    growthStageData: string,
    regional: RegionalData,
    manual: FarmerInput
  ): Promise<DailyIrrigationSchedule>;
  
  generateSowingAlert(
    calendar: SowingCalendar,
    currentDate: Date
  ): Promise<RiskAlert | null>;
  
  calculateNutrientManagementPlan(
    crop: string,
    soilTestResults: SoilTestResults
  ): Promise<NutrientManagementPlan>;
  
  assessRisks(
    crop: string,
    growthStage: string,
    weatherData: any,
    marketData: any
  ): Promise<RiskAssessment>;
}
```

**AI Model Architecture:**

The AI Engine uses a multi-model approach:

1. **Crop Suitability Model:**
   - Input features: water table level, mineral content (7 parameters), pH, TDS, borewell depth, soil type, soil district data
   - Model type: Gradient Boosting (XGBoost) for tabular data
   - Output: Suitability score (0-100) for each crop in database
   - Training data: Historical crop yield data from Indian agricultural research institutes

2. **Fertilizer Recommendation Model:**
   - Rule-based system with ML refinement
   - Base rules from Indian Council of Agricultural Research (ICAR) guidelines
   - ML component adjusts quantities based on soil mineral deficiencies
   - Considers crop-specific nutrient requirements

3. **Irrigation Scheduling Model:**
   - Combines crop water requirements (FAO guidelines) with local water availability
   - Factors: crop evapotranspiration, water table level, borewell depth, soil water retention
   - Adjusts schedule based on soil type drainage characteristics

4. **Yield Prediction Model:**
   - Ensemble model combining:
     * Regression model trained on historical yield data
     * Suitability score as primary feature
     * Environmental stress factors (water availability, nutrient deficiency)
   - Outputs point estimate with confidence interval

**Implementation Notes:**
- Use AWS Bedrock Knowledge Base (ID: ZQS6EKVSG7) with Amazon Nova Lite model for AI inference
- Deploy on AWS EC2 for consistent availability
- Cache model predictions for identical input combinations (1 hour TTL)
- Implement model versioning for A/B testing and rollback capability

**New Feature Implementation (Requirements 13-15):**

5. **Sowing Calendar Generation:**
   - Query Knowledge Base with crop type and regional climate data
   - Extract monsoon onset/withdrawal dates from regional data
   - Calculate optimal sowing windows based on climate patterns
   - Generate alerts 7 days before sowing window opens

6. **Daily Irrigation Scheduling:**
   - Query Knowledge Base with crop growth stage requirements
   - Calculate day-by-day water needs based on evapotranspiration
   - Optimize schedule for each growth stage (germination, vegetative, flowering, maturity)
   - Integrate with existing water availability data

7. **Nutrient Management Calculator:**
   - Accept soil test results as structured input
   - Calculate NPK, Urea, DAP, and micronutrient requirements
   - Implement Urea safety limits (max 200 kg/hectare for most crops)
   - Generate split-dose schedules (basal + top-dressing)
   - Query market price APIs for cost estimation
   - Provide organic alternatives (FYM, compost, vermicompost)

8. **Risk Assessment Engine:**
   - Integrate weather forecast APIs for 7-14 day predictions
   - Use weather patterns + crop stage to predict pest/disease probability
   - Trigger alerts when probability exceeds 60%
   - Identify specific pests (bollworm, aphids, stem borer, etc.)
   - Analyze market price trends for harvest timing optimization
   - Prioritize alerts by severity and time sensitivity

### 4. Language Service

**Responsibility:** Provide bilingual support across the platform.

**Interfaces:**

```typescript
interface LanguageService {
  translate(key: string, language: "en" | "hi"): string;
  setUserLanguage(userId: string, language: "en" | "hi"): Promise<void>;
  getUserLanguage(userId: string): Promise<"en" | "hi">;
}

interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}
```

**Implementation Notes:**
- Store translations in JSON files for easy updates
- Use i18n library (e.g., i18next) for client-side translation
- Preload all translations on app initialization to avoid latency
- Store user language preference in DynamoDB user profile

### 6. Calendar Export Service

**Responsibility:** Generate downloadable calendar files in multiple formats.

**Interfaces:**

```typescript
interface CalendarExportService {
  exportToICal(calendar: SowingCalendar | DailyIrrigationSchedule): Promise<string>;
  exportToPDF(calendar: SowingCalendar | DailyIrrigationSchedule, language: "en" | "hi"): Promise<Buffer>;
  generateDownloadUrl(calendarId: string, format: "ical" | "pdf"): Promise<string>;
}
```

**Implementation Notes:**
- Use `ical-generator` library for iCal format generation
- Use `puppeteer` or `pdfkit` for PDF generation
- Store generated files temporarily in S3 with 24-hour expiration
- Generate pre-signed URLs for secure downloads

### 7. Alert Scheduling Service

**Responsibility:** Monitor calendars and risk assessments to trigger timely alerts.

**Interfaces:**

```typescript
interface AlertSchedulingService {
  scheduleAlert(alert: RiskAlert, deliveryDate: Date): Promise<string>;
  checkSowingWindowAlerts(): Promise<RiskAlert[]>;
  checkRiskThresholdAlerts(): Promise<RiskAlert[]>;
  sendAlert(alertId: string, farmerId: string): Promise<void>;
  markAlertAsRead(alertId: string): Promise<void>;
}
```

**Implementation Notes:**
- Use AWS EventBridge for scheduled alert checks (run daily at 6 AM IST)
- Use AWS SNS for SMS notifications to farmers
- Store alert delivery status in DynamoDB
- Implement retry logic for failed deliveries

### 8. External Data Integration Service

**Responsibility:** Fetch weather forecasts and market price data from external APIs.

**Interfaces:**

```typescript
interface WeatherForecast {
  locationId: string;
  forecastDate: Date;
  temperature: {
    minCelsius: number;
    maxCelsius: number;
  };
  rainfall: {
    probabilityPercent: number;
    expectedMm: number;
  };
  humidity: number;
  windSpeedKmh: number;
  conditions: string;
}

interface MarketPrice {
  cropName: string;
  priceDate: Date;
  priceINRPerQuintal: number;
  marketName: string;
  trend: "increasing" | "decreasing" | "stable";
}

interface ExternalDataService {
  fetchWeatherForecast(locationId: string, days: number): Promise<WeatherForecast[]>;
  fetchMarketPrices(cropName: string): Promise<MarketPrice[]>;
  getCachedWeatherForecast(locationId: string): Promise<WeatherForecast[] | null>;
  getCachedMarketPrices(cropName: string): Promise<MarketPrice[] | null>;
}
```

**Implementation Notes:**
- Integrate with India Meteorological Department (IMD) API for weather data
- Integrate with AGMARKNET API for market prices
- Cache weather forecasts for 6 hours in ElastiCache
- Cache market prices for 24 hours in ElastiCache
- Implement fallback to historical averages if APIs are unavailable

### 9. API Gateway

**Responsibility:** Route requests, handle authentication, and enforce rate limiting.

**Endpoints:**

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/regional-data/:locationId
POST   /api/v1/farmer-input
GET    /api/v1/farmer-input/history
POST   /api/v1/recommendations
GET    /api/v1/recommendations/:cropName/fertilizer
GET    /api/v1/recommendations/:cropName/irrigation
GET    /api/v1/recommendations/:cropName/yield
PUT    /api/v1/user/language

# New endpoints for Requirements 13-15

# Sowing & Irrigation Calendars (Requirement 13)
POST   /api/v1/calendar/sowing
       Body: { cropName, locationId, language }
       Returns: SowingCalendar with optimal sowing windows

POST   /api/v1/calendar/irrigation
       Body: { cropName, growthStage, locationId, farmerInputId, language }
       Returns: DailyIrrigationSchedule with day-by-day water requirements

GET    /api/v1/calendar/export/:calendarId
       Query: { format: "ical" | "pdf" }
       Returns: Calendar file for download

GET    /api/v1/alerts/sowing
       Returns: Active sowing alerts for authenticated farmer

# Nutrient Management (Requirement 14)
POST   /api/v1/nutrient-management/calculate
       Body: { cropName, soilTestResults, language }
       Returns: NutrientManagementPlan with fertilizer doses and costs

GET    /api/v1/nutrient-management/organic-alternatives/:cropName
       Returns: List of organic fertilizer alternatives

# Risk Mitigation (Requirement 15)
POST   /api/v1/risk-assessment
       Body: { cropName, growthStage, locationId, language }
       Returns: RiskAssessment with pest/disease/weather risks

GET    /api/v1/alerts/risk
       Returns: Prioritized risk alerts for authenticated farmer

POST   /api/v1/harvest/optimize
       Body: { cropName, maturityDate, locationId, language }
       Returns: HarvestRecommendation with optimal timing
```

**Implementation Notes:**
- Use AWS API Gateway for request routing
- Implement JWT-based authentication
- Rate limiting: 100 requests per minute per user
- CORS configuration for mobile web access

## Data Models

### Database Schema (DynamoDB)

**Users Table:**
```typescript
interface User {
  userId: string; // Partition key
  phoneNumber: string;
  name: string;
  language: "en" | "hi";
  createdAt: Date;
  lastLoginAt: Date;
}
```

**FarmerInputs Table:**
```typescript
interface FarmerInputRecord {
  inputId: string; // Partition key
  farmerId: string; // GSI partition key
  locationId: string;
  tdsValue: number;
  phLevel: number;
  borewellDepth: number;
  soilType: string;
  timestamp: Date; // GSI sort key
  ttl: number; // Auto-delete after 2 years
}
```

**RegionalDataCache (ElastiCache Redis):**
```typescript
// Key: `regional:${locationId}`
// Value: JSON-serialized RegionalData
// TTL: 30 days (2592000 seconds)
```

**RecommendationsCache (ElastiCache Redis):**
```typescript
// Key: `rec:${hash(regionalData + farmerInput)}`
// Value: JSON-serialized recommendations
// TTL: 1 hour (3600 seconds)
```

**New Tables for Requirements 13-15:**

**SowingCalendars Table:**
```typescript
interface SowingCalendarRecord {
  calendarId: string; // Partition key
  farmerId: string; // GSI partition key
  cropName: string;
  locationId: string;
  sowingWindows: SowingWindow[];
  monsoonData: MonsoonPattern;
  createdAt: Date;
  expiresAt: Date; // TTL for next season
}
```

**IrrigationSchedules Table:**
```typescript
interface IrrigationScheduleRecord {
  scheduleId: string; // Partition key
  farmerId: string; // GSI partition key
  cropName: string;
  dailyEvents: IrrigationEvent[];
  totalSeasonalWater: number;
  createdAt: Date;
  seasonEndDate: Date; // TTL
}
```

**SoilTestResults Table:**
```typescript
interface SoilTestResultRecord {
  testId: string; // Partition key
  farmerId: string; // GSI partition key
  locationId: string;
  testDate: Date;
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  organicCarbonPercent: number;
  phLevel: number;
  electricalConductivity: number;
  sulfurPpm: number;
  zincPpm: number;
  ironPpm: number;
  labName: string;
  createdAt: Date;
}
```

**NutrientManagementPlans Table:**
```typescript
interface NutrientManagementPlanRecord {
  planId: string; // Partition key
  farmerId: string; // GSI partition key
  cropName: string;
  soilTestId: string; // Reference to SoilTestResults
  fertilizerDoses: FertilizerDose[];
  organicAlternatives: OrganicAlternative[];
  totalCostINR: number;
  warnings: NutrientWarning[];
  createdAt: Date;
  seasonEndDate: Date; // TTL
}
```

**RiskAlerts Table:**
```typescript
interface RiskAlertRecord {
  alertId: string; // Partition key
  farmerId: string; // GSI partition key
  alertType: "pest" | "disease" | "weather" | "harvest" | "sowing";
  severity: "low" | "medium" | "high" | "critical";
  timeSensitivity: number; // days
  cropName: string;
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  actionRequired: string[];
  actionRequiredHindi: string[];
  isRead: boolean;
  createdAt: Date; // GSI sort key
  expiresAt: Date; // TTL
}
```

**MarketPriceCache (ElastiCache Redis):**
```typescript
// Key: `market:${cropName}:${date}`
// Value: JSON-serialized market price data
// TTL: 24 hours (86400 seconds)
```

**WeatherForecastCache (ElastiCache Redis):**
```typescript
// Key: `weather:${locationId}:${date}`
// Value: JSON-serialized weather forecast data
// TTL: 6 hours (21600 seconds)
```

### Data Flow

1. **User Registration/Login:**
   - User provides phone number
   - OTP verification (AWS SNS)
   - Create user record in DynamoDB
   - Return JWT token

2. **Data Collection:**
   - User selects location → fetch regional data (cache-first)
   - User enters manual inputs → validate → store in DynamoDB
   - Combine regional + manual data

3. **Recommendation Generation:**
   - Check recommendations cache
   - If miss: invoke AI Engine → cache results → return
   - If hit: return cached results

4. **Historical Tracking:**
   - Query FarmerInputs table by farmerId (GSI)
   - Display chronological history
   - Allow comparison between time periods


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Data Ingestion Properties

**Property 1: Complete Regional Data Retrieval**
*For any* valid location identifier, when the Data Ingestion Module fetches regional data, the returned data should contain water table level, mineral content, and soil district information.
**Validates: Requirements 1.1, 1.2, 1.3**

**Property 2: API Failure Error Handling**
*For any* Government API failure scenario (timeout, 404, 500, network error), the Data Ingestion Module should return a descriptive error message that identifies the failure type.
**Validates: Requirements 1.4**

**Property 3: Data Format Validation**
*For any* data retrieved from Government APIs, the Data Ingestion Module should validate the data format before storage, and reject data that does not match the expected schema.
**Validates: Requirements 1.5**

**Property 4: Cache Refresh for Stale Data**
*For any* cached regional data older than 30 days, when requested, the Data Ingestion Module should fetch fresh data from the Government API and update the cache.
**Validates: Requirements 1.6**

**Property 5: Cache-First Strategy**
*For any* location identifier with cached regional data less than 30 days old, the Data Ingestion Module should return cached data without making a new API request.
**Validates: Requirements 9.5**

### Farmer Input Properties

**Property 6: Valid Input Acceptance**
*For any* farmer input with TDS value (0-5000 ppm), pH level (0-14), borewell depth (0-500m), and valid soil type, the Farmer Input Module should accept and persist the data.
**Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.8**

**Property 7: Missing Field Rejection**
*For any* farmer input with one or more required fields empty, the Farmer Input Module should reject the submission and return validation errors identifying the missing fields.
**Validates: Requirements 2.6**

**Property 8: Out-of-Range Rejection**
*For any* farmer input with numeric values outside valid ranges (TDS > 5000, pH < 0 or pH > 14, depth > 500m), the Farmer Input Module should reject the input and return range validation errors.
**Validates: Requirements 2.7**

**Property 9: Input Persistence with Timestamp**
*For any* valid farmer input, when persisted to the database, the stored record should include a timestamp indicating when the data was submitted.
**Validates: Requirements 9.1**

**Property 10: Most Recent Input Retrieval**
*For any* farmer with multiple historical inputs, when retrieving the latest input, the Platform should return the input with the most recent timestamp.
**Validates: Requirements 9.2**

**Property 11: Chronological History Ordering**
*For any* farmer's historical inputs, when displayed, the inputs should be ordered by timestamp in chronological order (oldest to newest or newest to oldest consistently).
**Validates: Requirements 9.3**

### AI Engine - Crop Suitability Properties

**Property 12: Suitability Score Range**
*For any* combination of valid regional data and farmer input, the AI Engine should generate crop suitability scores between 0 and 100 (inclusive).
**Validates: Requirements 3.1**

**Property 13: Input Parameter Influence on Suitability**
*For any* two input combinations that differ in at least one parameter (water table, minerals, pH, TDS, borewell depth, soil type, or soil district), the AI Engine should produce different suitability scores (unless the parameters have no impact on the specific crop).
**Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

**Property 14: Crop Ranking by Score**
*For any* list of crop recommendations, the crops should be ordered by suitability score in descending order (highest score first).
**Validates: Requirements 3.9**

### AI Engine - Fertilizer Recommendation Properties

**Property 15: Input Parameter Influence on Fertilizer Plan**
*For any* two input combinations that differ in soil mineral content, pH level, or soil type, the AI Engine should produce different fertilizer plans (unless the differences don't affect fertilizer requirements).
**Validates: Requirements 4.1, 4.2, 4.3**

**Property 16: Complete Fertilizer Plan Format**
*For any* generated fertilizer plan, the plan should specify fertilizer types, application quantities in kg/hectare, and application timing relative to crop growth stages for each application.
**Validates: Requirements 4.4, 4.5, 4.6**

### AI Engine - Irrigation Schedule Properties

**Property 17: Input Parameter Influence on Irrigation Schedule**
*For any* two input combinations that differ in water table level, borewell depth, or crop type, the AI Engine should produce different irrigation schedules (unless the differences don't affect water requirements).
**Validates: Requirements 5.1, 5.2, 5.3**

**Property 18: Complete Irrigation Schedule Format**
*For any* generated irrigation schedule, the schedule should specify irrigation frequency in days and water volume per event in liters.
**Validates: Requirements 5.4, 5.5**

**Property 19: Water Conservation Recommendations**
*For any* input with critically low water table levels (below a defined threshold), the AI Engine should include water conservation recommendations in the irrigation schedule.
**Validates: Requirements 5.6**

### AI Engine - Yield Prediction Properties

**Property 20: Yield Estimation Format**
*For any* generated yield estimation, the estimation should include a value in kilograms per hectare and a confidence interval with lower and upper bounds.
**Validates: Requirements 6.1, 6.5**

**Property 21: Input Parameter Influence on Yield**
*For any* two input combinations that differ in suitability score, regional data parameters, or manual input parameters, the AI Engine should produce different yield estimations (unless the differences don't affect yield).
**Validates: Requirements 6.2, 6.3, 6.4**

### Language Support Properties

**Property 22: Complete Translation Coverage**
*For any* UI text key in the translation dictionary, translations should exist for both English and Hindi languages.
**Validates: Requirements 7.2, 7.3**

**Property 23: Language Preference Persistence**
*For any* user who changes their language preference, when they return in a future session, the Platform should display content in their previously selected language.
**Validates: Requirements 7.4**

**Property 24: Recommendation Translation**
*For any* AI Engine recommendation (crop suitability, fertilizer plan, irrigation schedule, yield estimation), the displayed text should be in the user's selected language.
**Validates: Requirements 7.5**

**Property 25: Error Message Translation**
*For any* validation error or system error, the error message should be displayed in the user's selected language.
**Validates: Requirements 7.6, 10.5**

### Performance Properties

**Property 26: Mobile Load Time**
*For any* page load on a simulated 3G network connection, the Platform should complete initial render within 5 seconds.
**Validates: Requirements 8.3**

### Error Handling Properties

**Property 27: API Failure Error Messages**
*For any* Government API request failure, the Platform should display an error message that explains the issue to the user.
**Validates: Requirements 10.1**

**Property 28: Insufficient Data Error Feedback**
*For any* attempt to generate recommendations with missing required data, the AI Engine should return an error that specifies which data fields are missing.
**Validates: Requirements 10.2**

**Property 29: Offline Data Preservation**
*For any* form submission that fails due to network connectivity loss, the Platform should preserve the entered data locally and allow the user to retry submission when connectivity is restored.
**Validates: Requirements 10.3**

**Property 30: Error Logging**
*For any* error that occurs in the system (API failures, validation errors, processing errors), the Platform should log error details including timestamp, error type, and context for debugging.
**Validates: Requirements 10.4**

### Security Properties

**Property 31: Authentication Enforcement**
*For any* API endpoint that accesses user-specific data, unauthenticated requests should be rejected with a 401 Unauthorized response.
**Validates: Requirements 11.6**

### IoT Integration Properties

**Property 32: Input Source Uniformity**
*For any* identical data provided through manual input or IoT device input, the Platform should process both inputs identically and produce the same recommendations.
**Validates: Requirements 12.2**

**Property 33: IoT Endpoint Data Acceptance**
*For any* properly formatted data from an IoT device (including device ID, timestamp, and sensor readings), the Platform's IoT API endpoint should accept and process the data.
**Validates: Requirements 12.4**

**Property 34: Manual Input Fallback Support**
*For any* system state where IoT endpoints are available, the Platform should continue to accept and process manual farmer inputs as an alternative data source.
**Validates: Requirements 12.5**

### Sowing & Irrigation Calendar Properties (Requirement 13)

**Property 35: Sowing Calendar Generation**
*For any* valid crop type and regional data combination, the AI Engine should generate a sowing calendar containing optimal sowing windows with start and end dates.
**Validates: Requirements 13.1, 13.3**

**Property 36: Monsoon Pattern Integration**
*For any* two regional data sets that differ in monsoon pattern data, the AI Engine should generate different sowing calendars that reflect the monsoon timing differences.
**Validates: Requirements 13.2**

**Property 37: Favorable Weather Alert Generation**
*For any* sowing calendar where weather forecast indicates favorable conditions within the sowing window, the AI Engine should generate alerts for optimal sowing timing.
**Validates: Requirements 13.4**

**Property 38: Daily Irrigation Schedule Structure**
*For any* crop type and growth stage data, the AI Engine should generate a day-by-day irrigation schedule specifying irrigation dates and water volumes in liters per hectare.
**Validates: Requirements 13.5, 13.7**

**Property 39: Growth Stage Water Optimization**
*For any* two growth stages with different water requirements, the irrigation schedule should specify different water application volumes optimized for each stage.
**Validates: Requirements 13.6**

**Property 40: Calendar Export Functionality**
*For any* generated sowing or irrigation calendar, the Platform should provide export functionality in standard calendar formats (iCal) and PDF download for offline reference.
**Validates: Requirements 13.8, 13.9**

**Property 41: Seven-Day Sowing Alert**
*For any* sowing calendar where a sowing window start date is within 7 days of the current date, the Platform should send an alert to the farmer.
**Validates: Requirements 13.10**

### Nutrient Management Properties (Requirement 14)

**Property 42: Complete Fertilizer Dose Calculation**
*For any* soil test results, the AI Engine should calculate precise fertilizer doses for all required components including NPK, Urea, DAP, and other necessary fertilizers.
**Validates: Requirements 14.1, 14.2, 14.3, 14.4**

**Property 43: Urea Over-Application Prevention**
*For any* soil test results and crop type, when calculating Urea doses, the AI Engine should limit doses to agronomically safe levels (not exceeding crop-specific maximum thresholds).
**Validates: Requirements 14.5**

**Property 44: Complete Split-Dose Recommendation Structure**
*For any* generated fertilizer recommendation, the plan should include split-dose recommendations with basal application and top-dressing applications, specifying exact timing in days after sowing and quantities in kilograms per hectare for each application.
**Validates: Requirements 14.6, 14.7, 14.8, 14.9**

**Property 45: Cost Estimation Inclusion**
*For any* generated fertilizer recommendation, the Platform should display cost estimates based on current market prices with breakdown by fertilizer type.
**Validates: Requirements 14.10**

**Property 46: Organic Alternative Provision**
*For any* generated fertilizer recommendation, the AI Engine should provide organic fertilizer alternatives with equivalent nutrient values, specifying application rates and expected outcomes.
**Validates: Requirements 14.11, 14.12**

**Property 47: Urea Risk Warning**
*For any* soil test results that indicate excessive Urea application risk (high existing nitrogen levels), the AI Engine should display warnings about potential soil health damage.
**Validates: Requirements 14.13**

### Risk Mitigation Properties (Requirement 15)

**Property 48: Pest and Disease Outbreak Prediction**
*For any* combination of weather pattern data and crop stage information, the AI Engine should predict both pest outbreak probability and disease outbreak probability as numerical values between 0 and 100.
**Validates: Requirements 15.1, 15.2**

**Property 49: Outbreak Alert Triggering**
*For any* pest or disease outbreak probability that exceeds 60 percent, the Platform should send early warning alerts to the farmer.
**Validates: Requirements 15.3, 15.4**

**Property 50: Specific Pest Identification and Complete Alert Content**
*For any* generated pest alert, the alert should identify specific pest types (such as bollworm, aphids, etc.) and include both preventive measures and treatment recommendations in the alert message.
**Validates: Requirements 15.5, 15.6, 15.7**

**Property 51: Harvest Timing Optimization**
*For any* crop maturity data and market price trends, the AI Engine should recommend optimal harvest timing that considers both yield maximization factors and market price optimization factors.
**Validates: Requirements 15.8, 15.9, 15.10**

**Property 52: Weather-Based Risk Alert Generation**
*For any* weather forecast indicating frost risk, heatwave risk, or heavy rain risk, the Platform should send weather-based risk alerts to the farmer including protective action recommendations.
**Validates: Requirements 15.11, 15.12, 15.13, 15.14**

**Property 53: Alert Prioritization**
*For any* situation where multiple risk factors are present simultaneously, the Platform should prioritize alerts by severity and time sensitivity, with higher severity and more time-sensitive alerts appearing first.
**Validates: Requirements 15.16**

## Error Handling

### Error Categories

1. **External API Errors:**
   - Government API unavailable (503 Service Unavailable)
   - Government API timeout (408 Request Timeout)
   - Invalid API response format (422 Unprocessable Entity)
   - Rate limiting exceeded (429 Too Many Requests)
   - Weather API unavailable (503 Service Unavailable)
   - Market price API unavailable (503 Service Unavailable)

2. **Validation Errors:**
   - Missing required fields (400 Bad Request)
   - Out-of-range numeric values (400 Bad Request)
   - Invalid soil type selection (400 Bad Request)
   - Invalid location identifier (404 Not Found)
   - Invalid soil test results format (400 Bad Request)
   - Invalid date range for calendar generation (400 Bad Request)

3. **Processing Errors:**
   - AI model inference failure (500 Internal Server Error)
   - Insufficient data for recommendations (422 Unprocessable Entity)
   - Database connection failure (503 Service Unavailable)
   - Cache service unavailable (degraded mode, continue with API calls)
   - Calendar generation failure (500 Internal Server Error)
   - PDF export failure (500 Internal Server Error)
   - Alert delivery failure (503 Service Unavailable)

4. **Authentication Errors:**
   - Missing or invalid JWT token (401 Unauthorized)
   - Expired token (401 Unauthorized)
   - Insufficient permissions (403 Forbidden)

5. **Business Logic Errors:**
   - Sowing window not available for selected crop/region (404 Not Found)
   - Soil test results too old (>1 year) (422 Unprocessable Entity)
   - Crop not suitable for selected region (422 Unprocessable Entity)
   - Market price data unavailable for crop (404 Not Found)

### Error Response Format

All errors should follow a consistent JSON structure:

```typescript
interface ErrorResponse {
  error: {
    code: string; // Machine-readable error code
    message: string; // Human-readable message in English
    messageHindi: string; // Human-readable message in Hindi
    details?: any; // Additional context (e.g., missing fields)
    timestamp: Date;
    requestId: string; // For support tracking
  };
}
```

### Error Handling Strategies

1. **Retry with Exponential Backoff:**
   - Apply to transient Government API failures
   - Max 3 retries with delays: 1s, 2s, 4s
   - After max retries, return error to user

2. **Graceful Degradation:**
   - If cache service fails, continue with direct API calls
   - If AI model fails, provide basic rule-based recommendations
   - If translation service fails, default to English

3. **User-Friendly Messages:**
   - Avoid technical jargon in error messages
   - Provide actionable guidance (e.g., "Please check your internet connection")
   - Include support contact information for persistent errors

4. **Logging and Monitoring:**
   - Log all errors to AWS CloudWatch
   - Set up alerts for critical errors (API failures > 10%, model errors)
   - Track error rates by category for continuous improvement

## Testing Strategy

### Dual Testing Approach

The platform will employ both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection:**
- **TypeScript/JavaScript**: Use `fast-check` library for property-based testing
- **Python** (if used for AI models): Use `hypothesis` library

**Test Configuration:**
- Each property test must run minimum 100 iterations (due to randomization)
- Each property test must reference its design document property
- Tag format: `Feature: ai-crop-intelligence-platform, Property {number}: {property_text}`

**Example Property Test Structure:**

```typescript
import fc from 'fast-check';

// Feature: ai-crop-intelligence-platform, Property 6: Valid Input Acceptance
test('Property 6: Valid inputs should be accepted and persisted', () => {
  fc.assert(
    fc.property(
      fc.record({
        tdsValue: fc.integer({ min: 0, max: 5000 }),
        phLevel: fc.float({ min: 0, max: 14 }),
        borewellDepth: fc.float({ min: 0, max: 500 }),
        soilType: fc.constantFrom('clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'laterite')
      }),
      async (input) => {
        const result = await farmerInputModule.validateInput(input);
        expect(result.isValid).toBe(true);
        
        const savedId = await farmerInputModule.saveInput(input);
        expect(savedId).toBeDefined();
        
        const retrieved = await farmerInputModule.getInputById(savedId);
        expect(retrieved).toMatchObject(input);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Focus Areas for Unit Tests:**
1. **Specific Examples**: Test known input-output pairs for AI models
2. **Edge Cases**: Test boundary values (pH = 0, pH = 14, TDS = 0, TDS = 5000)
3. **Error Conditions**: Test specific error scenarios (empty fields, invalid tokens)
4. **Integration Points**: Test component interactions (API Gateway → Data Ingestion)

**Unit Test Balance:**
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples that demonstrate correct behavior
- Use unit tests for integration testing between components

**Example Unit Test:**

```typescript
// Unit test for specific edge case
test('pH level of exactly 0 should be accepted', async () => {
  const input = {
    tdsValue: 500,
    phLevel: 0, // Edge case: minimum pH
    borewellDepth: 50,
    soilType: 'loamy'
  };
  
  const result = await farmerInputModule.validateInput(input);
  expect(result.isValid).toBe(true);
});

// Unit test for specific error condition
test('Empty TDS value should return specific error message', async () => {
  const input = {
    tdsValue: null,
    phLevel: 7,
    borewellDepth: 50,
    soilType: 'loamy'
  };
  
  const result = await farmerInputModule.validateInput(input);
  expect(result.isValid).toBe(false);
  expect(result.errors).toContainEqual({
    field: 'tdsValue',
    message: 'TDS value is required',
    messageHindi: 'TDS मान आवश्यक है'
  });
});
```

**Example Property Test for New Features:**

```typescript
import fc from 'fast-check';

// Feature: ai-crop-intelligence-platform, Property 35: Sowing Calendar Generation
test('Property 35: Sowing calendar should contain optimal windows with dates', () => {
  fc.assert(
    fc.property(
      fc.record({
        cropName: fc.constantFrom('wheat', 'rice', 'cotton', 'sugarcane', 'maize'),
        regionalData: fc.record({
          locationId: fc.string(),
          monsoonOnset: fc.date(),
          monsoonWithdrawal: fc.date(),
          averageRainfall: fc.float({ min: 0, max: 3000 })
        })
      }),
      async ({ cropName, regionalData }) => {
        const calendar = await aiEngine.generateSowingCalendar(cropName, regionalData);
        
        expect(calendar.sowingWindows).toBeDefined();
        expect(calendar.sowingWindows.length).toBeGreaterThan(0);
        
        calendar.sowingWindows.forEach(window => {
          expect(window.startDate).toBeInstanceOf(Date);
          expect(window.endDate).toBeInstanceOf(Date);
          expect(window.startDate.getTime()).toBeLessThan(window.endDate.getTime());
        });
        
        expect(calendar.monsoonPatternData).toBeDefined();
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: ai-crop-intelligence-platform, Property 43: Urea Over-Application Prevention
test('Property 43: Urea doses should not exceed safe limits', () => {
  fc.assert(
    fc.property(
      fc.record({
        cropName: fc.constantFrom('wheat', 'rice', 'cotton'),
        soilTestResults: fc.record({
          nitrogenPpm: fc.float({ min: 0, max: 500 }),
          phosphorusPpm: fc.float({ min: 0, max: 100 }),
          potassiumPpm: fc.float({ min: 0, max: 500 }),
          phLevel: fc.float({ min: 4, max: 9 })
        })
      }),
      async ({ cropName, soilTestResults }) => {
        const plan = await aiEngine.calculateNutrientManagementPlan(cropName, soilTestResults);
        
        const ureaDose = plan.fertilizerDoses.find(d => d.fertilizerType === 'Urea');
        
        if (ureaDose) {
          // Safe limits vary by crop, but generally max 200 kg/hectare
          const safeLimit = cropName === 'rice' ? 250 : 200;
          expect(ureaDose.totalQuantityKgPerHectare).toBeLessThanOrEqual(safeLimit);
        }
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: ai-crop-intelligence-platform, Property 49: Outbreak Alert Triggering
test('Property 49: Alerts should be sent when outbreak probability exceeds 60%', () => {
  fc.assert(
    fc.property(
      fc.record({
        pestProbability: fc.float({ min: 0, max: 100 }),
        diseaseProbability: fc.float({ min: 0, max: 100 })
      }),
      async ({ pestProbability, diseaseProbability }) => {
        const riskAssessment = {
          pestRisks: [{ outbreakProbability: pestProbability }],
          diseaseRisks: [{ outbreakProbability: diseaseProbability }]
        };
        
        const alerts = await alertScheduler.checkRiskThresholdAlerts(riskAssessment);
        
        const shouldHaveAlert = pestProbability > 60 || diseaseProbability > 60;
        
        if (shouldHaveAlert) {
          expect(alerts.length).toBeGreaterThan(0);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage Goals

- **Code Coverage**: Minimum 80% line coverage
- **Property Coverage**: All 53 correctness properties must have corresponding property tests
- **Integration Coverage**: All API endpoints must have integration tests
- **Error Path Coverage**: All error handling paths must be tested

### Testing Infrastructure

- **CI/CD Integration**: Run all tests on every pull request
- **Test Environment**: Use AWS LocalStack for local AWS service mocking
- **Mock Services**: Mock Government APIs with configurable responses
- **Performance Testing**: Use Lighthouse CI for mobile performance validation
- **Accessibility Testing**: Use axe-core for WCAG compliance checking

### Test Data Management

- **Synthetic Data**: Generate realistic Indian location data for testing
- **Anonymized Data**: Use anonymized farmer data (if available) for model validation
- **Edge Case Data**: Maintain a suite of edge case inputs (extreme pH, very deep borewells, etc.)
- **Multilingual Data**: Test with both English and Hindi text throughout
