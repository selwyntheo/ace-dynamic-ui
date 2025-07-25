import axios from 'axios';
import type { UIComponent } from '../types';
import type { LayoutOptions } from '../components/LayoutSelector';

const API_BASE_URL = 'http://localhost:8080/api';

export interface PageData {
  id?: string;
  name: string;
  description?: string;
  components: UIComponent[];
  layout?: LayoutOptions;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageSearchParams {
  published?: boolean;
  search?: string;
}

class PageService {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getAllPages(params?: PageSearchParams): Promise<PageData[]> {
    try {
      const response = await this.axiosInstance.get('/pages', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  async getPageById(id: string, published?: boolean): Promise<PageData> {
    try {
      const params = published ? { published } : {};
      const response = await this.axiosInstance.get(`/pages/${id}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  }

  async createPage(pageData: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PageData> {
    try {
      const response = await this.axiosInstance.post('/pages', pageData);
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  async updatePage(id: string, pageData: Partial<PageData>): Promise<PageData> {
    try {
      const response = await this.axiosInstance.put(`/pages/${id}`, pageData);
      return response.data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  }

  async savePage(pageData: PageData): Promise<PageData> {
    if (pageData.id) {
      return this.updatePage(pageData.id, pageData);
    } else {
      return this.createPage(pageData);
    }
  }

  async publishPage(id: string): Promise<PageData> {
    try {
      const response = await this.axiosInstance.patch(`/pages/${id}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing page:', error);
      throw error;
    }
  }

  async unpublishPage(id: string): Promise<PageData> {
    try {
      const response = await this.axiosInstance.patch(`/pages/${id}/unpublish`);
      return response.data;
    } catch (error) {
      console.error('Error unpublishing page:', error);
      throw error;
    }
  }

  async deletePage(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/pages/${id}`);
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }

  async duplicatePage(id: string, newName: string): Promise<PageData> {
    try {
      const response = await this.axiosInstance.post(`/pages/${id}/duplicate`, { name: newName });
      return response.data;
    } catch (error) {
      console.error('Error duplicating page:', error);
      throw error;
    }
  }

  async getPagesByComponentType(componentType: string): Promise<PageData[]> {
    try {
      const response = await this.axiosInstance.get(`/pages/by-component/${componentType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pages by component type:', error);
      throw error;
    }
  }

  // Auto-save functionality
  async autoSave(pageData: PageData, debounceMs = 2000): Promise<void> {
    // Debounce auto-save to prevent too many API calls
    clearTimeout((this as any).autoSaveTimeout);
    (this as any).autoSaveTimeout = setTimeout(async () => {
      try {
        await this.savePage(pageData);
        console.log('Page auto-saved successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, debounceMs);
  }
}

export const pageService = new PageService();
export default pageService;
