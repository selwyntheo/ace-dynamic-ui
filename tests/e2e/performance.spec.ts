import { test, expect } from '@playwright/test';

test.describe('Performance & Stress Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
  });

  test('should handle large number of components efficiently', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Measure initial load time
    const startTime = Date.now();
    
    // Add 50 components (stress test)
    for (let i = 0; i < 50; i++) {
      const componentType = i % 6; // Cycle through component types
      let componentName;
      
      switch (componentType) {
        case 0:
          componentName = 'Table';
          break;
        case 1:
          componentName = 'Button';
          break;
        case 2:
          componentName = 'Text';
          break;
        case 3:
          componentName = 'Form';
          break;
        case 4:
          componentName = 'Chart';
          break;
        case 5:
          componentName = 'Card';
          break;
        default:
          componentName = 'Button';
      }
      
      await page.getByText(componentName).locator('..').dragTo(canvas);
      
      // Every 10 components, check performance
      if ((i + 1) % 10 === 0) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        console.log(`Added ${i + 1} components in ${elapsed}ms`);
        
        // Verify app remains responsive
        await expect(page.getByText(`${i + 1} components`)).toBeVisible();
        
        // Check that the page is still responsive
        await page.getByRole('button', { name: /builder/i }).hover();
      }
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`Total time to add 50 components: ${totalTime}ms`);
    
    // Verify all components are present
    await expect(page.getByText('50 components')).toBeVisible();
    
    // Test switching to preview mode with many components
    const previewStartTime = Date.now();
    await page.getByRole('button', { name: /preview/i }).click();
    const previewEndTime = Date.now();
    
    console.log(`Preview mode switch time: ${previewEndTime - previewStartTime}ms`);
    
    // Verify preview mode loaded successfully
    await expect(page.getByText('50 components')).toBeVisible();
    
    // Performance assertion: should complete within reasonable time
    expect(totalTime).toBeLessThan(30000); // 30 seconds max
    expect(previewEndTime - previewStartTime).toBeLessThan(5000); // 5 seconds max for mode switch
  });

  test('should handle rapid component creation and deletion', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Rapidly add and configure components
    for (let i = 0; i < 20; i++) {
      // Add button
      await page.getByText('Button').locator('..').dragTo(canvas);
      
      // Configure it
      await page.getByRole('button', { name: `Button ${i + 1}` }).click();
      await page.getByLabel('Component Name').fill(`Dynamic Button ${i + 1}`);
      await page.getByLabel('Button Style').selectOption('primary');
      await page.getByRole('button', { name: '×' }).click();
      
      // Verify it's created
      await expect(page.getByRole('button', { name: `Dynamic Button ${i + 1}` })).toBeVisible();
    }
    
    await expect(page.getByText('20 components')).toBeVisible();
    
    // Test rapid mode switching
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: /preview/i }).click();
      await page.getByRole('button', { name: /builder/i }).click();
    }
    
    // Verify app remains stable
    await expect(page.getByText('20 components')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dynamic Button 1' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dynamic Button 20' })).toBeVisible();
  });

  test('should handle concurrent property panel operations', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add multiple components
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByText('Text').locator('..').dragTo(canvas);
    await page.getByText('Form').locator('..').dragTo(canvas);
    
    // Rapidly switch between components and modify properties
    for (let i = 0; i < 10; i++) {
      // Configure table
      await page.getByText('Table 1').click();
      await page.getByLabel('Page Size').fill(`${10 + i}`);
      await page.getByRole('button', { name: '×' }).click();
      
      // Configure button
      await page.getByRole('button', { name: 'Button 2' }).click();
      await page.getByLabel('Button Style').selectOption(i % 2 === 0 ? 'primary' : 'secondary');
      await page.getByRole('button', { name: '×' }).click();
      
      // Configure text
      await page.getByText('Text 3').click();
      await page.getByLabel('Text Content').fill(`Dynamic text ${i}`);
      await page.getByRole('button', { name: '×' }).click();
    }
    
    // Verify final configurations
    await page.getByText('Table 1').click();
    await expect(page.getByLabel('Page Size')).toHaveValue('19');
    await page.getByRole('button', { name: '×' }).click();
  });

  test('should handle memory usage with complex layouts', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Create a complex nested layout
    for (let i = 0; i < 5; i++) {
      // Add container card
      await page.getByText('Card').locator('..').dragTo(canvas);
      await page.getByText(`Card ${i * 4 + 1}`).click();
      await page.getByLabel('Component Name').fill(`Container ${i + 1}`);
      await page.getByLabel('Width').fill('800');
      await page.getByLabel('Height').fill('600');
      await page.getByRole('button', { name: '×' }).click();
      
      // Add table inside
      await page.getByText('Table').locator('..').dragTo(canvas);
      await page.getByText(`Table ${i * 4 + 2}`).click();
      await page.getByLabel('Component Name').fill(`Data Table ${i + 1}`);
      await page.getByLabel('Page Size').fill('100');
      await page.getByRole('button', { name: '×' }).click();
      
      // Add form inside
      await page.getByText('Form').locator('..').dragTo(canvas);
      await page.getByText(`Form ${i * 4 + 3}`).click();
      await page.getByLabel('Component Name').fill(`Input Form ${i + 1}`);
      await page.getByRole('button', { name: '×' }).click();
      
      // Add chart inside
      await page.getByText('Chart').locator('..').dragTo(canvas);
      await page.getByText(`Chart ${i * 4 + 4}`).click();
      await page.getByLabel('Component Name').fill(`Analytics Chart ${i + 1}`);
      await page.getByRole('button', { name: '×' }).click();
    }
    
    await expect(page.getByText('20 components')).toBeVisible();
    
    // Test scrolling performance
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    
    // Test viewport changes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    await page.setViewportSize({ width: 1400, height: 900 });
    
    // Verify app remains responsive
    await expect(page.getByText('Container 1')).toBeVisible();
    await expect(page.getByText('Analytics Chart 5')).toBeVisible();
  });

  test('should maintain performance during API stress testing', async ({ page, request }) => {
    // Create multiple datasets rapidly
    const datasetPromises: Promise<any>[] = [];
    for (let i = 0; i < 10; i++) {
      const dataset = {
        name: `Stress Test Dataset ${i}`,
        description: `Dataset for stress testing ${i}`,
        columns: {
          id: 'number',
          name: 'string',
          value: 'number'
        }
      };
      
      datasetPromises.push(
        request.post('http://localhost:8080/api/datasets', { data: dataset })
      );
    }
    
    const datasetResponses = await Promise.all(datasetPromises);
    
    // Verify all datasets were created
    datasetResponses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // Create components that reference these datasets
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    for (let i = 0; i < 10; i++) {
      await page.getByText('Table').locator('..').dragTo(canvas);
      await page.getByText(`Table ${i + 1}`).click();
      await page.getByLabel('Component Name').fill(`Dataset Table ${i + 1}`);
      await page.getByRole('button', { name: '×' }).click();
    }
    
    // Test rapid API calls
    const apiPromises: Promise<any>[] = [];
    for (let i = 0; i < 20; i++) {
      apiPromises.push(request.get('http://localhost:8080/api/datasets'));
    }
    
    const apiResponses = await Promise.all(apiPromises);
    apiResponses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // Verify UI remains responsive
    await expect(page.getByText('10 components')).toBeVisible();
    
    // Cleanup: Delete datasets
    const allDatasets = await request.get('http://localhost:8080/api/datasets');
    const datasetList = await allDatasets.json();
    
    const deletePromises = datasetList
      .filter((d: any) => d.name.includes('Stress Test'))
      .map((d: any) => request.delete(`http://localhost:8080/api/datasets/${d.id}`));
    
    await Promise.all(deletePromises);
  });

  test('should handle browser resource constraints', async ({ page }) => {
    // Simulate low-resource environment by adding many components
    // and testing various interactions
    
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add many components with complex configurations
    for (let i = 0; i < 30; i++) {
      await page.getByText('Table').locator('..').dragTo(canvas);
      
      // Configure with complex properties
      await page.getByText(`Table ${i + 1}`).click();
      await page.getByLabel('Component Name').fill(`Complex Table ${i + 1} with very long name that might cause layout issues`);
      await page.getByLabel('Page Size').fill('100');
      await page.getByLabel('Show Pagination').check();
      await page.getByLabel('Show Search').check();
      await page.getByRole('button', { name: '×' }).click();
    }
    
    // Test interactions under load
    await page.getByRole('button', { name: /preview/i }).click();
    await page.getByRole('button', { name: /builder/i }).click();
    
    // Test scrolling with many components
    await page.evaluate(() => {
      for (let i = 0; i < 100; i++) {
        window.scrollBy(0, 10);
      }
    });
    
    // Test component interactions
    await page.getByText('Complex Table 1 with very long name that might cause layout issues').click();
    await expect(page.getByText('Properties')).toBeVisible();
    await page.getByRole('button', { name: '×' }).click();
    
    // Verify app is still functional
    await expect(page.getByText('30 components')).toBeVisible();
  });
});
