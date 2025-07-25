import type { UIComponent } from '../types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'form' | 'table' | 'layout';
  thumbnail?: string;
  components: Omit<UIComponent, 'id' | 'createdAt' | 'updatedAt'>[];
}

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start with an empty canvas',
    category: 'layout',
    components: []
  },
  {
    id: 'simple-dashboard',
    name: 'Simple Dashboard',
    description: 'Basic dashboard with data table and cards',
    category: 'dashboard',
    components: [
      {
        type: 'card',
        name: 'Welcome Card',
        properties: {},
        xPosition: 0,
        yPosition: 0,
        width: undefined,
        height: undefined,
      },
      {
        type: 'table',
        name: 'Data Overview',
        properties: {
          datasetId: '6883081e05182d178a9bcb19', // Users dataset
          showPagination: true,
          showSearch: true,
          pageSize: '10'
        },
        xPosition: 0,
        yPosition: 100,
        width: undefined,
        height: undefined,
      }
    ]
  },
  {
    id: 'data-table',
    name: 'Data Table View',
    description: 'Focus on data presentation with search and filters',
    category: 'table',
    components: [
      {
        type: 'table',
        name: 'User List',
        properties: {
          datasetId: '6883081e05182d178a9bcb19', // Users dataset
          showPagination: true,
          showSearch: true,
          pageSize: '10'
        },
        xPosition: 0,
        yPosition: 0,
        width: undefined,
        height: undefined,
      }
    ]
  },
  {
    id: 'form-layout',
    name: 'Form Layout',
    description: 'Form-focused layout with input fields',
    category: 'form',
    components: [
      {
        type: 'text',
        name: 'Form Title',
        properties: {
          content: 'User Information Form',
          fontSize: 'text-xl'
        },
        xPosition: 0,
        yPosition: 0,
        width: undefined,
        height: undefined,
      },
      {
        type: 'form',
        name: 'User Form',
        properties: {},
        xPosition: 0,
        yPosition: 50,
        width: undefined,
        height: undefined,
      },
      {
        type: 'button',
        name: 'Submit',
        properties: {
          style: 'primary',
          size: 'medium'
        },
        xPosition: 0,
        yPosition: 200,
        width: undefined,
        height: undefined,
      }
    ]
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive dashboard with multiple components',
    category: 'dashboard',
    components: [
      {
        type: 'text',
        name: 'Dashboard Title',
        properties: {
          content: 'Analytics Overview',
          fontSize: 'text-xl'
        },
        xPosition: 0,
        yPosition: 0,
        width: undefined,
        height: undefined,
      },
      {
        type: 'card',
        name: 'Key Metrics',
        properties: {},
        xPosition: 0,
        yPosition: 50,
        width: undefined,
        height: undefined,
      },
      {
        type: 'table',
        name: 'Product Catalog',
        properties: {
          datasetId: '6883081e05182d178a9bcb1a', // Products dataset
          showPagination: true,
          showSearch: true,
          pageSize: '10'
        },
        xPosition: 0,
        yPosition: 150,
        width: undefined,
        height: undefined,
      },
      {
        type: 'button',
        name: 'Export Data',
        properties: {
          style: 'secondary',
          size: 'small'
        },
        xPosition: 0,
        yPosition: 300,
        width: undefined,
        height: undefined,
      }
    ]
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return templates.filter(template => template.category === category);
};
