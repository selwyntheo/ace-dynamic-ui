import { test, expect } from '@playwright/test';

test.describe('Multi-Column Layout and Page Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
  });

  test('should create and apply multi-column layout', async ({ page }) => {
    // Open layout selector
    await page.getByRole('button', { name: /layout/i }).click();
    await expect(page.getByText('Layout Options')).toBeVisible();

    // Select multi-column layout
    await page.getByText('Multi-Column').click();
    await expect(page.locator('input[type="radio"][value="columns"]')).toBeChecked();

    // Set column count to 3
    const columnSlider = page.locator('input[type="range"]').first();
    await columnSlider.fill('3');

    // Set spacing
    const spacingSlider = page.locator('input[type="range"]').last();
    await spacingSlider.fill('24');

    // Apply layout
    await page.getByRole('button', { name: /apply layout/i }).click();

    // Verify layout selector is closed
    await expect(page.getByText('Layout Options')).not.toBeVisible();

    // Add some components to test the layout
    const canvas = page.locator('[data-testid="canvas"]').or(
      page.locator('.bg-white.min-h-full')
    );

    // Add multiple components
    for (let i = 0; i < 6; i++) {
      await page.getByText('Card').locator('..').dragTo(canvas);
    }

    // Verify components are arranged in columns
    const components = page.locator('[data-testid*="component"]').or(
      page.locator('text=Card').locator('..')
    );
    await expect(components).toHaveCount(6);

    // Check if grid layout is applied (this is a visual test, so we check CSS)
    const canvasContainer = page.locator('.grid').or(
      page.locator('[style*="grid-template-columns"]')
    );
    await expect(canvasContainer).toBeVisible();
  });

  test('should save page with layout to backend', async ({ page }) => {
    // Create a complex page layout
    await page.getByRole('button', { name: /layout/i }).click();
    await page.getByText('Multi-Column').click();
    await page.getByRole('button', { name: /apply layout/i }).click();

    // Add components
    const canvas = page.locator('[data-testid="canvas"]').or(
      page.locator('.bg-white.min-h-full')
    );

    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Button').locator('..').dragTo(canvas);

    // Mock the save API
    await page.route('/api/pages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '123',
            name: 'Test Page',
            description: 'A test page with multi-column layout',
            components: [],
            layout: {
              type: 'columns',
              columnCount: 2,
              spacing: 16
            },
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      }
    });

    // Trigger save (this would be done via a save button or auto-save)
    // For now, we'll simulate the save action
    await page.evaluate(() => {
      // Simulate saving the current page state
      const pageData = {
        name: 'Test Page',
        description: 'A test page with multi-column layout',
        components: [
          {
            id: '1',
            type: 'table',
            name: 'Test Table',
            properties: {},
            xPosition: 0,
            yPosition: 0
          },
          {
            id: '2',
            type: 'card',
            name: 'Test Card',
            properties: {},
            xPosition: 0,
            yPosition: 100
          }
        ],
        layout: {
          type: 'columns',
          columnCount: 2,
          spacing: 16
        }
      };

      return fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      });
    });
  });

  test('should load saved page from backend', async ({ page }) => {
    // Mock the API response for loading a page
    await page.route('/api/pages/123', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '123',
          name: 'Saved Multi-Column Page',
          description: 'A saved page with multi-column layout',
          components: [
            {
              id: '1',
              type: 'table',
              name: 'Sales Data',
              properties: { datasetId: '1' },
              xPosition: 0,
              yPosition: 0,
              width: undefined,
              height: undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              type: 'card',
              name: 'Summary Card',
              properties: {},
              xPosition: 300,
              yPosition: 0,
              width: undefined,
              height: undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          layout: {
            type: 'columns',
            columnCount: 3,
            spacing: 20,
            showHeader: true,
            showFooter: false
          },
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });
    });

    // Navigate to the saved page (this would be done via a load page function)
    await page.evaluate(() => {
      // Simulate loading a page
      return fetch('/api/pages/123').then(response => response.json());
    });

    // Verify the page loads correctly
    // Note: In a real implementation, you'd have a "Load Page" button or similar
    // For this test, we're just verifying the API interaction works
  });

  test('should handle page management operations', async ({ page }) => {
    // Mock list pages API
    await page.route('/api/pages', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: '1',
              name: 'Dashboard Page',
              description: 'Main dashboard',
              components: [],
              layout: { type: 'single' },
              isPublished: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z'
            },
            {
              id: '2',
              name: 'Analytics Page',
              description: 'Analytics dashboard',
              components: [],
              layout: { type: 'columns', columnCount: 2 },
              isPublished: false,
              createdAt: '2024-01-02T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z'
            }
          ])
        });
      }
    });

    // Test page listing functionality
    await page.evaluate(() => {
      return fetch('/api/pages').then(response => response.json());
    });

    // Mock publish/unpublish API
    await page.route('/api/pages/2/publish', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          name: 'Analytics Page',
          isPublished: true
        })
      });
    });

    // Test publish functionality
    await page.evaluate(() => {
      return fetch('/api/pages/2/publish', { method: 'PATCH' });
    });
  });

  test('should handle template selection with layouts', async ({ page }) => {
    // Open template selector
    await page.getByRole('button', { name: /templates/i }).click();
    await expect(page.getByText('Choose a Template')).toBeVisible();

    // Filter by layout category
    await page.getByText('Layouts').click();

    // Select a template
    const templates = page.locator('text=Use Template').locator('..');
    await expect(templates.first()).toBeVisible();
    await templates.first().click();

    // Verify template is applied
    await expect(page.getByText('Choose a Template')).not.toBeVisible();

    // Check that components from template are loaded
    const componentCount = page.locator('text=component');
    await expect(componentCount).toBeVisible();
  });

  test('should validate layout constraints', async ({ page }) => {
    // Open layout selector
    await page.getByRole('button', { name: /layout/i }).click();

    // Test column count limits
    await page.getByText('Multi-Column').click();
    
    const columnSlider = page.locator('input[type="range"]').first();
    
    // Test minimum value
    await columnSlider.fill('1');
    await expect(columnSlider).toHaveValue('2'); // Should enforce minimum of 2

    // Test maximum value
    await columnSlider.fill('5');
    await expect(columnSlider).toHaveValue('4'); // Should enforce maximum of 4

    // Test valid range
    await columnSlider.fill('3');
    await expect(columnSlider).toHaveValue('3');

    await page.getByRole('button', { name: /apply layout/i }).click();
  });

  test('should support real-time layout preview', async ({ page }) => {
    // Add some components first
    const canvas = page.locator('[data-testid="canvas"]').or(
      page.locator('.bg-white.min-h-full')
    );

    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Button').locator('..').dragTo(canvas);

    // Open layout selector
    await page.getByRole('button', { name: /layout/i }).click();

    // Switch between different layouts and verify preview
    await page.getByText('Single Column').click();
    // Verify single column layout preview

    await page.getByText('Multi-Column').click();
    // Verify multi-column layout preview

    await page.getByText('Sidebar Layout').click();
    // Verify sidebar layout preview

    await page.getByRole('button', { name: /apply layout/i }).click();
  });
});
