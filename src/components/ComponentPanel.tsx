import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  ChevronLeft,
  ChevronRight,
  Search
} from '@mui/icons-material';
import type { ComponentType } from '../types';
import { ComponentPreview } from './ComponentPreview';

interface ComponentPanelProps {
  onComponentSelect?: (type: ComponentType) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface ComponentCategory {
  name: string;
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  type: ComponentType;
  label: string;
  color: string;
}

const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    name: 'Basic',
    components: [
      { type: 'text' as ComponentType, label: 'Text', color: '#8E9AAF' },
      { type: 'button' as ComponentType, label: 'Button', color: '#A4B3C7' },
      { type: 'card' as ComponentType, label: 'Card', color: '#C8B8DB' },
      { type: 'image' as ComponentType, label: 'Image', color: '#ADBCC9' },
    ]
  },
  {
    name: 'Form Inputs',
    components: [
      { type: 'input' as ComponentType, label: 'Text Input', color: '#B8A8D1' },
      { type: 'textarea' as ComponentType, label: 'Text Area', color: '#C7B8DD' },
      { type: 'number-input' as ComponentType, label: 'Number', color: '#9FB3C8' },
      { type: 'select' as ComponentType, label: 'Select', color: '#A8C4D6' },
      { type: 'checkbox' as ComponentType, label: 'Checkbox', color: '#B5D4C1' },
      { type: 'radio-group' as ComponentType, label: 'Radio', color: '#D6C4A8' },
      { type: 'switch' as ComponentType, label: 'Switch', color: '#C8A8C8' },
      { type: 'slider' as ComponentType, label: 'Slider', color: '#D1A8B8' },
      { type: 'rating' as ComponentType, label: 'Rating', color: '#E6D4A8' },
    ]
  },
  {
    name: 'Date & Time',
    components: [
      { type: 'date-picker' as ComponentType, label: 'Date', color: '#A8D4C4' },
      { type: 'time-picker' as ComponentType, label: 'Time', color: '#A8D6D4' },
      { type: 'datetime-picker' as ComponentType, label: 'DateTime', color: '#A8C4D6' },
    ]
  },
  {
    name: 'Data & Tables',
    components: [
      { type: 'table' as ComponentType, label: 'Table', color: '#B8C4D6' },
      { type: 'data-filter' as ComponentType, label: 'Filter', color: '#C4D4B8' },
      { type: 'json-explorer' as ComponentType, label: 'JSON', color: '#E6C4A8' },
      { type: 'key-value' as ComponentType, label: 'Key-Value', color: '#D4B8C4' },
    ]
  },
  {
    name: 'Charts',
    components: [
      { type: 'bar-chart' as ComponentType, label: 'Bar Chart', color: '#D6B8B8' },
      { type: 'line-chart' as ComponentType, label: 'Line Chart', color: '#C4D4B8' },
      { type: 'pie-chart' as ComponentType, label: 'Pie Chart', color: '#E6C4A8' },
      { type: 'area-chart' as ComponentType, label: 'Area Chart', color: '#D4B8C4' },
    ]
  },
  {
    name: 'Navigation',
    components: [
      { type: 'navigation' as ComponentType, label: 'Navigation', color: '#C8C4B8' },
      { type: 'breadcrumb' as ComponentType, label: 'Breadcrumb', color: '#B8C8C4' },
      { type: 'tabs' as ComponentType, label: 'Tabs', color: '#A8D4C4' },
      { type: 'stepper' as ComponentType, label: 'Stepper', color: '#A8C4D6' },
    ]
  },
  {
    name: 'Media & Files',
    components: [
      { type: 'file-upload' as ComponentType, label: 'Upload', color: '#B8C4D6' },
      { type: 'video' as ComponentType, label: 'Video', color: '#D6B8B8' },
      { type: 'map' as ComponentType, label: 'Map', color: '#C4D4B8' },
    ]
  }
];

const LEGACY_COMPONENT_TYPES = [
  { type: 'table' as ComponentType, label: 'Table', color: '#B8C4D6' },
  { type: 'form' as ComponentType, label: 'Form', color: '#C4D4B8' },
  { type: 'chart' as ComponentType, label: 'Chart', color: '#D4B8C4' },
  { type: 'button' as ComponentType, label: 'Button', color: '#A4B3C7' },
  { type: 'text' as ComponentType, label: 'Text', color: '#8E9AAF' },
  { type: 'card' as ComponentType, label: 'Card', color: '#C8B8DB' },
];

