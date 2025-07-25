# Dynamic UI Builder - Testing Documentation

This document describes the comprehensive test suite for the Dynamic UI Builder application.

## Test Architecture

Our testing strategy covers multiple layers and complexity levels:

### 1. API Integration Tests (`tests/api/integration.spec.ts`)
- **Purpose**: Tests backend REST API endpoints
- **Coverage**: 
  - Dataset CRUD operations
  - UI Component persistence
  - Error handling and validation
  - Data integrity checks

### 2. Simple UI Tests (`tests/e2e/simple-ui.spec.ts`)
- **Purpose**: Basic user interface functionality
- **Coverage**:
  - Component drag and drop
  - Mode switching (Builder/Preview)
  - Basic component creation
  - UI element visibility

### 3. Moderate Complexity Tests (`tests/e2e/moderate-complexity.spec.ts`)
- **Purpose**: Mid-level user workflows
- **Coverage**:
  - Component property configuration
  - Multiple component interactions
  - State persistence
  - Form validation

### 4. Complex Integration Tests (`tests/e2e/complex-integration.spec.ts`)
- **Purpose**: End-to-end business workflows
- **Coverage**:
  - Complete application workflows
  - API + UI integration
  - Data-driven component creation
  - Cross-component interactions
  - Error recovery scenarios

### 5. Performance Tests (`tests/e2e/performance.spec.ts`)
- **Purpose**: Application performance and stress testing
- **Coverage**:
  - Large number of components (50+)
  - Rapid component creation/deletion
  - Memory usage with complex layouts
  - API stress testing
  - Browser resource constraints

### 6. Accessibility Tests (`tests/e2e/accessibility.spec.ts`)
- **Purpose**: Web accessibility compliance
- **Coverage**:
  - Semantic HTML structure
  - Keyboard navigation
  - Screen reader support
  - ARIA attributes
  - Color contrast
  - Zoom level support

## Prerequisites

Before running tests, ensure:

1. **Frontend Server** is running on `http://localhost:5174`
   ```bash
   npm run dev
   ```

2. **Backend Server** is running on `http://localhost:8080`
   ```bash
   # In the backend directory
   ./mvnw spring-boot:run
   ```

3. **Dependencies** are installed
   ```bash
   npm install
   ```

## Running Tests

### Quick Start - Run All Tests
```bash
./run-tests.sh
```

### Individual Test Suites

#### API Integration Tests
```bash
npx playwright test tests/api/integration.spec.ts
```

#### Simple UI Tests
```bash
npx playwright test tests/e2e/simple-ui.spec.ts
```

#### Moderate Complexity Tests
```bash
npx playwright test tests/e2e/moderate-complexity.spec.ts
```

#### Complex Integration Tests
```bash
npx playwright test tests/e2e/complex-integration.spec.ts
```

#### Performance Tests
```bash
npx playwright test tests/e2e/performance.spec.ts
```

#### Accessibility Tests
```bash
npx playwright test tests/e2e/accessibility.spec.ts
```

### Running Tests with Specific Options

#### Debug Mode
```bash
npx playwright test --debug
```

#### Headed Mode (See Browser)
```bash
npx playwright test --headed
```

#### Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

#### Generate Report
```bash
npx playwright test --reporter=html
npx playwright show-report
```

## Test Reports

After running tests, reports are generated in:
- `test-results/` - Individual test suite results
- `playwright-report/` - Combined HTML reports
- `test-results/` subdirectories for each test type

To view reports:
```bash
npx playwright show-report
```

## Test Data

### Sample Datasets
Tests use predefined sample datasets:
- **Sales Data**: E-commerce transaction data
- **User Analytics**: User behavior metrics
- **Product Inventory**: Product catalog information

### Test Components
Tests create and validate various UI components:
- **Tables**: Data display with pagination and search
- **Buttons**: Interactive elements with different styles
- **Forms**: Input collection with validation
- **Charts**: Data visualization components
- **Cards**: Content containers
- **Text**: Static content display

## Debugging Tests

### Common Issues

1. **Server Not Running**
   - Ensure both frontend (5174) and backend (8080) servers are active
   - Check network connectivity

2. **Test Timeouts**
   - Increase timeout in `playwright.config.ts`
   - Check for slow network or heavy system load

3. **Element Not Found**
   - Verify component names and selectors
   - Check for timing issues (use `waitFor` methods)

4. **API Errors**
   - Verify backend server status
   - Check API endpoint availability
   - Validate request/response formats

### Debug Commands

```bash
# Run specific test with debug info
npx playwright test tests/e2e/simple-ui.spec.ts --debug

# Run with trace recording
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Headless mode for CI
npx playwright test --reporter=junit

# With retries for flaky tests
npx playwright test --retries=2

# Generate artifacts
npx playwright test --reporter=html --output-dir=ci-test-results
```

## Test Environment Configuration

### Browser Support
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

### Viewport Testing
- Desktop: 1400x900
- Tablet: 768x1024
- Mobile: 414x896

### Network Conditions
- Fast 3G simulation
- Slow network testing
- Offline scenarios

## Performance Benchmarks

### Expected Performance Metrics
- **Component Creation**: < 200ms per component
- **Mode Switch**: < 1000ms
- **50 Components Load**: < 30 seconds
- **API Response**: < 500ms average

### Memory Usage
- **Baseline**: ~50MB
- **50 Components**: < 200MB
- **Complex Layout**: < 500MB

## Accessibility Standards

Tests validate compliance with:
- **WCAG 2.1 AA** guidelines
- **Section 508** requirements
- **WAI-ARIA** specifications

### Key Accessibility Features Tested
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management
- Semantic HTML structure

## Contributing to Tests

### Adding New Tests

1. **Choose appropriate test file** based on complexity
2. **Follow naming conventions**: `should [action] [expected result]`
3. **Include proper setup** and cleanup
4. **Add meaningful assertions**
5. **Document test purpose**

### Test Structure Template

```typescript
test('should [action] [expected result]', async ({ page }) => {
  // Setup
  await page.goto('/');
  
  // Action
  // ... test steps
  
  // Assertions
  await expect(page.locator('...')).toBeVisible();
  
  // Cleanup (if needed)
});
```

### Best Practices

1. **Use data-testid** for reliable element selection
2. **Wait for elements** before interaction
3. **Test both positive and negative scenarios**
4. **Keep tests independent** and idempotent
5. **Use meaningful test descriptions**
6. **Group related tests** in describe blocks

## Troubleshooting

### Common Test Failures

1. **Timing Issues**
   - Add explicit waits: `await page.waitForSelector()`
   - Use `toBeVisible()` instead of checking presence

2. **Flaky Drag-and-Drop**
   - Ensure source and target elements are stable
   - Add small delays between actions

3. **API Dependency Failures**
   - Mock external dependencies
   - Use test-specific data

4. **Environment Differences**
   - Use consistent test data
   - Account for different screen sizes

For additional help, check the [Playwright documentation](https://playwright.dev/) or create an issue in the project repository.
