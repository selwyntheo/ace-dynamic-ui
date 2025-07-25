import { useState, useEffect } from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  Box, 
  Typography, 
  CircularProgress,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Storage } from '@mui/icons-material';
import { datasetApi } from '../services/api';
import type { Dataset } from '../types';

interface DatasetSelectorProps {
  selectedDatasetId?: string;
  onDatasetChange: (datasetId: string | undefined) => void;
}

export function DatasetSelector({
  selectedDatasetId,
  onDatasetChange,
}: DatasetSelectorProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 DatasetSelector mounting, fetching datasets...');
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    console.log('🔍 DatasetSelector: Starting fetch...');
    setLoading(true);
    try {
      const response = await datasetApi.getAll();
      console.log('🔍 DatasetSelector: Fetched datasets:', response.data.length);
      setDatasets(response.data);
    } catch (error) {
      console.error('Failed to fetch datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: unknown) => {
    const datasetId = value === '' ? undefined : String(value);
    onDatasetChange(datasetId);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={selectedDatasetId && datasets.some(d => d.id === selectedDatasetId) ? selectedDatasetId : ''}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        displayEmpty
        renderValue={(value) => {
          if (loading) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">Loading...</Typography>
              </Box>
            );
          }
          
          if (!value) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Storage fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Select Dataset
                </Typography>
              </Box>
            );
          }
          
          const selectedDataset = datasets.find(d => d.id === value);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Storage fontSize="small" color="primary" />
              <Typography variant="body2">
                {selectedDataset?.name || 'Unknown Dataset'}
              </Typography>
            </Box>
          );
        }}
      >
        <MenuItem value="">
          <ListItemIcon>
            <Storage fontSize="small" sx={{ color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText 
            primary="No Dataset (Sample Data)"
            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
          />
        </MenuItem>
        
        {datasets.map((dataset) => (
          <MenuItem key={dataset.id} value={dataset.id}>
            <ListItemIcon>
              <Storage fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={dataset.name}
              secondary={
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {dataset.description}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {Object.keys(dataset.columns || {}).length} columns
                  </Typography>
                </Box>
              }
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        ))}
        
        {datasets.length === 0 && !loading && (
          <MenuItem disabled>
            <ListItemText 
              primary="No datasets available"
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', textAlign: 'center' }}
            />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
