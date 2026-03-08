#!/bin/bash

# Test script for new features
# Run this after starting the server with: node server.js

BASE_URL="http://localhost:3000"

echo "🧪 Testing AI Crop Intelligence Platform - New Features"
echo "=================================================="
echo ""

# Test 1: Sowing Calendar
echo "📅 Test 1: Sowing Calendar"
curl -X POST $BASE_URL/api/v1/calendar/sowing \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Wheat","locationId":"Maharashtra-Pune","language":"en"}' \
  -s | jq '.success, .calendar.cropName, .calendar.calendarId' 2>/dev/null || echo "Response received (install jq for formatted output)"
echo ""
echo ""

# Test 2: Irrigation Schedule
echo "💧 Test 2: Irrigation Schedule"
curl -X POST $BASE_URL/api/v1/calendar/irrigation \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Rice","growthStage":"vegetative","locationId":"Maharashtra-Pune","language":"en"}' \
  -s | jq '.success, .schedule.cropName, .schedule.scheduleId' 2>/dev/null || echo "Response received (install jq for formatted output)"
echo ""
echo ""

# Test 3: Fertilizer Calculator
echo "🧪 Test 3: Fertilizer Calculator"
curl -X POST $BASE_URL/api/v1/nutrient-management/calculate \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Cotton","soilTestResults":{"nitrogenPpm":250,"phosphorusPpm":15,"potassiumPpm":120,"phLevel":6.5},"language":"en"}' \
  -s | jq '.success, .plan.cropName, .plan.planId' 2>/dev/null || echo "Response received (install jq for formatted output)"
echo ""
echo ""

# Test 4: Risk Assessment
echo "⚠️ Test 4: Risk Assessment"
curl -X POST $BASE_URL/api/v1/risk-assessment \
  -H "Content-Type: application/json" \
  -d '{"cropName":"Wheat","growthStage":"flowering","locationId":"Maharashtra-Pune","language":"en"}' \
  -s | jq '.success, .assessment.cropName, .assessment.assessmentId' 2>/dev/null || echo "Response received (install jq for formatted output)"
echo ""
echo ""

# Test 5: Health Check
echo "❤️ Test 5: Health Check"
curl -X GET $BASE_URL/health -s | jq '.' 2>/dev/null || echo "Response received (install jq for formatted output)"
echo ""
echo ""

echo "=================================================="
echo "✅ All tests completed!"
echo ""
echo "To test in browser, open: http://localhost:3000"
echo "To deploy to EC2, follow instructions in NEW-FEATURES.md"
