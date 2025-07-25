#!/bin/bash

# Dynamic UI Builder - Enhanced Data Integration Demo
# This script demonstrates the improved data-driven features

echo "🎉 Dynamic UI Builder - Enhanced Data Integration Demo"
echo "======================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}🚀 NEW FEATURES ADDED:${NC}"
echo "   ✅ Real data integration with backend datasets"
echo "   ✅ Dataset selector for table components"
echo "   ✅ Dynamic column generation from dataset schema"
echo "   ✅ Automatic data type formatting (prices, dates, booleans)"
echo "   ✅ Smart color coding for status fields"
echo "   ✅ Connected data tables with live backend data"

echo ""
echo -e "${YELLOW}📊 Available Datasets:${NC}"
curl -s http://localhost:8080/api/datasets | jq -r '.[] | "   • \(.name): \(.description) (\((.columns | keys) | length) columns)"'

echo ""
echo -e "${PURPLE}🔍 Sample Data from Products Dataset:${NC}"
curl -s "http://localhost:8080/api/datasets/2/data?limit=5" | jq '.'

echo ""
echo -e "${GREEN}🎯 HOW TO USE THE ENHANCED FEATURES:${NC}"
echo ""
echo "1. 🖱️  Open http://localhost:5173 in your browser"
echo "2. 📋 Drag a Table component to the canvas"
echo "3. ⚙️  Click on the table to open Properties panel"
echo "4. 🗃️  Use the 'Data Source' dropdown to select a dataset"
echo "5. 👀 Watch the table populate with real data from the backend!"
echo "6. 🔧 Configure pagination, search, and other table properties"

echo ""
echo -e "${BLUE}✨ KEY IMPROVEMENTS:${NC}"
echo "   • Tables now display REAL data from your backend"
echo "   • Automatic formatting based on data types"
echo "   • Dynamic column headers from dataset schema"
echo "   • Loading states and error handling"
echo "   • Smart data presentation (prices, dates, status badges)"

echo ""
echo -e "${YELLOW}🧪 Test Different Datasets:${NC}"
echo "   • Dataset 1: User data with names and emails"
echo "   • Dataset 2: Product catalog with prices and categories"
echo "   • Add your own datasets via the API!"

echo ""
echo -e "${GREEN}🎉 Your Retool Alternative is Now Data-Driven!${NC}"
echo -e "${GREEN}   Build real applications with live backend data! 🚀${NC}"
