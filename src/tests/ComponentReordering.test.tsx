import { describe, test, expect } from 'vitest';
import { useAppStore } from '../stores/appStore';
import type { UIComponent } from '../types';

describe('Component Reordering', () => {
  test('reorderComponents should reorder components correctly', () => {
    const store = useAppStore.getState();
    
    // Create test components
    const components: UIComponent[] = [
      {
        id: '1',
        type: 'table',
        name: 'Table 1',
        properties: {},
        xPosition: 0,
        yPosition: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: 'button',
        name: 'Button 1',
        properties: {},
        xPosition: 0,
        yPosition: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        type: 'text',
        name: 'Text 1',
        properties: {},
        xPosition: 0,
        yPosition: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }
    ];
    
    // Set initial components
    store.setComponents(components);
    
    // Test reordering: move first item to second position
    store.reorderComponents(0, 1);
    
    const reorderedComponents = store.components;
    expect(reorderedComponents[0].id).toBe('2');
    expect(reorderedComponents[1].id).toBe('1');
    expect(reorderedComponents[2].id).toBe('3');
  });
  
  test('reorderComponents should handle moving last item to first', () => {
    const store = useAppStore.getState();
    
    // Create test components
    const components: UIComponent[] = [
      { id: '1', type: 'table', name: 'Table 1', properties: {}, xPosition: 0, yPosition: 0, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
      { id: '2', type: 'button', name: 'Button 1', properties: {}, xPosition: 0, yPosition: 0, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
      { id: '3', type: 'text', name: 'Text 1', properties: {}, xPosition: 0, yPosition: 0, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }
    ];
    
    store.setComponents(components);
    
    // Move last item to first position
    store.reorderComponents(2, 0);
    
    const reorderedComponents = store.components;
    expect(reorderedComponents[0].id).toBe('3');
    expect(reorderedComponents[1].id).toBe('1');
    expect(reorderedComponents[2].id).toBe('2');
  });
});
