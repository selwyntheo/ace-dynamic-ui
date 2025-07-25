#!/bin/bash

# Dynamic UI Builder - Comprehensive Test Runner
# This script runs all test suites and generates reports

echo "🚀 Starting Dynamic UI Builder Test Suite"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if servers are running
echo -e "${BLUE}📡 Checking server status...${NC}"

# Check frontend server
if curl -s http://localhost:5174 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server is running on port 5174${NC}"
else
    echo -e "${RED}❌ Frontend server is not running. Please start with 'npm run dev'${NC}"
    exit 1
fi

# Check backend server
if curl -s http://localhost:8080/api/datasets > /dev/null; then
    echo -e "${GREEN}✅ Backend server is running on port 8080${NC}"
else
    echo -e "${RED}❌ Backend server is not running. Please start the Spring Boot application${NC}"
    exit 1
fi

echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Create test results directory
mkdir -p test-results

echo -e "${BLUE}🧪 Running Test Suites...${NC}"
echo ""

# Run API Integration Tests
echo -e "${YELLOW}1️⃣ Running API Integration Tests...${NC}"
npx playwright test tests/api/integration.spec.ts --reporter=html --output-dir=test-results/api
API_RESULT=$?

echo ""

# Run Simple UI Tests
echo -e "${YELLOW}2️⃣ Running Simple UI Tests...${NC}"
npx playwright test tests/e2e/simple-ui.spec.ts --reporter=html --output-dir=test-results/simple-ui
SIMPLE_RESULT=$?

echo ""

# Run Moderate Complexity Tests
echo -e "${YELLOW}3️⃣ Running Moderate Complexity Tests...${NC}"
npx playwright test tests/e2e/moderate-complexity.spec.ts --reporter=html --output-dir=test-results/moderate
MODERATE_RESULT=$?

echo ""

# Run Complex Integration Tests
echo -e "${YELLOW}4️⃣ Running Complex Integration Tests...${NC}"
npx playwright test tests/e2e/complex-integration.spec.ts --reporter=html --output-dir=test-results/complex
COMPLEX_RESULT=$?

echo ""

# Run Performance Tests
echo -e "${YELLOW}5️⃣ Running Performance Tests...${NC}"
npx playwright test tests/e2e/performance.spec.ts --reporter=html --output-dir=test-results/performance
PERFORMANCE_RESULT=$?

echo ""

# Run Accessibility Tests
echo -e "${YELLOW}6️⃣ Running Accessibility Tests...${NC}"
npx playwright test tests/e2e/accessibility.spec.ts --reporter=html --output-dir=test-results/accessibility
ACCESSIBILITY_RESULT=$?

echo ""

# Summary
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "========================"

if [ $API_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ API Integration Tests: PASSED${NC}"
else
    echo -e "${RED}❌ API Integration Tests: FAILED${NC}"
fi

if [ $SIMPLE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Simple UI Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Simple UI Tests: FAILED${NC}"
fi

if [ $MODERATE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Moderate Complexity Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Moderate Complexity Tests: FAILED${NC}"
fi

if [ $COMPLEX_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Complex Integration Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Complex Integration Tests: FAILED${NC}"
fi

if [ $PERFORMANCE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Performance Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Performance Tests: FAILED${NC}"
fi

if [ $ACCESSIBILITY_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Accessibility Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Accessibility Tests: FAILED${NC}"
fi

echo ""

# Overall result
TOTAL_FAILURES=$((API_RESULT + SIMPLE_RESULT + MODERATE_RESULT + COMPLEX_RESULT + PERFORMANCE_RESULT + ACCESSIBILITY_RESULT))

if [ $TOTAL_FAILURES -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "${GREEN}The Dynamic UI Builder is working perfectly!${NC}"
else
    echo -e "${RED}❌ $TOTAL_FAILURES test suite(s) failed${NC}"
    echo -e "${YELLOW}Please check the individual test reports for details${NC}"
fi

echo ""
echo -e "${BLUE}📁 Test reports generated in:${NC}"
echo "  • API Integration: test-results/api/"
echo "  • Simple UI: test-results/simple-ui/"
echo "  • Moderate Complexity: test-results/moderate/"
echo "  • Complex Integration: test-results/complex/"
echo "  • Performance: test-results/performance/"
echo "  • Accessibility: test-results/accessibility/"

echo ""
echo -e "${BLUE}🌐 To view detailed reports, open:${NC}"
echo "  npx playwright show-report test-results/[test-type]/"

exit $TOTAL_FAILURES
