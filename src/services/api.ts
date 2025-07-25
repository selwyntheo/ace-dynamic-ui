import axios from 'axios';
import type { Dataset, UIComponent } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dataset API
export const datasetApi = {
  getAll: () => api.get<Dataset[]>('/datasets'),
  getById: (id: string) => api.get<Dataset>(`/datasets/${id}`),
  getData: (id: string, limit: number = 50) => 
    api.get<any[]>(`/datasets/${id}/data?limit=${limit}`),
  create: (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Dataset>('/datasets', dataset),
  update: (id: string, dataset: Partial<Dataset>) => 
    api.put<Dataset>(`/datasets/${id}`, dataset),
  delete: (id: string) => api.delete(`/datasets/${id}`),
  search: (name: string) => api.get<Dataset[]>(`/datasets/search?name=${name}`),
};

// UI Component API
export const componentApi = {
  getAll: () => api.get<UIComponent[]>('/components'),
  getById: (id: string) => api.get<UIComponent>(`/components/${id}`),
  getByDataset: (datasetId: string) => 
    api.get<UIComponent[]>(`/components/dataset/${datasetId}`),
  getByType: (type: string) => 
    api.get<UIComponent[]>(`/components/type/${type}`),
  create: (component: Omit<UIComponent, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<UIComponent>('/components', component),
  update: (id: string, component: Partial<UIComponent>) => 
    api.put<UIComponent>(`/components/${id}`, component),
  delete: (id: string) => api.delete(`/components/${id}`),
};
