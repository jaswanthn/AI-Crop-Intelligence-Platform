# Implementation Plan: AI-Crop-Intelligence-Platform - New Features

## Overview

This implementation plan covers three new features for the AI-Crop-Intelligence-Platform:
1. Sowing & Irrigation Calendars (Requirement 13)
2. Nutrient Management & Fertilizer Dose Calculator (Requirement 14)
3. Risk Mitigation - Pest prediction and harvest timing (Requirement 15)

The implementation leverages the existing Express.js backend with AWS Bedrock Knowledge Base integration. All features use the existing Bedrock KB (ID: ZQS6EKVSG7) for AI inference, requiring no new model training. The focus is on MVP functionality that can be demoed within 2 days.

## Tasks

- [x] 1. Set up data models and API endpoints for new features
  - [x] 1.1 Create TypeScript interfaces for new data structures
    - Define interfaces for SowingCalendar, DailyIrrigationSchedule, NutrientManagementPlan, and RiskAssessment
    - Add interfaces for supporting types (SowingWindow, IrrigationEvent, FertilizerDose, PestRisk, etc.)
    - Create types.js file in project root with JSDoc comments for type safety
    - _Requirements: 13.1, 13.5, 14.1, 15.1_
  
  - [x] 1.2 Add new API endpoints to server.js
    - POST /api/v1/calendar/sowing - Generate sowing calendar
    - POST /api/v1/calendar/irrigation - Generate irrigation schedule
    - POST /api/v1/nutrient-management/calculate - Calculate fertilizer doses
    - POST /api/v1/risk-assessment - Assess pest/disease/weather risks
    - GET /api/v1/calendar/export/:calendarId - Export calendar (PDF/iCal)
    - _Requirements: 13.1, 13.5, 14.1, 15.1_

- [x] 2. Implement Sowing & Irrigation Calendars (Requirement 13)
  - [x] 2.1 Implement sowing calendar generation endpoint
    - Accept cropName, locationId, and language in request body
    - Build Knowledge Base query incorporating monsoon patterns and regional climate
    - Parse Bedrock response to extract sowing windows with start/end dates
    - Return structured SowingCalendar JSON response
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ]* 2.2 Write property test for sowing calendar generation
    - **Property 35: Sowing Calendar Generation**
    - **Validates: Requirements 13.1, 13.3**
    - Test that generated calendars contain valid sowing windows with dates
    - Verify monsoon pattern data is included
  
  - [x] 2.3 Implement daily irrigation schedule generation endpoint
    - Accept cropName, growthStage, locationId, farmerInputId, and language
    - Query Bedrock KB with crop growth stage water requirements
    - Calculate day-by-day irrigation events with dates and water volumes
    - Optimize water application for each growth stage
    - Return structured DailyIrrigationSchedule JSON response
    - _Requirements: 13.5, 13.6, 13.7_
  
  - [ ]* 2.4 Write property test for irrigation schedule optimization
    - **Property 39: Growth Stage Water Optimization**
    - **Validates: Requirements 13.6**
    - Test that different growth stages produce different water volumes
    - Verify daily schedule structure with dates and volumes
  
  - [x] 2.5 Implement calendar export functionality
    - Create helper function to generate iCal format from calendar data
    - Create helper function to generate PDF using simple HTML-to-PDF approach
    - Implement GET /api/v1/calendar/export endpoint with format parameter
    - Support both sowing calendars and irrigation schedules
    - _Requirements: 13.8, 13.9_

- [x] 3. Checkpoint - Test calendar features
  - Ensure all calendar endpoints return valid responses, ask the user if questions arise.

- [x] 4. Implement Nutrient Management & Fertilizer Dose Calculator (Requirement 14)
  - [x] 4.1 Implement nutrient management calculation endpoint
    - Accept cropName, soilTestResults, and language in request body
    - Validate soil test results structure (NPK, pH, EC, micronutrients)
    - Build Knowledge Base query with soil test data and crop requirements
    - Parse Bedrock response to extract NPK, Urea, DAP, and micronutrient doses
    - Apply Urea safety limits (max 200 kg/hectare for most crops, 250 for rice)
    - Generate split-dose schedule with basal and top-dressing applications
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9_
  
  - [ ]* 4.2 Write property test for Urea over-application prevention
    - **Property 43: Urea Over-Application Prevention**
    - **Validates: Requirements 14.5**
    - Test that Urea doses never exceed safe limits for any crop
    - Verify limits: 200 kg/hectare (general), 250 kg/hectare (rice)
  
  - [x] 4.3 Add cost estimation to nutrient management response
    - Define static fertilizer price data (INR per kg) for common fertilizers
    - Calculate total cost breakdown by fertilizer type
    - Include cost estimates in NutrientManagementPlan response
    - _Requirements: 14.10_
  
  - [x] 4.4 Add organic fertilizer alternatives
    - Query Bedrock KB for organic alternatives (FYM, compost, vermicompost)
    - Calculate equivalent nutrient values for organic options
    - Include application rates and expected outcomes
    - Add organic alternatives to response
    - _Requirements: 14.11, 14.12_
  
  - [ ]* 4.5 Write unit tests for split-dose recommendations
    - Test that basal application is included in split doses
    - Test that top-dressing applications have correct timing (days after sowing)
    - Test that quantities sum to total dose
    - _Requirements: 14.6, 14.7, 14.8, 14.9_
  
  - [x] 4.6 Implement Urea risk warnings
    - Check soil test nitrogen levels against thresholds
    - Generate warnings when existing nitrogen is high and Urea is recommended
    - Include soil health damage warnings in response
    - _Requirements: 14.13_

