import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8080/api';

test.describe('Dataset API Integration Tests', () => {
  let createdDatasetId: number;

  test.beforeAll(async ({ request }) => {
    // Ensure backend is running
    const response = await request.get(`${API_BASE_URL}/datasets`);
    expect(response.status()).toBe(200);
  });

  test('should create a new dataset', async ({ request }) => {
    const newDataset = {
      name: 'Test Dataset',
      description: 'A test dataset for integration testing',
      columns: {
        id: 'number',
        name: 'string',
        email: 'string',
        created_at: 'date'
      }
    };

    const response = await request.post(`${API_BASE_URL}/datasets`, {
      data: newDataset
    });

    expect(response.status()).toBe(200);
    const dataset = await response.json();
    expect(dataset.name).toBe(newDataset.name);
    expect(dataset.description).toBe(newDataset.description);
    expect(dataset.columns).toEqual(newDataset.columns);
    expect(dataset.id).toBeDefined();
    
    createdDatasetId = dataset.id;
  });

  test('should retrieve all datasets', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/datasets`);
    expect(response.status()).toBe(200);
    
    const datasets = await response.json();
    expect(Array.isArray(datasets)).toBe(true);
    expect(datasets.length).toBeGreaterThan(0);
  });

  test('should retrieve dataset by ID', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/datasets/${createdDatasetId}`);
    expect(response.status()).toBe(200);
    
    const dataset = await response.json();
    expect(dataset.id).toBe(createdDatasetId);
    expect(dataset.name).toBe('Test Dataset');
  });

  test('should update an existing dataset', async ({ request }) => {
    const updatedData = {
      name: 'Updated Test Dataset',
      description: 'Updated description',
      columns: {
        id: 'number',
        name: 'string',
        email: 'string',
        phone: 'string',
        updated_at: 'date'
      }
    };

    const response = await request.put(`${API_BASE_URL}/datasets/${createdDatasetId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const dataset = await response.json();
    expect(dataset.name).toBe(updatedData.name);
    expect(dataset.description).toBe(updatedData.description);
    expect(dataset.columns).toEqual(updatedData.columns);
  });

  test('should search datasets by name', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/datasets/search?name=Updated`);
    expect(response.status()).toBe(200);
    
    const datasets = await response.json();
    expect(Array.isArray(datasets)).toBe(true);
    expect(datasets.length).toBeGreaterThan(0);
    expect(datasets[0].name).toContain('Updated');
  });

  test('should delete a dataset', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/datasets/${createdDatasetId}`);
    expect(response.status()).toBe(200);

    // Verify deletion
    const getResponse = await request.get(`${API_BASE_URL}/datasets/${createdDatasetId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 404 for non-existent dataset', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/datasets/99999`);
    expect(response.status()).toBe(404);
  });
});

test.describe('UI Component API Integration Tests', () => {
  let datasetId: number;
  let componentId: number;

  test.beforeAll(async ({ request }) => {
    // Create a dataset for component tests
    const dataset = {
      name: 'Component Test Dataset',
      description: 'Dataset for component testing',
      columns: {
        id: 'number',
        title: 'string',
        status: 'string'
      }
    };

    const datasetResponse = await request.post(`${API_BASE_URL}/datasets`, {
      data: dataset
    });
    
    const createdDataset = await datasetResponse.json();
    datasetId = createdDataset.id;
  });

  test.afterAll(async ({ request }) => {
    // Clean up dataset
    await request.delete(`${API_BASE_URL}/datasets/${datasetId}`);
  });

  test('should create a new UI component', async ({ request }) => {
    const newComponent = {
      type: 'table',
      name: 'Test Table Component',
      properties: {
        showPagination: 'true',
        showSearch: 'true',
        pageSize: '10'
      },
      xPosition: 0,
      yPosition: 0,
      width: 800,
      height: 400
    };

    const response = await request.post(`${API_BASE_URL}/components`, {
      data: newComponent
    });

    expect(response.status()).toBe(200);
    const component = await response.json();
    expect(component.type).toBe(newComponent.type);
    expect(component.name).toBe(newComponent.name);
    expect(component.properties).toEqual(newComponent.properties);
    expect(component.id).toBeDefined();
    
    componentId = component.id;
  });

  test('should retrieve all components', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/components`);
    expect(response.status()).toBe(200);
    
    const components = await response.json();
    expect(Array.isArray(components)).toBe(true);
  });

  test('should retrieve component by ID', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/components/${componentId}`);
    expect(response.status()).toBe(200);
    
    const component = await response.json();
    expect(component.id).toBe(componentId);
    expect(component.name).toBe('Test Table Component');
  });

  test('should update component properties', async ({ request }) => {
    const updatedComponent = {
      type: 'table',
      name: 'Updated Table Component',
      properties: {
        showPagination: 'false',
        showSearch: 'true',
        pageSize: '20'
      },
      xPosition: 100,
      yPosition: 50,
      width: 900,
      height: 500
    };

    const response = await request.put(`${API_BASE_URL}/components/${componentId}`, {
      data: updatedComponent
    });

    expect(response.status()).toBe(200);
    const component = await response.json();
    expect(component.name).toBe(updatedComponent.name);
    expect(component.properties).toEqual(updatedComponent.properties);
    expect(component.xPosition).toBe(100);
    expect(component.yPosition).toBe(50);
  });

  test('should retrieve components by type', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/components/type/table`);
    expect(response.status()).toBe(200);
    
    const components = await response.json();
    expect(Array.isArray(components)).toBe(true);
    components.forEach(component => {
      expect(component.type).toBe('table');
    });
  });

  test('should delete a component', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/components/${componentId}`);
    expect(response.status()).toBe(200);

    // Verify deletion
    const getResponse = await request.get(`${API_BASE_URL}/components/${componentId}`);
    expect(getResponse.status()).toBe(404);
  });
});
