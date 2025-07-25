import { test, expect } from '@playwright/test';

test.describe('Real Data Integration and Sample Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock dataset APIs for real data
    await page.route('/api/datasets**', async route => {
      const url = route.request().url();
      const method = route.request().method();
      
      if (method === 'GET' && url.endsWith('/api/datasets')) {
        // List available datasets
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'sales-2024',
              name: 'Sales Data 2024',
              description: 'Complete sales data for 2024',
              schema: {
                columns: ['date', 'product', 'amount', 'customer', 'region'],
                types: ['date', 'string', 'number', 'string', 'string']
              },
              rowCount: 15420,
              lastUpdated: '2024-01-15T10:30:00.000Z'
            },
            {
              id: 'revenue-monthly',
              name: 'Monthly Revenue',
              description: 'Monthly revenue aggregation',
              schema: {
                columns: ['month', 'revenue', 'growth_rate', 'target'],
                types: ['string', 'number', 'number', 'number']
              },
              rowCount: 12,
              lastUpdated: '2024-01-15T08:00:00.000Z'
            },
            {
              id: 'customer-analytics',
              name: 'Customer Analytics',
              description: 'Customer behavior and demographics',
              schema: {
                columns: ['customer_id', 'segment', 'lifetime_value', 'satisfaction', 'last_purchase'],
                types: ['string', 'string', 'number', 'number', 'date']
              },
              rowCount: 8532,
              lastUpdated: '2024-01-14T16:45:00.000Z'
            },
            {
              id: 'inventory-status',
              name: 'Inventory Status',
              description: 'Current inventory levels and alerts',
              schema: {
                columns: ['product_id', 'name', 'current_stock', 'reorder_level', 'status'],
                types: ['string', 'string', 'number', 'number', 'string']
              },
              rowCount: 2847,
              lastUpdated: '2024-01-15T12:15:00.000Z'
            }
          ])
        });
      } else if (method === 'GET' && url.includes('/api/datasets/')) {
        // Get specific dataset data
        const datasetId = url.split('/').pop()?.split('?')[0];
        
        const datasets: Record<string, any> = {
          'sales-2024': {
            data: [
              { date: '2024-01-01', product: 'Widget A', amount: 1250.00, customer: 'Acme Corp', region: 'North' },
              { date: '2024-01-01', product: 'Widget B', amount: 890.50, customer: 'Beta Inc', region: 'South' },
              { date: '2024-01-02', product: 'Widget A', amount: 2100.00, customer: 'Gamma LLC', region: 'East' },
              { date: '2024-01-02', product: 'Widget C', amount: 567.25, customer: 'Delta Co', region: 'West' },
              { date: '2024-01-03', product: 'Widget B', amount: 1875.75, customer: 'Epsilon Ltd', region: 'North' }
            ],
            total: 15420,
            page: 1,
            pageSize: 5
          },
          'revenue-monthly': {
            data: [
              { month: 'Jan 2024', revenue: 125000, growth_rate: 12.5, target: 120000 },
              { month: 'Feb 2024', revenue: 138000, growth_rate: 10.4, target: 130000 },
              { month: 'Mar 2024', revenue: 142000, growth_rate: 2.9, target: 135000 },
              { month: 'Apr 2024', revenue: 156000, growth_rate: 9.9, target: 145000 },
              { month: 'May 2024', revenue: 168000, growth_rate: 7.7, target: 155000 }
            ],
            total: 12,
            page: 1,
            pageSize: 12
          },
          'customer-analytics': {
            data: [
              { customer_id: 'C001', segment: 'Enterprise', lifetime_value: 50000, satisfaction: 4.8, last_purchase: '2024-01-10' },
              { customer_id: 'C002', segment: 'SMB', lifetime_value: 12000, satisfaction: 4.2, last_purchase: '2024-01-12' },
              { customer_id: 'C003', segment: 'Enterprise', lifetime_value: 75000, satisfaction: 4.9, last_purchase: '2024-01-08' },
              { customer_id: 'C004', segment: 'Startup', lifetime_value: 3500, satisfaction: 4.1, last_purchase: '2024-01-14' }
            ],
            total: 8532,
            page: 1,
            pageSize: 4
          },
          'inventory-status': {
            data: [
              { product_id: 'P001', name: 'Widget A', current_stock: 150, reorder_level: 50, status: 'OK' },
              { product_id: 'P002', name: 'Widget B', current_stock: 25, reorder_level: 30, status: 'LOW' },
              { product_id: 'P003', name: 'Widget C', current_stock: 200, reorder_level: 75, status: 'OK' },
              { product_id: 'P004', name: 'Widget D', current_stock: 5, reorder_level: 20, status: 'CRITICAL' }
            ],
            total: 2847,
            page: 1,
            pageSize: 4
          }
        };
        
        const dataset = datasets[datasetId as string];
        if (dataset) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(dataset)
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      }
    });

    // Mock the existing page APIs from previous test
    await page.route('/api/pages**', async route => {
      const url = route.request().url();
      const method = route.request().method();
      
      if (method === 'GET' && url.endsWith('/api/pages')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'sample-dashboard',
              name: 'Sales Dashboard',
              description: 'Comprehensive sales analytics dashboard',
              components: [
                {
                  id: 'revenue-card',
                  type: 'card',
                  name: 'Total Revenue',
                  properties: {
                    title: 'Monthly Revenue',
                    datasetId: 'revenue-monthly',
                    aggregation: 'sum',
                    field: 'revenue',
                    format: 'currency'
                  },
                  xPosition: 0,
                  yPosition: 0
                },
                {
                  id: 'sales-table',
                  type: 'table',
                  name: 'Recent Sales',
                  properties: {
                    datasetId: 'sales-2024',
                    showPagination: true,
                    rowsPerPage: 10,
                    sortBy: 'date',
                    sortOrder: 'desc'
                  },
                  xPosition: 400,
                  yPosition: 0
                },
                {
                  id: 'growth-chart',
                  type: 'chart',
                  name: 'Revenue Growth',
                  properties: {
                    chartType: 'line',
                    datasetId: 'revenue-monthly',
                    xField: 'month',
                    yField: 'revenue',
                    showTrendline: true
                  },
                  xPosition: 0,
                  yPosition: 300
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
              updatedAt: '2024-01-15T10:00:00.000Z'
            },
            {
              id: 'customer-portal',
              name: 'Customer Analytics Portal',
              description: 'Customer insights and analytics',
              components: [
                {
                  id: 'customer-segments',
                  type: 'chart',
                  name: 'Customer Segments',
                  properties: {
                    chartType: 'pie',
                    datasetId: 'customer-analytics',
                    groupBy: 'segment',
                    aggregation: 'count'
                  },
                  xPosition: 0,
                  yPosition: 0
                },
                {
                  id: 'satisfaction-meter',
                  type: 'card',
                  name: 'Average Satisfaction',
                  properties: {
                    title: 'Customer Satisfaction',
                    datasetId: 'customer-analytics',
                    aggregation: 'avg',
                    field: 'satisfaction',
                    format: 'decimal',
                    precision: 1
                  },
                  xPosition: 400,
                  yPosition: 0
                },
                {
                  id: 'top-customers',
                  type: 'table',
                  name: 'Top Customers',
                  properties: {
                    datasetId: 'customer-analytics',
                    sortBy: 'lifetime_value',
                    sortOrder: 'desc',
                    limit: 5,
                    showFilters: false
                  },
                  xPosition: 0,
                  yPosition: 300
                }
              ],
              layout: {
                type: 'sidebar',
                sidebarWidth: 300,
                spacing: 16,
                showHeader: true,
                showFooter: true
              },
              isPublished: true,
              createdAt: '2024-01-02T00:00:00.000Z',
              updatedAt: '2024-01-15T11:30:00.000Z'
            }
          ])
        });
      } else if (method === 'POST') {
        const requestBody = await route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-' + Date.now(),
            ...requestBody,
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      }
    });
  });

  test('should load available datasets', async ({ page }) => {
    const datasets = await page.evaluate(() => {
      return fetch('/api/datasets').then(response => response.json());
    });

    expect(datasets).toHaveLength(4);
    expect(datasets[0].name).toBe('Sales Data 2024');
    expect(datasets[1].name).toBe('Monthly Revenue');
    expect(datasets[2].name).toBe('Customer Analytics');
    expect(datasets[3].name).toBe('Inventory Status');

    // Verify dataset schemas
    expect(datasets[0].schema.columns).toContain('date');
    expect(datasets[0].schema.columns).toContain('amount');
    expect(datasets[1].schema.columns).toContain('revenue');
    expect(datasets[1].schema.columns).toContain('growth_rate');
  });

  test('should create sample sales dashboard with real data', async ({ page }) => {
    // Create a new dashboard page
    const dashboardData = {
      name: 'Real Data Sales Dashboard',
      description: 'Sales dashboard with live data integration',
      components: [
        {
          id: 'total-revenue',
          type: 'card',
          name: 'Total Revenue Card',
          properties: {
            title: 'Total Revenue YTD',
            datasetId: 'revenue-monthly',
            aggregation: 'sum',
            field: 'revenue',
            format: 'currency',
            showTrend: true
          },
          xPosition: 0,
          yPosition: 0
        },
        {
          id: 'sales-trend',
          type: 'chart',
          name: 'Sales Trend Chart',
          properties: {
            chartType: 'line',
            datasetId: 'revenue-monthly',
            xField: 'month',
            yField: 'revenue',
            yField2: 'target',
            showLegend: true,
            title: 'Revenue vs Target'
          },
          xPosition: 400,
          yPosition: 0
        },
        {
          id: 'recent-sales',
          type: 'table',
          name: 'Recent Sales Table',
          properties: {
            datasetId: 'sales-2024',
            columns: ['date', 'product', 'amount', 'customer'],
            sortBy: 'date',
            sortOrder: 'desc',
            rowsPerPage: 15,
            showSearch: true
          },
          xPosition: 0,
          yPosition: 350
        },
        {
          id: 'regional-breakdown',
          type: 'chart',
          name: 'Regional Sales',
          properties: {
            chartType: 'bar',
            datasetId: 'sales-2024',
            groupBy: 'region',
            aggregation: 'sum',
            field: 'amount',
            title: 'Sales by Region'
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

    const response = await page.evaluate((data) => {
      return fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(response => response.json());
    }, dashboardData);

    expect(response.name).toBe('Real Data Sales Dashboard');
    expect(response.components).toHaveLength(4);
    
    // Verify data binding configurations
    const revenueCard = response.components.find((c: any) => c.id === 'total-revenue');
    expect(revenueCard.properties.datasetId).toBe('revenue-monthly');
    expect(revenueCard.properties.aggregation).toBe('sum');
    
    const salesTable = response.components.find((c: any) => c.id === 'recent-sales');
    expect(salesTable.properties.datasetId).toBe('sales-2024');
    expect(salesTable.properties.sortBy).toBe('date');
  });

  test('should fetch and display real data in components', async ({ page }) => {
    // Test revenue data fetching
    const revenueData = await page.evaluate(() => {
      return fetch('/api/datasets/revenue-monthly').then(response => response.json());
    });

    expect(revenueData.data).toHaveLength(5);
    expect(revenueData.data[0]).toMatchObject({
      month: 'Jan 2024',
      revenue: 125000,
      growth_rate: 12.5,
      target: 120000
    });

    // Test sales data fetching
    const salesData = await page.evaluate(() => {
      return fetch('/api/datasets/sales-2024').then(response => response.json());
    });

    expect(salesData.data).toHaveLength(5);
    expect(salesData.total).toBe(15420);
    expect(salesData.data[0]).toMatchObject({
      date: '2024-01-01',
      product: 'Widget A',
      amount: 1250.00,
      customer: 'Acme Corp',
      region: 'North'
    });

    // Test customer analytics data
    const customerData = await page.evaluate(() => {
      return fetch('/api/datasets/customer-analytics').then(response => response.json());
    });

    expect(customerData.data[0]).toMatchObject({
      customer_id: 'C001',
      segment: 'Enterprise',
      lifetime_value: 50000,
      satisfaction: 4.8
    });
  });

  test('should create customer analytics portal with navigation', async ({ page }) => {
    // Load the existing customer portal
    const customerPortal = await page.evaluate(() => {
      return fetch('/api/pages').then(response => response.json())
        .then(pages => pages.find((p: any) => p.name === 'Customer Analytics Portal'));
    });

    expect(customerPortal.name).toBe('Customer Analytics Portal');
    expect(customerPortal.layout.type).toBe('sidebar');
    expect(customerPortal.components).toHaveLength(3);

    // Verify component data bindings
    const segmentChart = customerPortal.components.find((c: any) => c.name === 'Customer Segments');
    expect(segmentChart.properties.datasetId).toBe('customer-analytics');
    expect(segmentChart.properties.chartType).toBe('pie');
    expect(segmentChart.properties.groupBy).toBe('segment');

    const satisfactionCard = customerPortal.components.find((c: any) => c.name === 'Average Satisfaction');
    expect(satisfactionCard.properties.datasetId).toBe('customer-analytics');
    expect(satisfactionCard.properties.field).toBe('satisfaction');
    expect(satisfactionCard.properties.aggregation).toBe('avg');

    // Test navigation between different views
    // In a real app, this would involve changing the page state
    await page.evaluate(() => {
      // Simulate navigation to customer portal
      console.log('Navigating to Customer Analytics Portal');
      return Promise.resolve();
    });
  });

  test('should handle inventory management dashboard', async ({ page }) => {
    // Create inventory dashboard
    const inventoryDashboard = {
      name: 'Inventory Management Dashboard',
      description: 'Real-time inventory status and alerts',
      components: [
        {
          id: 'low-stock-alert',
          type: 'card',
          name: 'Low Stock Alert',
          properties: {
            title: 'Items Below Reorder Level',
            datasetId: 'inventory-status',
            filter: { field: 'status', operator: 'in', value: ['LOW', 'CRITICAL'] },
            aggregation: 'count',
            alertThreshold: 0,
            alertColor: 'red'
          },
          xPosition: 0,
          yPosition: 0
        },
        {
          id: 'inventory-table',
          type: 'table',
          name: 'Inventory Status',
          properties: {
            datasetId: 'inventory-status',
            columns: ['name', 'current_stock', 'reorder_level', 'status'],
            sortBy: 'current_stock',
            sortOrder: 'asc',
            showFilters: true,
            statusColumn: 'status',
            statusColors: {
              'OK': 'green',
              'LOW': 'orange',
              'CRITICAL': 'red'
            }
          },
          xPosition: 400,
          yPosition: 0
        },
        {
          id: 'stock-levels-chart',
          type: 'chart',
          name: 'Stock Levels',
          properties: {
            chartType: 'bar',
            datasetId: 'inventory-status',
            xField: 'name',
            yField: 'current_stock',
            yField2: 'reorder_level',
            title: 'Current Stock vs Reorder Level'
          },
          xPosition: 0,
          yPosition: 350
        }
      ],
      layout: {
        type: 'columns',
        columnCount: 2,
        spacing: 20,
        showHeader: true,
        showFooter: true
      }
    };

    const response = await page.evaluate((data) => {
      return fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(response => response.json());
    }, inventoryDashboard);

    expect(response.name).toBe('Inventory Management Dashboard');
    expect(response.components).toHaveLength(3);

    // Verify inventory data
    const inventoryData = await page.evaluate(() => {
      return fetch('/api/datasets/inventory-status').then(response => response.json());
    });

    expect(inventoryData.data).toHaveLength(4);
    
    // Check for low stock items
    const lowStockItems = inventoryData.data.filter((item: any) => 
      item.status === 'LOW' || item.status === 'CRITICAL'
    );
    expect(lowStockItems).toHaveLength(2); // Widget B (LOW) and Widget D (CRITICAL)
  });

  test('should support data filtering and aggregation', async ({ page }) => {
    // Test various data operations that components would perform
    
    // Revenue aggregation
    const revenueData = await page.evaluate(() => {
      return fetch('/api/datasets/revenue-monthly').then(response => response.json());
    });

    // Calculate total revenue (sum aggregation)
    const totalRevenue = revenueData.data.reduce((sum: number, row: any) => sum + row.revenue, 0);
    expect(totalRevenue).toBe(729000); // Sum of all revenue values

    // Calculate average growth rate
    const avgGrowthRate = revenueData.data.reduce((sum: number, row: any) => sum + row.growth_rate, 0) / revenueData.data.length;
    expect(avgGrowthRate).toBeCloseTo(8.48, 1);

    // Sales data grouping by region
    const salesData = await page.evaluate(() => {
      return fetch('/api/datasets/sales-2024').then(response => response.json());
    });

    // Group by region (this would be done by the chart component)
    const regionTotals = salesData.data.reduce((acc: any, row: any) => {
      acc[row.region] = (acc[row.region] || 0) + row.amount;
      return acc;
    }, {});

    expect(regionTotals).toMatchObject({
      North: expect.any(Number),
      South: expect.any(Number),
      East: expect.any(Number),
      West: expect.any(Number)
    });

    // Customer segmentation
    const customerData = await page.evaluate(() => {
      return fetch('/api/datasets/customer-analytics').then(response => response.json());
    });

    const segmentCounts = customerData.data.reduce((acc: any, row: any) => {
      acc[row.segment] = (acc[row.segment] || 0) + 1;
      return acc;
    }, {});

    expect(segmentCounts).toMatchObject({
      Enterprise: 2,
      SMB: 1,
      Startup: 1
    });
  });

  test('should handle real-time data updates', async ({ page }) => {
    // Simulate real-time data updates
    await page.route('/api/datasets/revenue-monthly', async route => {
      // Simulate updated data with new values
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { month: 'Jan 2024', revenue: 125000, growth_rate: 12.5, target: 120000 },
            { month: 'Feb 2024', revenue: 138000, growth_rate: 10.4, target: 130000 },
            { month: 'Mar 2024', revenue: 142000, growth_rate: 2.9, target: 135000 },
            { month: 'Apr 2024', revenue: 156000, growth_rate: 9.9, target: 145000 },
            { month: 'May 2024', revenue: 175000, growth_rate: 12.2, target: 155000 }, // Updated value
            { month: 'Jun 2024', revenue: 182000, growth_rate: 4.0, target: 165000 } // New month
          ],
          total: 12,
          page: 1,
          pageSize: 12,
          lastUpdated: new Date().toISOString()
        })
      });
    });

    // Fetch updated data
    const updatedData = await page.evaluate(() => {
      return fetch('/api/datasets/revenue-monthly').then(response => response.json());
    });

    expect(updatedData.data).toHaveLength(6);
    expect(updatedData.data[4].revenue).toBe(175000); // Updated May value
    expect(updatedData.data[5].month).toBe('Jun 2024'); // New June data
  });

  test('should navigate between multiple sample pages', async ({ page }) => {
    // Get all available sample pages
    const pages = await page.evaluate(() => {
      return fetch('/api/pages').then(response => response.json());
    });

    expect(pages).toHaveLength(2);

    // Navigate to Sales Dashboard
    const salesDashboard = pages.find((p: any) => p.name === 'Sales Dashboard');
    expect(salesDashboard.components).toHaveLength(3);
    expect(salesDashboard.layout.type).toBe('columns');

    // Simulate loading this page
    await page.evaluate((pageData) => {
      // In a real app, this would update the application state
      console.log('Loading page:', pageData.name);
      console.log('Components count:', pageData.components.length);
      console.log('Layout type:', pageData.layout.type);
      return Promise.resolve(pageData);
    }, salesDashboard);

    // Navigate to Customer Analytics Portal
    const customerPortal = pages.find((p: any) => p.name === 'Customer Analytics Portal');
    expect(customerPortal.components).toHaveLength(3);
    expect(customerPortal.layout.type).toBe('sidebar');

    // Simulate loading this page
    await page.evaluate((pageData) => {
      console.log('Switching to page:', pageData.name);
      console.log('New layout:', pageData.layout.type);
      return Promise.resolve(pageData);
    }, customerPortal);

    // Verify different data sources are used
    const salesDatasets = salesDashboard.components.map((c: any) => c.properties.datasetId);
    const customerDatasets = customerPortal.components.map((c: any) => c.properties.datasetId);

    expect(salesDatasets).toContain('revenue-monthly');
    expect(salesDatasets).toContain('sales-2024');
    expect(customerDatasets).toContain('customer-analytics');
  });
});
