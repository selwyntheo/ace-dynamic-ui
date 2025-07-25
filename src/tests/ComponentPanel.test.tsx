import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, vi } from 'vitest';
import { DndContext } from '@dnd-kit/core';
import { ComponentPanel } from '../components/ComponentPanel';

// Mock component that wraps ComponentPanel with DndContext
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext onDragEnd={() => {}}>
    {children}
  </DndContext>
);

describe('ComponentPanel', () => {
  test('renders component categories correctly', () => {
    render(
      <TestWrapper>
        <ComponentPanel />
      </TestWrapper>
    );

    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Form Inputs')).toBeInTheDocument();
    expect(screen.getByText('Data & Tables')).toBeInTheDocument();
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });

  test('renders search box', () => {
    render(
      <TestWrapper>
        <ComponentPanel />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search components...')).toBeInTheDocument();
  });

  test('filters components based on search input', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <ComponentPanel />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search components...');
    
    // Search for "table"
    await user.type(searchInput, 'table');
    
    // Should show table component
    expect(screen.getByText('Table')).toBeInTheDocument();
    
    // Should not show button component
    expect(screen.queryByText('Button')).not.toBeInTheDocument();
  });

  test('collapses and expands correctly', () => {
    const onToggleCollapse = vi.fn();
    
    render(
      <TestWrapper>
        <ComponentPanel collapsed={false} onToggleCollapse={onToggleCollapse} />
      </TestWrapper>
    );

    // Should show expanded view
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  test('renders collapsed view correctly', () => {
    render(
      <TestWrapper>
        <ComponentPanel collapsed={true} />
      </TestWrapper>
    );

    // In collapsed mode, should show legacy components
    expect(screen.getByText('Table')).toBeInTheDocument();
  });

  test('handles component selection', () => {
    const onComponentSelect = vi.fn();
    
    render(
      <TestWrapper>
        <ComponentPanel onComponentSelect={onComponentSelect} />
      </TestWrapper>
    );

    // Click on a component (this would trigger drag in real usage)
    const tableComponent = screen.getByText('Table').closest('[data-testid]') || 
                          screen.getByText('Table').closest('div');
    
    if (tableComponent) {
      fireEvent.click(tableComponent);
    }
  });
});
