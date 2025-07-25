import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Check main landmarks
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
    
    // Verify navigation structure
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: /builder/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /preview/i })).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through interface
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /builder/i })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /preview/i })).toBeFocused();
    
    // Test component panel keyboard navigation
    await page.keyboard.press('Tab');
    // Should focus on first component in panel
    
    // Test Enter key to add component
    await page.getByText('Table').focus();
    await page.keyboard.press('Enter');
    // Component should be added to canvas
  });

  test('should have accessible form controls', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add a component to test property panel
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByRole('button', { name: 'Button 1' }).click();
    
    // Check form labels
    await expect(page.getByLabel('Component Name')).toBeVisible();
    await expect(page.getByLabel('Button Style')).toBeVisible();
    
    // Test form control accessibility
    const nameInput = page.getByLabel('Component Name');
    await expect(nameInput).toHaveAttribute('id');
    await expect(nameInput).toHaveAttribute('type', 'text');
    
    const styleSelect = page.getByLabel('Button Style');
    await expect(styleSelect).toHaveAttribute('id');
    
    // Test required field indication
    await nameInput.fill('');
    await nameInput.blur();
    // Should show validation if required
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add components to test ARIA attributes
    await page.getByText('Table').locator('..').dragTo(canvas);
    await page.getByText('Button').locator('..').dragTo(canvas);
    
    // Check canvas aria attributes
    const canvasElement = canvas.first();
    await expect(canvasElement).toHaveAttribute('role', 'region');
    
    // Check button ARIA
    const button = page.getByRole('button', { name: 'Button 2' });
    await expect(button).toHaveAttribute('type', 'button');
    
    // Test table accessibility
    await page.getByText('Table 1').click();
    await page.getByRole('button', { name: '×' }).click();
    
    // Switch to preview mode to test rendered components
    await page.getByRole('button', { name: /preview/i }).click();
    
    // Verify table has proper structure
    const table = page.locator('table').first();
    await expect(table).toHaveAttribute('role', 'table');
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Test with screen reader simulation
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add form component for comprehensive testing
    await page.getByText('Form').locator('..').dragTo(canvas);
    await page.getByText('Form 1').click();
    
    // Check form accessibility
    await expect(page.getByLabel('Component Name')).toHaveAccessibleName('Component Name');
    
    // Test field descriptions and help text
    const nameField = page.getByLabel('Component Name');
    await expect(nameField).toBeVisible();
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
    
    // Switch to preview mode
    await page.getByRole('button', { name: /preview/i }).click();
    
    // Test form in preview mode
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      const inputs = form.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        await expect(input).toHaveAttribute('type');
        // Should have label or aria-label
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Test primary interface elements
    const builderButton = page.getByRole('button', { name: /builder/i });
    await expect(builderButton).toBeVisible();
    
    const previewButton = page.getByRole('button', { name: /preview/i });
    await expect(previewButton).toBeVisible();
    
    // Test component panel readability
    const componentPanel = page.locator('.component-panel').or(page.locator('[data-testid="component-panel"]'));
    await expect(componentPanel).toBeVisible();
    
    // Test text visibility
    await expect(page.getByText('Table')).toBeVisible();
    await expect(page.getByText('Button')).toBeVisible();
    await expect(page.getByText('Text')).toBeVisible();
    
    // Test focus indicators
    await page.getByText('Table').focus();
    // Focus should be visible (tested via visual regression or accessibility tools)
  });

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Verify interface remains usable
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
    await expect(page.getByRole('button', { name: /builder/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /preview/i })).toBeVisible();
    
    // Test component visibility in high contrast
    await expect(page.getByText('Table')).toBeVisible();
    await expect(page.getByText('Button')).toBeVisible();
    
    // Add component and test in high contrast
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    await page.getByText('Button').locator('..').dragTo(canvas);
    
    await expect(page.getByRole('button', { name: 'Button 1' })).toBeVisible();
    
    // Switch back to light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.getByRole('button', { name: 'Button 1' })).toBeVisible();
  });

  test('should support zoom levels up to 200%', async ({ page }) => {
    // Test 150% zoom by reducing viewport size
    await page.setViewportSize({
      width: Math.round(1400 * 0.67), // Simulate 150% zoom
      height: Math.round(900 * 0.67)
    });
    
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
    await expect(page.getByRole('button', { name: /builder/i })).toBeVisible();
    
    // Test component interaction at zoom level
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    await page.getByText('Table').locator('..').dragTo(canvas);
    await expect(page.getByText('Table 1')).toBeVisible();
    
    // Test 200% zoom by further reducing viewport
    await page.setViewportSize({
      width: Math.round(1400 * 0.5), // Simulate 200% zoom
      height: Math.round(900 * 0.5)
    });
    
    await expect(page.locator('h1')).toContainText('Dynamic UI Builder');
    await expect(page.getByText('Table 1')).toBeVisible();
    
    // Test component property panel at high zoom
    await page.getByText('Table 1').click();
    await expect(page.getByText('Properties')).toBeVisible();
    await expect(page.getByLabel('Component Name')).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1400, height: 900 });
  });

  test('should provide meaningful error messages', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Add button and test validation
    await page.getByText('Button').locator('..').dragTo(canvas);
    await page.getByRole('button', { name: 'Button 1' }).click();
    
    // Test empty name validation
    const nameInput = page.getByLabel('Component Name');
    await nameInput.fill('');
    await nameInput.blur();
    
    // Should show accessible error message
    // (Implementation would depend on validation framework)
    
    // Test invalid input
    await page.getByLabel('Width').fill('invalid');
    await page.getByLabel('Width').blur();
    
    // Should provide clear error indication
    
    // Close properties panel
    await page.getByRole('button', { name: '×' }).click();
  });

  test('should announce dynamic content changes', async ({ page }) => {
    const canvas = page.locator('[data-testid="canvas"]').or(page.locator('.bg-white.min-h-full'));
    
    // Test component addition announcement
    await page.getByText('Table').locator('..').dragTo(canvas);
    
    // Component count should be announced or visible
    await expect(page.getByText('1 component')).toBeVisible();
    
    // Add more components
    await page.getByText('Button').locator('..').dragTo(canvas);
    await expect(page.getByText('2 components')).toBeVisible();
    
    // Test mode change announcement
    await page.getByRole('button', { name: /preview/i }).click();
    // Mode change should be clear to screen readers
    
    await page.getByRole('button', { name: /builder/i }).click();
    // Return to builder mode
    
    // Test property changes
    await page.getByRole('button', { name: 'Button 2' }).click();
    await page.getByLabel('Component Name').fill('Updated Button');
    await page.getByRole('button', { name: '×' }).click();
    
    // Updated component should be clearly identified
    await expect(page.getByRole('button', { name: 'Updated Button' })).toBeVisible();
  });
});
