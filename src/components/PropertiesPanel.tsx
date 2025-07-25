import { 
  Box, 
  Typography, 
  TextField, 
  FormControl, 
  FormLabel, 
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DatasetSelector } from './DatasetSelector';
import type { UIComponent } from '../types';

interface PropertiesPanelProps {
  component: UIComponent | null;
  onClose: () => void;
  onUpdate: (component: UIComponent) => void;
}

export function PropertiesPanel({ component, onClose, onUpdate }: PropertiesPanelProps) {
  if (!component) {
    return null;
  }

  const handlePropertyChange = (key: string, value: any) => {
    const updatedComponent = {
      ...component,
      properties: {
        ...component.properties,
        [key]: value,
      },
    };
    onUpdate(updatedComponent);
  };

  const handleNameChange = (name: string) => {
    onUpdate({ ...component, name });
  };

  const renderPropertyFields = () => {
    switch (component.type) {
      case 'table':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Data Source
              </FormLabel>
              <DatasetSelector
                selectedDatasetId={component.properties.datasetId}
                onDatasetChange={(datasetId) => handlePropertyChange('datasetId', datasetId)}
              />
            </FormControl>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={component.properties.showPagination ?? true}
                  onChange={(e) => handlePropertyChange('showPagination', e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" fontWeight="medium">
                  Show Pagination
                </Typography>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={component.properties.showSearch ?? true}
                  onChange={(e) => handlePropertyChange('showSearch', e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" fontWeight="medium">
                  Show Search
                </Typography>
              }
            />
            
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Page Size
              </FormLabel>
              <TextField
                type="number"
                value={component.properties.pageSize ?? 10}
                onChange={(e) => handlePropertyChange('pageSize', parseInt(e.target.value))}
                size="small"
                inputProps={{ min: 1 }}
              />
            </FormControl>
          </Box>
        );
      case 'button':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Button Style
              </FormLabel>
              <Select
                value={component.properties.style ?? 'primary'}
                onChange={(e) => handlePropertyChange('style', e.target.value)}
                size="small"
              >
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="secondary">Secondary</MenuItem>
                <MenuItem value="danger">Danger</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Size
              </FormLabel>
              <Select
                value={component.properties.size ?? 'medium'}
                onChange={(e) => handlePropertyChange('size', e.target.value)}
                size="small"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 'text':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Text Content
              </FormLabel>
              <TextField
                multiline
                rows={3}
                value={component.properties.content ?? ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                placeholder="Enter text content..."
                size="small"
              />
            </FormControl>
            
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Font Size
              </FormLabel>
              <Select
                value={component.properties.fontSize ?? 'text-base'}
                onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
                size="small"
              >
                <MenuItem value="text-xs">Extra Small</MenuItem>
                <MenuItem value="text-sm">Small</MenuItem>
                <MenuItem value="text-base">Base</MenuItem>
                <MenuItem value="text-lg">Large</MenuItem>
                <MenuItem value="text-xl">Extra Large</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            No properties available for this component type.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ 
      width: 320, 
      bgcolor: 'background.paper',
      borderLeft: 1,
      borderColor: 'divider',
      p: 2, 
      overflow: 'auto',
      height: '100%',
      position: 'relative'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight="semibold">
          Properties
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1.5 }}>
            General
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Component Name
              </FormLabel>
              <TextField
                value={component.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter component name..."
                size="small"
              />
            </FormControl>
            
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Component Type
              </FormLabel>
              <Box sx={{ 
                px: 1.5, 
                py: 1, 
                bgcolor: 'grey.50', 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                fontSize: '0.875rem',
                color: 'text.secondary'
              }}>
                {component.type}
              </Box>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1.5 }}>
            Properties
          </Typography>
          {renderPropertyFields()}
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1.5 }}>
            Layout
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5, fontSize: '0.75rem', fontWeight: 500 }}>
                Width
              </FormLabel>
              <TextField
                type="number"
                value={component.width ?? ''}
                onChange={(e) => onUpdate({ ...component, width: parseInt(e.target.value) || undefined })}
                placeholder="Auto"
                size="small"
              />
            </FormControl>
            
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 0.5, fontSize: '0.75rem', fontWeight: 500 }}>
                Height
              </FormLabel>
              <TextField
                type="number"
                value={component.height ?? ''}
                onChange={(e) => onUpdate({ ...component, height: parseInt(e.target.value) || undefined })}
                placeholder="Auto"
                size="small"
              />
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
