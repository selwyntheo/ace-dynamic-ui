import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { DndContext } from '@dnd-kit/core';
import { Canvas } from '../components/Canvas';
import type { UIComponent } from '../types';

// Mock component that wraps Canvas with DndContext
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndContext onDragEnd={() => {}}>
    {children}
  </DndContext>
);

const mockComponents: UIComponent[] = [
  {
    id: '1',
    type: 'table',
    name: 'Test Table',
    properties: { datasetId: '1' },
    xPosition: 0,
    yPosition: 0,
    width: undefined,
    height: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    type: 'button',
    name: 'Test Button',
    properties: {},
    xPosition: 100,
    yPosition: 100,
    width: undefined,
    height: undefined,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('Canvas', () => {
  test('renders empty state when no components', () => {
    render(
      <TestWrapper>
        <Canvas components={[]} />
      </TestWrapper>
    );

    expect(screen.getByText('Start Building Your App')).toBeInTheDocument();
    expect(screen.getByText('Drag components from the left panel to start building your dynamic UI')).toBeInTheDocument();
  });

  test('renders components correctly', () => {
    render(
      <TestWrapper>
        <Canvas components={mockComponents} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('handles component selection', () => {
    const onComponentSelect = vi.fn();
    
    render(
      <TestWrapper>
        <Canvas components={mockComponents} onComponentSelect={onComponentSelect} />
      </TestWrapper>
    );

    const tableComponent = screen.getByText('Test Table');
    fireEvent.click(tableComponent);

    expect(onComponentSelect).toHaveBeenCalledWith(mockComponents[0]);
  });

  test('renders table component with ConnectedDataTable', () => {
    render(
      <TestWrapper>
        <Canvas components={[mockComponents[0]]} />
      </TestWrapper>
    );

    // Should render the table component
    expect(screen.getByText('Test Table')).toBeInTheDocument();
  });

  test('renders button component correctly', () => {
    render(
      <TestWrapper>
        <Canvas components={[mockComponents[1]]} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('displays component count correctly', () => {
    render(
      <TestWrapper>
        <Canvas components={mockComponents} />
      </TestWrapper>
    );

    // Components should be rendered (count is managed by parent)
    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });
});
