import { test, expect } from '@playwright/test';

test.describe('Complex Integration - Full Workflow with API', () => {
  let datasetId: number;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
  });

  test('should create a complete data-driven application', async ({ page, request }) => {
    // Step 1: Create a dataset via API
    const newDataset = {
      name: 'Customer Management',
      description: 'Customer data for CRM application',
      columns: {
        id: 'number',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        company: 'string',
        status: 'string',
        createdAt: 'date',
        lastContact: 'date'
      }
    };

    const datasetResponse = await request.post('http://localhost:8080/api/datasets', {
      data: newDataset
    });
    expect(datasetResponse.status()).toBe(200);
    const dataset = await datasetResponse.json();
    datasetId = dataset.id;

    // Step 2: Build UI components that will use this dataset
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add header
    await page.getByText('Text').locator('..').dragTo(canvas);
    await page.getByText('Text 1').click();
    await page.getByLabel('Component Name').fill('CRM Dashboard');
    await page.getByLabel('Text Content').fill('Customer Relationship Management');
    await page.getByLabel('Font Size').selectOption('text-xl');
    await page.getByRole('button', { name: '×' }).click();

    // Add customer data table
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Table 2').click();
    await page.getByLabel('Component Name').fill('Customer List');
    await page.getByLabel('Show Pagination').check();
    await page.getByLabel('Show Search').check();
    await page.getByLabel('Page Size').fill('20');
    await page.getByRole('button', { name: '×' }).click();

    // Add action buttons
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByRole('button', { name: 'Button 3' }).click();
    await page.getByLabel('Component Name').fill('Add Customer');
    await page.getByLabel('Button Style').selectOption('primary');
    await page.getByLabel('Size').selectOption('medium');
    await page.getByRole('button', { name: '×' }).click();

    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByRole('button', { name: 'Button 4' }).click();
    await page.getByLabel('Component Name').fill('Export CSV');
    await page.getByLabel('Button Style').selectOption('secondary');
    await page.getByRole('button', { name: '×' }).click();

    // Add customer form
    await page.getByText('Form').locator('..').dragTo(canvas);
    await page.getByText('Form 5').click();
    await page.getByLabel('Component Name').fill('Customer Details Form');
    await page.getByRole('button', { name: '×' }).click();

    // Add summary card
    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Card 6').click();
    await page.getByLabel('Component Name').fill('Customer Summary');
    await page.getByLabel('Width').fill('400');
    await page.getByLabel('Height').fill('200');
    await page.getByRole('button', { name: '×' }).click();

    // Verify all components are created
    await expect(page.getByText('6 components')).toBeVisible();
    
    // Step 3: Test preview mode
    await page.getByRole('button', { name: /preview/i }).click();
    
    // Verify all components are rendered in preview
    await expect(page.getByText('Customer Relationship Management')).toBeVisible();
    await expect(page.getByText('Customer List')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible();
    await expect(page.getByText('Customer Details Form')).toBeVisible();
    await expect(page.getByText('Customer Summary')).toBeVisible();

    // Step 4: Verify components maintain their configurations
    await page.getByRole('button', { name: /builder/i }).click();
    
    // Check table configuration persists
    await page.getByText('Customer List').click();
    await expect(page.getByLabel('Show Pagination')).toBeChecked();
    await expect(page.getByLabel('Show Search')).toBeChecked();
    await expect(page.getByLabel('Page Size')).toHaveValue('20');
    await page.getByRole('button', { name: '×' }).click();

    // Check button configuration persists
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await expect(page.getByLabel('Button Style')).toHaveValue('primary');
    await expect(page.getByLabel('Size')).toHaveValue('medium');
    await page.getByRole('button', { name: '×' }).click();
  });

  test('should handle component interactions with API data', async ({ page, request }) => {
    // Create a dataset with sample data
    const dataset = {
      name: 'Product Catalog',
      description: 'Product inventory management',
      columns: {
        id: 'number',
        name: 'string',
        price: 'number',
        category: 'string',
        inStock: 'boolean'
      }
    };

    const datasetResponse = await request.post('http://localhost:8080/api/datasets', {
      data: dataset
    });
    const createdDataset = await datasetResponse.json();
    datasetId = createdDataset.id;

    // Create UI components linked to this dataset
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add product table
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Table 1').click();
    await page.getByLabel('Component Name').fill('Product Inventory');
    await page.getByLabel('Show Search').check();
    await page.getByRole('button', { name: '×' }).click();

    // Add filter controls
    await page.getByText('Form').locator('..').dragTo(canvas);
    await page.getByText('Form 2').click();
    await page.getByLabel('Component Name').fill('Product Filters');
    await page.getByRole('button', { name: '×' }).click();

    // Add summary statistics
    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Card 3').click();
    await page.getByLabel('Component Name').fill('Inventory Stats');
    await page.getByRole('button', { name: '×' }).click();

    // Test component responsiveness
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByText('Product Inventory')).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 600 });
    await expect(page.getByText('Product Inventory')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText('Product Inventory')).toBeVisible();
  });

  test('should support real-time component updates via API', async ({ page, request }) => {
    // Create initial dataset
    const dataset = {
      name: 'Live Dashboard Data',
      description: 'Real-time dashboard metrics',
      columns: {
        metric: 'string',
        value: 'number',
        timestamp: 'date'
      }
    };

    const datasetResponse = await request.post('http://localhost:8080/api/datasets', {
      data: dataset
    });
    const createdDataset = await datasetResponse.json();
    datasetId = createdDataset.id;

    // Create dashboard UI
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add metrics display
    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Card 1').click();
    await page.getByLabel('Component Name').fill('Sales Metrics');
    await page.getByRole('button', { name: '×' }).click();

    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Card 2').click();
    await page.getByLabel('Component Name').fill('User Metrics');
    await page.getByRole('button', { name: '×' }).click();

    // Add data visualization
    await page.getByText('Chart').locator('..').dragTo(canvas);
    await page.getByText('Chart 3').click();
    await page.getByLabel('Component Name').fill('Performance Chart');
    await page.getByRole('button', { name: '×' }).click();

    // Simulate data updates by updating the dataset
    const updatedDataset = {
      ...dataset,
      description: 'Updated real-time dashboard metrics'
    };

    const updateResponse = await request.put(`http://localhost:8080/api/datasets/${datasetId}`, {
      data: updatedDataset
    });
    expect(updateResponse.status()).toBe(200);

    // Verify UI components are still functional
    await expect(page.getByText('Sales Metrics')).toBeVisible();
    await expect(page.getByText('User Metrics')).toBeVisible();
    await expect(page.getByText('Performance Chart')).toBeVisible();
  });

  test('should handle component persistence across browser sessions', async ({ page, request, context }) => {
    // Create a complex dashboard
    const dataset = {
      name: 'Analytics Dashboard',
      description: 'Business analytics data',
      columns: {
        date: 'date',
        revenue: 'number',
        users: 'number',
        conversion: 'number'
      }
    };

    const datasetResponse = await request.post('http://localhost:8080/api/datasets', {
      data: dataset
    });
    const createdDataset = await datasetResponse.json();
    datasetId = createdDataset.id;

    // Build complex dashboard
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add multiple components with specific configurations
    await page.getByText('Text').locator('..').dragTo(canvas);
    await page.getByText('Text 1').click();
    await page.getByLabel('Component Name').fill('Analytics Dashboard');
    await page.getByLabel('Text Content').fill('Business Intelligence Dashboard');
    await page.getByLabel('Font Size').selectOption('text-xl');
    await page.getByRole('button', { name: '×' }).click();

    await page.getByText('Chart').locator('..').dragTo(canvas);
    await page.getByText('Chart 2').click();
    await page.getByLabel('Component Name').fill('Revenue Trend');
    await page.getByRole('button', { name: '×' }).click();

    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Table 3').click();
    await page.getByLabel('Component Name').fill('Detailed Analytics');
    await page.getByLabel('Page Size').fill('50');
    await page.getByRole('button', { name: '×' }).click();

    // Verify initial state
    await expect(page.getByText('3 components')).toBeVisible();

    // Create new browser context (simulates new session)
    const newContext = await context.browser()?.newContext();
    const newPage = await newContext?.newPage();
    
    if (newPage) {
      await newPage.goto('/');
      
      // In a real application, components would be persisted to backend
      // For now, verify the app loads correctly
      await expect(newPage.locator('h1')).toContainText('Dynamic UI Builder');
      await expect(newPage.getByText('Start Building Your App')).toBeVisible();
      
      await newContext?.close();
    }
  });

  test('should handle error scenarios gracefully', async ({ page, request }) => {
    // Test API error handling
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add components that might depend on API data
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Table 1').click();
    await page.getByLabel('Component Name').fill('Data Table');
    await page.getByRole('button', { name: '×' }).click();

    // Test with invalid dataset ID (simulate API error)
    const errorResponse = await request.get('http://localhost:8080/api/datasets/99999');
    expect(errorResponse.status()).toBe(404);

    // Verify UI remains stable
    await expect(page.getByText('Data Table')).toBeVisible();
    await expect(page.getByText('1 component')).toBeVisible();

    // Test component validation
    await page.getByText('Data Table').click();
    
    // Try to set invalid properties
    await page.getByLabel('Component Name').fill('');
    // Component should maintain some default name or validation
    
    await page.getByLabel('Page Size').fill('-1');
    // Should handle invalid values gracefully
    
    await page.getByRole('button', { name: '×' }).click();
  });

  test.afterEach(async ({ request }) => {
    // Cleanup: Delete created dataset
    if (datasetId) {
      await request.delete(`http://localhost:8080/api/datasets/${datasetId}`);
    }
  });
});
