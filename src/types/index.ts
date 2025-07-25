export interface Dataset {
  id: string;
  name: string;
  description?: string;
  columns: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface UIComponent {
  id: string;
  type: ComponentType;
  name: string;
  properties: Record<string, any>;
  dataset?: Dataset;
  datasetId?: string;
  xPosition?: number;
  yPosition?: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export type ComponentType = 
  | 'table' 
  | 'form' 
  | 'chart' 
  | 'text' 
  | 'button' 
  | 'input' 
  | 'select'
  | 'card'
  | 'date-picker'
  | 'time-picker'
  | 'datetime-picker'
  | 'number-input'
  | 'textarea'
  | 'checkbox'
  | 'radio-group'
  | 'switch'
  | 'slider'
  | 'data-filter'
  | 'json-explorer'
  | 'key-value'
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'area-chart'
  | 'scatter-chart'
  | 'presentation'
  | 'navigation'
  | 'breadcrumb'
  | 'tabs'
  | 'stepper'
  | 'progress'
  | 'rating'
  | 'file-upload'
  | 'image'
  | 'video'
  | 'map';

export interface ColumnDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
  defaultValue?: any;
}

export interface TableData {
  columns: ColumnDefinition[];
  rows: Record<string, any>[];
}

export interface ComponentConfig {
  type: ComponentType;
  label: string;
  icon: string;
  defaultProps: Record<string, any>;
  configFields: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  options?: string[];
  required?: boolean;
}

// Export mongo types
export * from './mongo';
