import { create } from 'zustand';
import type { Dataset, UIComponent } from '../types';

interface AppState {
  datasets: Dataset[];
  components: UIComponent[];
  selectedDataset: Dataset | null;
  selectedComponent: UIComponent | null;
  isBuilderMode: boolean;
  
  // Actions
  setDatasets: (datasets: Dataset[]) => void;
  setComponents: (components: UIComponent[]) => void;
  setSelectedDataset: (dataset: Dataset | null) => void;
  setSelectedComponent: (component: UIComponent | null) => void;
  setBuilderMode: (isBuilder: boolean) => void;
  addComponent: (component: UIComponent) => void;
  updateComponent: (id: string, updates: Partial<UIComponent>) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (activeIndex: number, overIndex: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  datasets: [],
  components: [],
  selectedDataset: null,
  selectedComponent: null,
  isBuilderMode: true,
  
  setDatasets: (datasets) => set({ datasets }),
  setComponents: (components) => set({ components }),
  setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  setBuilderMode: (isBuilder) => set({ isBuilderMode: isBuilder }),
  
  addComponent: (component) => 
    set((state) => ({ components: [...state.components, component] })),
  
  updateComponent: (id, updates) =>
    set((state) => ({
      components: state.components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    })),
  
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
    })),
  
  reorderComponents: (activeIndex, overIndex) =>
    set((state) => {
      const newComponents = [...state.components];
      const [reorderedItem] = newComponents.splice(activeIndex, 1);
      newComponents.splice(overIndex, 0, reorderedItem);
      return { components: newComponents };
    }),
}));
