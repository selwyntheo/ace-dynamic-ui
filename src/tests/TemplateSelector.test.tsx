import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, vi } from 'vitest';
import { TemplateSelector } from '../components/TemplateSelector';

describe('TemplateSelector', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSelectTemplate: vi.fn(),
  };

  test('renders template selector dialog when open', () => {
    render(<TemplateSelector {...defaultProps} />);

    expect(screen.getByText('Choose a Template')).toBeInTheDocument();
    expect(screen.getByText('All Templates')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<TemplateSelector {...defaultProps} open={false} />);

    expect(screen.queryByText('Choose a Template')).not.toBeInTheDocument();
  });

  test('displays template categories', () => {
    render(<TemplateSelector {...defaultProps} />);

    expect(screen.getByText('Dashboards')).toBeInTheDocument();
    expect(screen.getByText('Data Tables')).toBeInTheDocument();
    expect(screen.getByText('Forms')).toBeInTheDocument();
    expect(screen.getByText('Layouts')).toBeInTheDocument();
  });

  test('displays available templates', () => {
    render(<TemplateSelector {...defaultProps} />);

    expect(screen.getByText('Blank Canvas')).toBeInTheDocument();
    expect(screen.getByText('Simple Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Data Table View')).toBeInTheDocument();
  });

  test('filters templates by category', async () => {
    const user = userEvent.setup();
    render(<TemplateSelector {...defaultProps} />);

    // Click on Dashboards tab
    await user.click(screen.getByText('Dashboards'));

    // Should show dashboard templates
    expect(screen.getByText('Simple Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  test('handles template selection', async () => {
    const user = userEvent.setup();
    const onSelectTemplate = vi.fn();
    
    render(<TemplateSelector {...defaultProps} onSelectTemplate={onSelectTemplate} />);

    // Click on a template
    await user.click(screen.getByText('Use Template').closest('button')!);

    expect(onSelectTemplate).toHaveBeenCalled();
  });

  test('handles dialog close', () => {
    const onClose = vi.fn();
    
    render(<TemplateSelector {...defaultProps} onClose={onClose} />);

    // Click close button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalled();
  });

  test('shows template descriptions', () => {
    render(<TemplateSelector {...defaultProps} />);

    expect(screen.getByText('Start with an empty canvas')).toBeInTheDocument();
    expect(screen.getByText('Basic dashboard with data table and cards')).toBeInTheDocument();
  });

  test('displays component count for each template', () => {
    render(<TemplateSelector {...defaultProps} />);

    // Check for component count text patterns
    const componentCounts = screen.getAllByText(/\d+ components?/);
    expect(componentCounts.length).toBeGreaterThan(0);
  });
});
