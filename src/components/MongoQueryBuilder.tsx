import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { Close, PlayArrow, Code, Refresh } from '@mui/icons-material';
import type { MongoQuery, MongoQueryResult } from '../types';

interface MongoQueryBuilderProps {
  open: boolean;
  onClose: () => void;
  onExecute: (result: MongoQueryResult) => void;
}

export function MongoQueryBuilder({ open, onClose, onExecute }: MongoQueryBuilderProps) {
  const [collections, setCollections] = useState<string[]>([]);
  const [query, setQuery] = useState<MongoQuery>({
    collection: '',
    filter: {},
    projection: {},
    sort: {},
    limit: 100,
    skip: 0
  });
  const [filterText, setFilterText] = useState('{}');
  const [projectionText, setProjectionText] = useState('{}');
  const [sortText, setSortText] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchCollections();
    }
  }, [open]);

  const fetchCollections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/mongo/collections');
      const data = await response.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error('Failed to fetch collections:', err);
      setCollections(['users', 'orders', 'products']); // Fallback
    }
  };

  const handleExecuteQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      // Parse JSON strings
      const parsedFilter = filterText.trim() ? JSON.parse(filterText) : {};
      const parsedProjection = projectionText.trim() ? JSON.parse(projectionText) : {};
      const parsedSort = sortText.trim() ? JSON.parse(sortText) : {};

      const finalQuery: MongoQuery = {
        ...query,
        filter: parsedFilter,
        projection: parsedProjection,
        sort: parsedSort
      };

      const response = await fetch('http://localhost:8080/api/mongo/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalQuery),
      });

      const result = await response.json();
      
      if (result.success) {
        onExecute({
          data: result.data,
          count: result.count,
          query: finalQuery
        });
        onClose();
      } else {
        setError(result.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const validateJSON = (text: string) => {
    if (!text.trim()) return true;
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  const sampleQueries = [
    {
      name: 'All Records',
      filter: '{}',
      description: 'Fetch all records from collection'
    },
    {
      name: 'Filter by Field',
      filter: '{"status": "active"}',
      description: 'Filter records by status field'
    },
    {
      name: 'Range Query',
      filter: '{"age": {"$gte": 25, "$lte": 40}}',
      description: 'Find records where age is between 25 and 40'
    },
    {
      name: 'Text Search',
      filter: '{"name": {"$regex": "John", "$options": "i"}}',
      description: 'Case-insensitive text search in name field'
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 0 } }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Code />
          <Typography variant="subtitle1" fontWeight="medium">MongoDB Query Builder</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        {/* Collection Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Collection</InputLabel>
            <Select
              value={query.collection}
              onChange={(e) => setQuery({ ...query, collection: e.target.value })}
              label="Collection"
              sx={{ borderRadius: 0 }}
            >
              {collections.map((collection) => (
                <MenuItem key={collection} value={collection}>
                  {collection}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Sample Queries */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Quick Start Templates
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {sampleQueries.map((sample) => (
              <Chip
                key={sample.name}
                label={sample.name}
                onClick={() => setFilterText(sample.filter)}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 0 }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Query Parameters */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          {/* Filter */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Filter (MongoDB Query)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder='{"field": "value"}'
              error={!validateJSON(filterText)}
              helperText={!validateJSON(filterText) ? 'Invalid JSON format' : 'MongoDB filter query in JSON format'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            />
          </Box>

          {/* Projection */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Projection (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={projectionText}
              onChange={(e) => setProjectionText(e.target.value)}
              placeholder='{"field1": 1, "field2": 0}'
              error={!validateJSON(projectionText)}
              helperText={!validateJSON(projectionText) ? 'Invalid JSON format' : 'Specify which fields to include/exclude'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            />
          </Box>

          {/* Sort */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Sort (Optional)
            </Typography>
            <TextField
              fullWidth
              value={sortText}
              onChange={(e) => setSortText(e.target.value)}
              placeholder='{"field": 1}'
              error={!validateJSON(sortText)}
              helperText={!validateJSON(sortText) ? 'Invalid JSON format' : '1 for ascending, -1 for descending'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            />
          </Box>

          {/* Limit and Skip */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Limit"
              type="number"
              value={query.limit || ''}
              onChange={(e) => setQuery({ ...query, limit: parseInt(e.target.value) || undefined })}
              inputProps={{ min: 1, max: 1000 }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            />
            <TextField
              label="Skip"
              type="number"
              value={query.skip || ''}
              onChange={(e) => setQuery({ ...query, skip: parseInt(e.target.value) || undefined })}
              inputProps={{ min: 0 }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={fetchCollections}
          startIcon={<Refresh />}
          variant="outlined"
          sx={{ borderRadius: 0 }}
        >
          Refresh Collections
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} sx={{ borderRadius: 0 }}>
          Cancel
        </Button>
        <Button
          onClick={handleExecuteQuery}
          variant="contained"
          startIcon={<PlayArrow />}
          disabled={!query.collection || loading || !validateJSON(filterText) || !validateJSON(projectionText) || !validateJSON(sortText)}
          sx={{ borderRadius: 0 }}
        >
          {loading ? 'Executing...' : 'Execute Query'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
