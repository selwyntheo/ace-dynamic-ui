import { describe, test, expect } from 'vitest';

describe('Component Reordering Logic', () => {
  test('array reordering logic works correctly', () => {
    const components = [
      { id: '1', name: 'Component 1' },
      { id: '2', name: 'Component 2' },
      { id: '3', name: 'Component 3' }
    ];
    
    // Test moving first item to second position (0 -> 1)
    const result1 = [...components];
    const [reorderedItem] = result1.splice(0, 1);
    result1.splice(1, 0, reorderedItem);
    
    expect(result1[0].id).toBe('2');
    expect(result1[1].id).toBe('1');
    expect(result1[2].id).toBe('3');
  });
  
  test('moving last item to first position works', () => {
    const components = [
      { id: '1', name: 'Component 1' },
      { id: '2', name: 'Component 2' },
      { id: '3', name: 'Component 3' }
    ];
    
    // Move last item to first position (2 -> 0)
    const result = [...components];
    const [reorderedItem] = result.splice(2, 1);
    result.splice(0, 0, reorderedItem);
    
    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('1');
    expect(result[2].id).toBe('2');
  });
});
