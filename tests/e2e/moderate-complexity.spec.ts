import { test, expect } from '@playwright/test';

test.describe('Moderate Complexity - Component Configuration & Properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
  });

  test('should open properties panel when clicking on a component', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a table component
    await page.getByText('Table').locator('..').dragTo(canvas);
    
    // Click on the table component
    await page.getByText('Table 1').click();
    
    // Properties panel should open
    await expect(page.getByText('Properties')).toBeVisible();
    await expect(page.getByText('General')).toBeVisible();
    await expect(page.getByText('Component Name')).toBeVisible();
    await expect(page.getByText('Component Type')).toBeVisible();
  });

  test('should configure table component properties', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a table component
    await page.getByText('Table').locator('..').dragTo(canvas);
    
    // Click on the table component to open properties
    await page.getByText('Table 1').click();
    
    // Verify table-specific properties are visible
    await expect(page.getByText('Show Pagination')).toBeVisible();
    await expect(page.getByText('Show Search')).toBeVisible();
    await expect(page.getByText('Page Size')).toBeVisible();
    
    // Change component name
    await page.getByLabel('Component Name').fill('User Data Table');
    
    // Toggle pagination off
    await page.getByLabel('Show Pagination').uncheck();
    
    // Change page size
    await page.getByLabel('Page Size').fill('25');
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
    
    // Verify changes are reflected
    await expect(page.getByText('User Data Table')).toBeVisible();
  });

  test('should configure button component properties', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a button component
    await page.getByText('Button').locator('..').dragTo(canvas);
    
    // Click on the button component to open properties
    await page.getByRole('button', { name: 'Button 1' }).click();
    
    // Verify button-specific properties are visible
    await expect(page.getByText('Button Style')).toBeVisible();
    await expect(page.getByText('Size')).toBeVisible();
    
    // Change component name
    await page.getByLabel('Component Name').fill('Submit Button');
    
    // Change button style
    await page.getByLabel('Button Style').selectOption('success');
    
    // Change size
    await page.getByLabel('Size').selectOption('large');
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
    
    // Verify changes are reflected
    await expect(page.getByRole('button', { name: 'Submit Button' })).toBeVisible();
  });

  test('should configure text component properties', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a text component
    await page.getByText('Text').locator('..').dragTo(canvas);
    
    // Click on the text component to open properties
    await page.getByText('Text 1').click();
    
    // Verify text-specific properties are visible
    await expect(page.getByText('Text Content')).toBeVisible();
    await expect(page.getByText('Font Size')).toBeVisible();
    
    // Change component name
    await page.getByLabel('Component Name').fill('Welcome Header');
    
    // Change text content
    await page.getByLabel('Text Content').fill('Welcome to our Dynamic UI Builder!');
    
    // Change font size
    await page.getByLabel('Font Size').selectOption('text-xl');
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
    
    // Verify changes are reflected
    await expect(page.getByText('Welcome Header')).toBeVisible();
  });

  test('should configure component layout properties', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a component
    await page.getByText('Card').locator('..').dragTo(canvas);
    
    // Click on the component to open properties
    await page.getByText('Card 1').click();
    
    // Verify layout properties are visible
    await expect(page.getByText('Layout')).toBeVisible();
    await expect(page.getByLabel('Width')).toBeVisible();
    await expect(page.getByLabel('Height')).toBeVisible();
    
    // Set width and height
    await page.getByLabel('Width').fill('600');
    await page.getByLabel('Height').fill('300');
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
  });

  test('should create a multi-component dashboard layout', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Create a header text
    await page.getByText('Text').locator('..').dragTo(canvas);
    await page.getByText('Text 1').click();
    await page.getByLabel('Component Name').fill('Dashboard Title');
    await page.getByLabel('Text Content').fill('Sales Dashboard');
    await page.getByLabel('Font Size').selectOption('text-xl');
    await page.getByRole('button', { name: '×' }).click();
    
    // Add a data table
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Table 2').click();
    await page.getByLabel('Component Name').fill('Sales Data');
    await page.getByLabel('Page Size').fill('15');
    await page.getByRole('button', { name: '×' }).click();
    
    // Add action buttons
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByRole('button', { name: 'Button 3' }).click();
    await page.getByLabel('Component Name').fill('Export Data');
    await page.getByLabel('Button Style').selectOption('primary');
    await page.getByRole('button', { name: '×' }).click();
    
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByRole('button', { name: 'Button 4' }).click();
    await page.getByLabel('Component Name').fill('Refresh');
    await page.getByLabel('Button Style').selectOption('secondary');
    await page.getByRole('button', { name: '×' }).click();
    
    // Add a chart component
    await page.getByText('Chart').locator('..').dragTo(canvas);
    
    // Verify all components are present
    await expect(page.getByText('5 components')).toBeVisible();
    await expect(page.getByText('Dashboard Title')).toBeVisible();
    await expect(page.getByText('Sales Data')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export Data' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    await expect(page.getByText('Chart 5')).toBeVisible();
  });

  test('should persist component configurations in preview mode', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Create and configure a component
    await page.getByText('Text').locator('..').dragTo(canvas);
    await page.getByText('Text 1').click();
    await page.getByLabel('Component Name').fill('Configured Text');
    await page.getByLabel('Text Content').fill('This text was configured!');
    await page.getByRole('button', { name: '×' }).click();
    
    // Switch to preview mode
    await page.getByRole('button', { name: /preview/i }).click();
    
    // Verify configuration persists
    await expect(page.getByText('Configured Text')).toBeVisible();
    
    // Switch back to builder mode
    await page.getByRole('button', { name: /builder/i }).click();
    
    // Verify configuration still persists
    await expect(page.getByText('Configured Text')).toBeVisible();
  });

  test('should handle component selection and deselection', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add multiple components
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByText('Text').locator('..').dragTo(canvas);
    
    // Select first component
    await page.getByRole('button', { name: 'Button 1' }).click();
    await expect(page.getByText('Properties')).toBeVisible();
    
    // Select second component
    await page.getByText('Text 2').click();
    await expect(page.getByText('Properties')).toBeVisible();
    await expect(page.getByText('Text Content')).toBeVisible();
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
    await expect(page.getByText('Properties')).not.toBeVisible();
  });

  test('should show component type indicators on hover', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add different types of components
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByText('Form').locator('..').dragTo(canvas);
    
    // Hover over table component and check type indicator
    await page.getByText('Table 1').hover();
    await expect(page.getByText('table')).toBeVisible();
    
    // Hover over button component and check type indicator
    await page.getByRole('button', { name: 'Button 2' }).hover();
    await expect(page.getByText('button')).toBeVisible();
    
    // Hover over form component and check type indicator
    await page.getByText('Form 3').hover();
    await expect(page.getByText('form')).toBeVisible();
  });
});
