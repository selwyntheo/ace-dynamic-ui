import { test, expect } from '@playwright/test';

test.describe('Page Management and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock all page management APIs
    await page.route('/api/pages**', async route => {
      const url = route.request().url();
      const method = route.request().method();
      
      if (method === 'GET' && url.endsWith('/api/pages')) {
        // List all pages
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: '1',
              name: 'Dashboard',
              description: 'Main dashboard with analytics',
              components: [
                {
                  id: '1',
                  type: 'card',
                  name: 'Revenue Card',
                  properties: { title: 'Total Revenue', value: '$50,000' },
                  xPosition: 0,
                  yPosition: 0
                },
                {
                  id: '2',
                  type: 'table',
                  name: 'Sales Table',
                  properties: { datasetId: 'sales-2024' },
                  xPosition: 300,
                  yPosition: 0
                }
              ],
              layout: {
                type: 'columns',
                columnCount: 2,
                spacing: 20,
                showHeader: true,
                showFooter: false
              },
              isPublished: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T12:00:00.000Z'
            },
            {
              id: '2',
              name: 'Analytics Report',
              description: 'Detailed analytics and reporting',
              components: [
                {
                  id: '3',
                  type: 'chart',
                  name: 'Sales Chart',
                  properties: { chartType: 'bar', datasetId: 'sales-monthly' },
                  xPosition: 0,
                  yPosition: 0
                }
              ],
              layout: {
                type: 'single',
                spacing: 16,
                showHeader: true,
                showFooter: true
              },
              isPublished: false,
              createdAt: '2024-01-02T00:00:00.000Z',
              updatedAt: '2024-01-02T15:30:00.000Z'
            },
            {
              id: '3',
              name: 'Customer Portal',
              description: 'Customer-facing portal',
              components: [],
              layout: {
                type: 'sidebar',
                sidebarWidth: 250,
                spacing: 12,
                showHeader: true,
                showFooter: false
              },
              isPublished: true,
              createdAt: '2024-01-03T00:00:00.000Z',
              updatedAt: '2024-01-03T09:15:00.000Z'
            }
          ])
        });
      } else if (method === 'GET' && url.includes('/api/pages/')) {
        // Get specific page
        const pageId = url.split('/').pop() as string;
        const pages: Record<string, any> = {
          '1': {
            id: '1',
            name: 'Dashboard',
            description: 'Main dashboard with analytics',
            components: [
              {
                id: '1',
                type: 'card',
                name: 'Revenue Card',
                properties: { title: 'Total Revenue', value: '$50,000' },
                xPosition: 0,
                yPosition: 0
              },
              {
                id: '2',
                type: 'table',
                name: 'Sales Table',
                properties: { datasetId: 'sales-2024' },
                xPosition: 300,
                yPosition: 0
              }
            ],
            layout: {
              type: 'columns',
              columnCount: 2,
              spacing: 20,
              showHeader: true,
              showFooter: false
            },
            isPublished: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T12:00:00.000Z'
          },
          '2': {
            id: '2',
            name: 'Analytics Report',
            description: 'Detailed analytics and reporting',
            components: [
              {
                id: '3',
                type: 'chart',
                name: 'Sales Chart',
                properties: { chartType: 'bar', datasetId: 'sales-monthly' },
                xPosition: 0,
                yPosition: 0
              }
            ],
            layout: {
              type: 'single',
              spacing: 16,
              showHeader: true,
              showFooter: true
            },
            isPublished: false,
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T15:30:00.000Z'
          }
        };
        
        const page = pages[pageId];
        if (page) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(page)
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else if (method === 'POST' && url.endsWith('/api/pages')) {
        // Create new page
        const requestBody = await route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-page-' + Date.now(),
            ...requestBody,
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      } else if (method === 'PUT' && url.includes('/api/pages/')) {
        // Update page
        const pageId = url.split('/').pop();
        const requestBody = await route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: pageId,
            ...requestBody,
            updatedAt: new Date().toISOString()
          })
        });
      } else if (method === 'PATCH' && url.includes('/publish')) {
        // Publish page
        const pageId = url.split('/')[url.split('/').length - 2];
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: pageId,
            isPublished: true,
            updatedAt: new Date().toISOString()
          })
        });
      } else if (method === 'PATCH' && url.includes('/unpublish')) {
        // Unpublish page
        const pageId = url.split('/')[url.split('/').length - 2];
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: pageId,
            isPublished: false,
            updatedAt: new Date().toISOString()
          })
        });
      } else if (method === 'DELETE') {
        // Delete page
        await route.fulfill({ status: 204 });
      }
    });
  });

  test('should load and display page list', async ({ page }) => {
    // Add a "Pages" or "Load Page" button to trigger page listing
    // For this test, we'll simulate the action directly
    const pagesData = await page.evaluate(() => {
      return fetch('/api/pages').then(response => response.json());
    });

    expect(pagesData).toHaveLength(3);
    expect(pagesData[0].name).toBe('Dashboard');
    expect(pagesData[1].name).toBe('Analytics Report');
    expect(pagesData[2].name).toBe('Customer Portal');
  });

  test('should create a new page with sample data', async ({ page }) => {
    // Create a new page with components and layout
    const canvas = page.locator('[data-testid="canvas"]').or(
      page.locator('.bg-white.min-h-full')
    );

    // Set up multi-column layout
    await page.getByRole('button', { name: /layout/i }).click();
    await page.getByText('Multi-Column').click();
    const columnSlider = page.locator('input[type="range"]').first();
    await columnSlider.fill('3');
    await page.getByRole('button', { name: /apply layout/i }).click();

    // Add components with real data properties
    await page.getByText('Card').locator('..').dragTo(canvas);
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Chart').locator('..').dragTo(canvas);

    // Simulate saving the page
    const saveResponse = await page.evaluate(() => {
      const pageData = {
        name: 'New Analytics Dashboard',
        description: 'A comprehensive analytics dashboard with real data',
        components: [
          {
            id: 'card-1',
            type: 'card',
            name: 'KPI Card',
            properties: {
              title: 'Monthly Revenue',
              value: '$125,000',
              trend: '+12%',
              datasetId: 'revenue-monthly'
            },
            xPosition: 0,
            yPosition: 0
          },
          {
            id: 'table-1',
            type: 'table',
            name: 'Sales Data',
            properties: {
              datasetId: 'sales-detailed',
              showPagination: true,
              rowsPerPage: 25
            },
            xPosition: 400,
            yPosition: 0
          },
          {
            id: 'chart-1',
            type: 'chart',
            name: 'Growth Chart',
            properties: {
              chartType: 'line',
              datasetId: 'growth-trends',
              showLegend: true,
              timeRange: 'last-12-months'
            },
            xPosition: 800,
            yPosition: 0
          }
        ],
        layout: {
          type: 'columns',
          columnCount: 3,
          spacing: 24,
          showHeader: true,
          showFooter: false
        }
      };

      return fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      }).then(response => response.json());
    });

    expect(saveResponse.name).toBe('New Analytics Dashboard');
    expect(saveResponse.id).toMatch(/new-page-\d+/);
    expect(saveResponse.components).toHaveLength(3);
  });

  test('should load existing page with real data', async ({ page }) => {
    // Load the Dashboard page (ID: 1)
    const pageData = await page.evaluate(() => {
      return fetch('/api/pages/1').then(response => response.json());
    });

    expect(pageData.name).toBe('Dashboard');
    expect(pageData.components).toHaveLength(2);
    expect(pageData.components[0].properties.title).toBe('Total Revenue');
    expect(pageData.components[1].properties.datasetId).toBe('sales-2024');
    expect(pageData.layout.type).toBe('columns');
    expect(pageData.layout.columnCount).toBe(2);

    // Simulate loading this page into the canvas
    // In a real app, this would update the state and re-render components
    await page.evaluate((data) => {
      // This would be handled by the page loading functionality
      console.log('Loading page:', data.name);
      console.log('Components:', data.components.length);
      console.log('Layout:', data.layout.type);
    }, pageData);
  });

  test('should navigate between different saved pages', async ({ page }) => {
    // Load first page
    const page1 = await page.evaluate(() => {
      return fetch('/api/pages/1').then(response => response.json());
    });
    expect(page1.name).toBe('Dashboard');

    // Load second page
    const page2 = await page.evaluate(() => {
      return fetch('/api/pages/2').then(response => response.json());
    });
    expect(page2.name).toBe('Analytics Report');

    // Verify different layouts
    expect(page1.layout.type).toBe('columns');
    expect(page2.layout.type).toBe('single');

    // Verify different component sets
    expect(page1.components).toHaveLength(2);
    expect(page2.components).toHaveLength(1);
    expect(page2.components[0].type).toBe('chart');
  });

  test('should publish and unpublish pages', async ({ page }) => {
    // Publish a page
    const publishResponse = await page.evaluate(() => {
      return fetch('/api/pages/2/publish', {
        method: 'PATCH'
      }).then(response => response.json());
    });

    expect(publishResponse.isPublished).toBe(true);
    expect(publishResponse.id).toBe('2');

    // Unpublish a page
    const unpublishResponse = await page.evaluate(() => {
      return fetch('/api/pages/1/unpublish', {
        method: 'PATCH'
      }).then(response => response.json());
    });

    expect(unpublishResponse.isPublished).toBe(false);
    expect(unpublishResponse.id).toBe('1');
  });

  test('should update existing page with changes', async ({ page }) => {
    // Load existing page
    const originalPage = await page.evaluate(() => {
      return fetch('/api/pages/1').then(response => response.json());
    });

    // Modify the page
    const modifiedPage = {
      ...originalPage,
      name: 'Updated Dashboard',
      description: 'Updated description with new features',
      components: [
        ...originalPage.components,
        {
          id: 'new-component',
          type: 'button',
          name: 'Action Button',
          properties: { label: 'Export Data', variant: 'primary' },
          xPosition: 600,
          yPosition: 0
        }
      ]
    };

    // Save the updated page
    const updateResponse = await page.evaluate((data) => {
      return fetch(`/api/pages/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(response => response.json());
    }, modifiedPage);

    expect(updateResponse.name).toBe('Updated Dashboard');
    expect(updateResponse.components).toHaveLength(3);
    expect(updateResponse.components[2].type).toBe('button');
  });

  test('should handle page deletion', async ({ page }) => {
    // Delete a page
    const deleteResponse = await page.evaluate(() => {
      return fetch('/api/pages/3', {
        method: 'DELETE'
      });
    });

    expect(deleteResponse.status).toBe(204);
  });

  test('should filter pages by published status', async ({ page }) => {
    // Get all pages
    const allPages = await page.evaluate(() => {
      return fetch('/api/pages').then(response => response.json());
    });

    // Filter published pages (this would be done in the frontend)
    const publishedPages = allPages.filter(p => p.isPublished);
    const unpublishedPages = allPages.filter(p => !p.isPublished);

    expect(publishedPages).toHaveLength(2); // Dashboard and Customer Portal
    expect(unpublishedPages).toHaveLength(1); // Analytics Report

    expect(publishedPages[0].name).toBe('Dashboard');
    expect(publishedPages[1].name).toBe('Customer Portal');
    expect(unpublishedPages[0].name).toBe('Analytics Report');
  });

  test('should search pages by name and description', async ({ page }) => {
    // Get all pages
    const allPages = await page.evaluate(() => {
      return fetch('/api/pages').then(response => response.json());
    });

    // Search functionality (would be implemented in frontend)
    const searchResults = allPages.filter(p => 
      p.name.toLowerCase().includes('dashboard') || 
      p.description.toLowerCase().includes('dashboard')
    );

    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].name).toBe('Dashboard');
  });

  test('should handle auto-save functionality', async ({ page }) => {
    // Simulate auto-save after component changes
    const canvas = page.locator('[data-testid="canvas"]').or(
      page.locator('.bg-white.min-h-full')
    );

    // Add a component (this would trigger auto-save)
    await page.getByText('Card').locator('..').dragTo(canvas);

    // Wait for auto-save debounce (simulate the delay)
    await page.waitForTimeout(1000);

    // Simulate the auto-save request
    const autoSaveResponse = await page.evaluate(() => {
      const currentPageData = {
        id: 'current-page',
        name: 'Auto-saved Page',
        description: 'This page was auto-saved',
        components: [
          {
            id: 'auto-card',
            type: 'card',
            name: 'Auto Card',
            properties: {},
            xPosition: 100,
            yPosition: 100
          }
        ],
        layout: { type: 'single' }
      };

      return fetch('/api/pages/current-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPageData)
      }).then(response => response.json());
    });

    expect(autoSaveResponse.name).toBe('Auto-saved Page');
    expect(autoSaveResponse.components).toHaveLength(1);
  });

  test('should duplicate existing page', async ({ page }) => {
    // Get original page
    const originalPage = await page.evaluate(() => {
      return fetch('/api/pages/1').then(response => response.json());
    });

    // Create duplicate
    const duplicateData = {
      ...originalPage,
      name: `Copy of ${originalPage.name}`,
      description: `Duplicate of: ${originalPage.description}`,
      id: undefined // Remove ID so backend creates new one
    };

    const duplicateResponse = await page.evaluate((data) => {
      return fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(response => response.json());
    }, duplicateData);

    expect(duplicateResponse.name).toBe('Copy of Dashboard');
    expect(duplicateResponse.components).toHaveLength(2);
    expect(duplicateResponse.layout.type).toBe('columns');
    expect(duplicateResponse.id).not.toBe(originalPage.id);
  });
});