interface DraggableComponentProps {
  type: ComponentType;
  label: string;
  color: string;
  collapsed?: boolean;
}

function DraggableComponent({ type, label, color, collapsed = false }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${type}`,
    data: { type },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Tooltip title={collapsed ? label : ''} placement="right">
      <Card
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        sx={{
          cursor: 'grab',
          userSelect: 'none',
          opacity: isDragging ? 0.6 : 1,
          transform: isDragging ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          width: collapsed ? 48 : 120,
          height: collapsed ? 48 : 120,
          border: '1px solid',
          borderColor: 'grey.100',
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            transform: collapsed ? 'scale(1.05)' : 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            borderColor: 'grey.200',
            backgroundColor: 'grey.50',
          },
          '&:active': {
            cursor: 'grabbing',
            transform: 'scale(0.98)',
          },
        }}
      >
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: collapsed ? 'row' : 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          py: collapsed ? 1 : 1.5,
          px: collapsed ? 1 : 1.5,
          height: '100%',
          '&:last-child': { pb: collapsed ? 1 : 1.5 }
        }}>
          <Box sx={{ 
            mb: collapsed ? 0 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: collapsed ? 24 : 48,
            height: collapsed ? 24 : 48,
            borderRadius: '50%',
            bgcolor: color, 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            p: 0.5,
          }}>
            <ComponentPreview type={type} size={collapsed ? 16 : 36} />
          </Box>
          {!collapsed && (
            <Typography 
              variant="body2" 
              fontWeight={500} 
              color="text.primary"
              sx={{ 
                textAlign: 'center',
                fontSize: '0.75rem',
                letterSpacing: '0.025em',
                lineHeight: 1.2,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Tooltip>
  );
}

export function ComponentPanel({ onComponentSelect: _onComponentSelect, collapsed = false, onToggleCollapse }: ComponentPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter components based on search term
  const filteredComponents = COMPONENT_CATEGORIES[selectedCategory]?.components.filter(component =>
    component.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <Box sx={{ 
      width: collapsed ? 64 : 320, 
      bgcolor: 'background.paper', 
      borderRight: '1px solid',
      borderColor: 'grey.200',
      p: collapsed ? 1 : 3,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Header with collapse toggle */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'space-between',
        mb: 3
      }}>
        {!collapsed && (
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1.1rem',
            letterSpacing: '0.02em'
          }}>
            Components
          </Typography>
        )}
        <Tooltip title={collapsed ? "Expand Component Library (Ctrl+B)" : "Collapse Component Library (Ctrl+B)"}>
          <IconButton 
            onClick={onToggleCollapse}
            size="small"
            sx={{ 
              ml: collapsed ? 0 : 'auto',
              bgcolor: 'grey.100',
              borderRadius: 2,
              padding: 1,
              '&:hover': { 
                bgcolor: 'grey.200',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {!collapsed && (
        <>
          {/* Category Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 36,
                borderRadius: 2,
                backgroundColor: 'grey.50',
                padding: 0.5,
                '& .MuiTab-root': {
                  minHeight: 32,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  margin: '0 2px',
                  color: 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: 'white',
                    color: 'primary.main',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'primary.main',
                  }
                },
                '& .MuiTabs-indicator': {
                  display: 'none'
                }
              }}
            >
              {COMPONENT_CATEGORIES.map((category) => (
                <Tab key={category.name} label={category.name} />
              ))}
            </Tabs>
          </Box>

          {/* Search Box */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  }
                }
              }}
            />
          </Box>

          {/* Component List */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0.5,
            overflowY: 'auto',
            flex: 1,
            padding: 0.25
          }}>
            {filteredComponents.map((component) => (
              <DraggableComponent
                key={component.type}
                type={component.type}
                label={component.label}
                color={component.color}
                collapsed={false}
              />
            ))}
          </Box>
        </>
      )}

      {collapsed && (
        /* Collapsed view - show legacy components as icons */
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          alignItems: 'center',
          padding: 0.5
        }}>
          {LEGACY_COMPONENT_TYPES.map((component) => (
            <DraggableComponent
              key={component.type}
              type={component.type}
              label={component.label}
              color={component.color}
              collapsed={true}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
