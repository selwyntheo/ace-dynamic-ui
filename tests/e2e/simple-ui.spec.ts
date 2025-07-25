import { test, expect } from '@playwright/test';

test.describe('Simple Dynamic UI - Basic Component Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the application to load
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
  });

  test('should display the main application interface', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
    
    // Check builder/preview toggle buttons
    await expect(page.getByRole('button', { name: /builder/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /preview/i })).toBeVisible();
    
    // Check component panel
    await expect(page.getByText('Components')).toBeVisible();
    
    // Check canvas area
    await expect(page.getByText('Start Building Your App')).toBeVisible();
  });

  test('should toggle between builder and preview modes', async ({ page }) => {
    // Initially in builder mode
    await expect(page.getByRole('button', { name: /builder/i })).toHaveClass(/bg-blue-100/);
    
    // Switch to preview mode
    await page.getByRole('button', { name: /preview/i }).click();
    await expect(page.getByRole('button', { name: /preview/i })).toHaveClass(/bg-green-100/);
    
    // Component panel should be hidden in preview mode
    await expect(page.getByText('Components')).not.toBeVisible();
    
    // Switch back to builder mode
    await page.getByRole('button', { name: /builder/i }).click();
    await expect(page.getByRole('button', { name: /builder/i })).toHaveClass(/bg-blue-100/);
    await expect(page.getByText('Components')).toBeVisible();
  });

  test('should show component count in header', async ({ page }) => {
    await expect(page.getByText('0 components')).toBeVisible();
  });

  test('should display available component types in panel', async ({ page }) => {
    // Check all component types are visible
    await expect(page.getByText('Table')).toBeVisible();
    await expect(page.getByText('Form')).toBeVisible();
    await expect(page.getByText('Chart')).toBeVisible();
    await expect(page.getByText('Button')).toBeVisible();
    await expect(page.getByText('Text')).toBeVisible();
    await expect(page.getByText('Card')).toBeVisible();
  });

  test('should drag and drop a table component to canvas', async ({ page }) => {
    const tableComponent = page.getByText('Table').locator('..');
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Perform drag and drop
    await tableComponent.dragTo(canvas);
    
    // Check that component count increased
    await expect(page.getByText('1 component')).toBeVisible();
    
    // Check that the empty state is gone
    await expect(page.getByText('Start Building Your App')).not.toBeVisible();
    
    // Check that a table component is rendered
    await expect(page.getByText('Table 1')).toBeVisible();
    await expect(page.getByText('Table Component')).toBeVisible();
  });

  test('should drag and drop a button component to canvas', async ({ page }) => {
    const buttonComponent = page.getByText('Button').locator('..');
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Perform drag and drop
    await buttonComponent.dragTo(canvas);
    
    // Check that component count increased
    await expect(page.getByText('1 component')).toBeVisible();
    
    // Check that a button component is rendered
    await expect(page.getByRole('button', { name: 'Button 1' })).toBeVisible();
  });

  test('should drag and drop multiple components to canvas', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add table component
    await page.getByText('Table').locator('..').dragTo(canvas);
    await expect(page.getByText('1 component')).toBeVisible();
    
    // Add button component
    await page.getByText('Button').locator('..').dragTo(canvas);
    await expect(page.getByText('2 components')).toBeVisible();
    
    // Add text component
    await page.getByText('Text').locator('..').dragTo(canvas);
    await expect(page.getByText('3 components')).toBeVisible();
    
    // Verify all components are rendered
    await expect(page.getByText('Table 1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Button 2' })).toBeVisible();
    await expect(page.getByText('Text 3')).toBeVisible();
  });

  test('should show hover effects on components', async ({ page }) => {
    const tableComponent = page.getByText('Table').locator('..');
    
    // Check hover effect
    await tableComponent.hover();
    await expect(tableComponent).toHaveClass(/hover:scale-105/);
  });

  test('should maintain component state when switching modes', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a component in builder mode
    await page.getByText('Button').locator('..').dragTo(canvas);
    await expect(page.getByText('1 component')).toBeVisible();
    
    // Switch to preview mode
    await page.getByRole('button', { name: /preview/i }).click();
    await expect(page.getByText('1 component')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Button 1' })).toBeVisible();
    
    // Switch back to builder mode
    await page.getByRole('button', { name: /builder/i }).click();
    await expect(page.getByText('1 component')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Button 1' })).toBeVisible();
  });
});