- [x] 5. Checkpoint - Test nutrient management features
  - Ensure all nutrient management calculations work correctly, ask the user if questions arise.

- [x] 6. Implement Risk Mitigation & Harvest Optimization (Requirement 15)
  - [x] 6.1 Implement risk assessment endpoint
    - Accept cropName, growthStage, locationId, and language in request body
    - Query Bedrock KB with crop stage and weather pattern data for pest/disease prediction
    - Calculate pest and disease outbreak probabilities (0-100)
    - Identify specific pest types (bollworm, aphids, stem borer)
    - Generate preventive measures and treatment recommendations
    - _Requirements: 15.1, 15.2, 15.5, 15.6, 15.7_
  
  - [ ]* 6.2 Write property test for outbreak prediction
    - **Property 48: Pest and Disease Outbreak Prediction**
    - **Validates: Requirements 15.1, 15.2**
    - Test that predictions return probabilities between 0-100
    - Verify both pest and disease probabilities are calculated
  
  - [x] 6.3 Implement alert generation for high-risk scenarios
    - Check if pest or disease probability exceeds 60%
    - Generate RiskAlert objects with severity and time sensitivity
    - Include specific pest identification and action recommendations
    - Prioritize alerts by severity (critical > high > medium > low)
    - _Requirements: 15.3, 15.4, 15.16_
  
  - [ ]* 6.4 Write property test for alert triggering
    - **Property 49: Outbreak Alert Triggering**
    - **Validates: Requirements 15.3, 15.4**
    - Test that alerts are generated when probability > 60%
    - Test that no alerts are generated when probability ≤ 60%
  
  - [x] 6.5 Add weather-based risk alerts
    - Query Bedrock KB for weather risk patterns (frost, heatwave, heavy rain)
    - Generate weather risk alerts with protective actions
    - Include potential damage descriptions
    - Add weather risks to RiskAssessment response
    - _Requirements: 15.11, 15.12, 15.13, 15.14_
  
  - [x] 6.6 Implement harvest timing optimization
    - Query Bedrock KB for optimal harvest timing based on crop maturity
    - Include yield maximization factors in recommendation
    - Add market price optimization considerations (use static price trends for MVP)
    - Generate HarvestRecommendation with optimal date and window
    - _Requirements: 15.8, 15.9, 15.10_
  
  - [ ]* 6.7 Write unit tests for alert prioritization
    - Test that critical alerts appear before high severity alerts
    - Test that time-sensitive alerts are prioritized correctly
    - Test that multiple risk factors are handled properly
    - _Requirements: 15.16_

- [x] 7. Checkpoint - Test risk assessment features
  - Ensure all risk assessment endpoints work correctly, ask the user if questions arise.

- [x] 8. Update frontend UI for new features
  - [x] 8.1 Add sowing calendar UI section to public/index.html
    - Create form to request sowing calendar (crop selection, location)
    - Display sowing windows with dates and optimality scores
    - Add download buttons for PDF and iCal export
    - Support bilingual display (English/Hindi)
    - _Requirements: 13.1, 13.8, 13.9, 13.11_
  
  - [x] 8.2 Add irrigation schedule UI section
    - Create form to request irrigation schedule (crop, growth stage)
    - Display day-by-day irrigation events in table format
    - Show total seasonal water requirement
    - Add calendar export buttons
    - _Requirements: 13.5, 13.7, 13.11_
  
  - [x] 8.3 Add nutrient management calculator UI section
    - Create form for soil test results input (NPK, pH, EC, micronutrients)
    - Display fertilizer dose recommendations with split-dose schedule
    - Show cost estimates with breakdown
    - Display organic alternatives
    - Show warnings if Urea risk is detected
    - _Requirements: 14.1, 14.6, 14.10, 14.11, 14.13, 14.14_
  
  - [x] 8.4 Add risk assessment dashboard UI section
    - Create form to request risk assessment (crop, growth stage)
    - Display pest and disease risks with probabilities
    - Show weather-based risk alerts with protective actions
    - Display harvest timing recommendations
    - Highlight high-priority alerts (>60% probability)
    - _Requirements: 15.1, 15.3, 15.11, 15.15_
  
  - [x] 8.5 Update existing UI for mobile responsiveness
    - Ensure all new sections work on mobile devices (320px+)
    - Test touch-friendly controls (44px minimum)
    - Optimize for low-end smartphones
    - _Requirements: 8.1, 8.2_

- [x] 9. Final integration and testing
  - [x] 9.1 Wire all components together
    - Connect frontend forms to new API endpoints
    - Test end-to-end flows for all three features
    - Verify bilingual support works across all features
    - _Requirements: 7.2, 7.3, 13.11, 14.14, 15.15_
  
  - [ ]* 9.2 Write integration tests for complete workflows
    - Test sowing calendar generation → export flow
    - Test nutrient management calculation → cost estimation flow
    - Test risk assessment → alert generation flow
    - _Requirements: 13.1, 14.1, 15.1_
  
  - [x] 9.3 Update documentation
    - Add new API endpoints to README or API documentation
    - Document new features for demo purposes
    - Update environment variables if needed

- [ ] 10. Final checkpoint - Demo preparation
  - Ensure all features work end-to-end, prepare demo scenarios, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery within 2-day timeline
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at reasonable breaks
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All features leverage existing AWS Bedrock Knowledge Base (no new infrastructure needed)
- Focus on core functionality first, then add polish if time permits
- Calendar export can use simple libraries (node-ical for iCal, html-pdf for PDF)
- Market price data uses static/mock data for MVP (can integrate real APIs later)
- Alert scheduling/SMS delivery is out of scope for 2-day MVP (manual checking only)
