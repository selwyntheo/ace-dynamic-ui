import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Chip } from '@mui/material';
import { DataGrid, type GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Code } from '@mui/icons-material';
import { datasetApi } from '../services/api';
import type { Dataset, MongoQueryResult } from '../types';

interface ConnectedDataTableProps {
  datasetId?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  maxRows?: number;
  mongoQueryResult?: MongoQueryResult;
  onMongoQueryOpen?: () => void;
}

export function ConnectedDataTable({
  datasetId,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = true,
  maxRows = 50,
  mongoQueryResult,
  onMongoQueryOpen,
}: ConnectedDataTableProps) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mongoQueryResult) {
      // Use MongoDB query results
      showMongoQueryData(mongoQueryResult);
    } else if (datasetId && datasetId.trim() !== '') {
      fetchDatasetAndData();
    } else {
      // Show sample data if no dataset is selected
      showSampleData();
    }
  }, [datasetId, maxRows, mongoQueryResult]);

  const showMongoQueryData = (queryResult: MongoQueryResult) => {
    setLoading(true);
    setError(null);

    try {
      const { data: mongoData, query } = queryResult;
      
      if (mongoData.length === 0) {
        setColumns([]);
        setData([]);
        setDataset(null);
        return;
      }

      // Generate columns from the first record
      const firstRecord = mongoData[0];
      const generatedColumns: GridColDef[] = Object.keys(firstRecord).map((key) => {
        const value = firstRecord[key];
        let type: 'string' | 'number' | 'boolean' | 'date' = 'string';
        
        if (typeof value === 'number') {
          type = 'number';
        } else if (typeof value === 'boolean') {
          type = 'boolean';
        } else if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
          type = 'date';
        }

        const column: GridColDef = {
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          flex: 1,
          minWidth: 150,
          type,
          sortable: enableSorting,
          filterable: enableFiltering,
        };

        // Add chip rendering for status columns
        if (key.toLowerCase().includes('status')) {
          column.renderCell = (params) => {
            const status = params.value as string;
            if (!status) return null;
            
            const isActive = status?.toLowerCase().includes('active') || status?.toLowerCase().includes('completed');
            const isInactive = status?.toLowerCase().includes('inactive') || status?.toLowerCase().includes('failed') || status?.toLowerCase().includes('pending');
            
            // Define softer color scheme
            let chipStyles = {};
            
            if (isActive) {
              chipStyles = {
                backgroundColor: '#e8f5e8',
                color: '#2d5016',
                border: '1px solid #c3e6c3',
              };
            } else if (isInactive) {
              chipStyles = {
                backgroundColor: '#fdeaea',
                color: '#7d2f2f',
                border: '1px solid #f5c6c6',
              };
            } else {
              chipStyles = {
                backgroundColor: '#fff4e6',
                color: '#8b5a00',
                border: '1px solid #f0d0a0',
              };
            }
            
            return (
              <Chip
                label={status}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  minWidth: '70px',
                  textTransform: 'capitalize',
                  ...chipStyles,
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              />
            );
          };
        }

        return column;
      });

      // Add row IDs if not present
      const dataWithIds = mongoData.map((row, index) => ({
        id: row._id || row.id || index,
        ...row,
      }));

      setColumns(generatedColumns);
      setData(dataWithIds);
      setDataset({
        id: '0',
        name: `MongoDB Query: ${query.collection}`,
        description: `Query results from collection "${query.collection}"`,
        columns: Object.fromEntries(
          generatedColumns.map(col => [col.field, col.type || 'string'])
        ),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process MongoDB query results');
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasetAndData = async () => {
    if (!datasetId || datasetId.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      // Fetch dataset metadata
      const datasetResponse = await datasetApi.getById(datasetId);
      const fetchedDataset = datasetResponse.data;
      setDataset(fetchedDataset);

      // Fetch actual data
      const dataResponse = await datasetApi.getData(datasetId, maxRows);
      const fetchedData = dataResponse.data;
      setData(fetchedData);

      // Generate columns from dataset schema
      const generatedColumns = generateColumnsFromDataset(fetchedDataset, fetchedData);
      setColumns(generatedColumns);

    } catch (err) {
      console.error('Error fetching dataset data:', err);
      setError('Failed to load dataset data. Using sample data instead.');
      showSampleData();
    } finally {
      setLoading(false);
    }
  };

  const showSampleData = () => {
    const sampleData = [
      { id: '1', name: 'Sample Item 1', status: 'Active', created: '2023-01-01' },
      { id: '2', name: 'Sample Item 2', status: 'Inactive', created: '2023-01-02' },
      { id: '3', name: 'Sample Item 3', status: 'Pending', created: '2023-01-03' },
    ];

    const sampleColumns: GridColDef[] = [
      {
        field: 'id',
        headerName: 'ID',
        width: 70,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 200,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => {
          const status = params.value as string;
          if (!status) return null;
          
          const isActive = status?.toLowerCase().includes('active') || status?.toLowerCase().includes('completed');
          const isInactive = status?.toLowerCase().includes('inactive') || status?.toLowerCase().includes('failed') || status?.toLowerCase().includes('pending');
          
          // Define softer color scheme
          let chipStyles = {};
          
          if (isActive) {
            chipStyles = {
              backgroundColor: '#e8f5e8',
              color: '#2d5016',
              border: '1px solid #c3e6c3',
            };
          } else if (isInactive) {
            chipStyles = {
              backgroundColor: '#fdeaea',
              color: '#7d2f2f',
              border: '1px solid #f5c6c6',
            };
          } else {
            chipStyles = {
              backgroundColor: '#fff4e6',
              color: '#8b5a00',
              border: '1px solid #f0d0a0',
            };
          }
          
          return (
            <Chip
              label={status}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 1.5,
                fontSize: '0.75rem',
                fontWeight: 500,
                minWidth: '70px',
                textTransform: 'capitalize',
                ...chipStyles,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          );
        },
      },
      {
        field: 'created',
        headerName: 'Created',
        width: 130,
      },
    ];

    setData(sampleData);
    setColumns(sampleColumns);
    setDataset(null);
  };

  const generateColumnsFromDataset = (dataset: Dataset, data: any[]): GridColDef[] => {
    if (!dataset.columns || Object.keys(dataset.columns).length === 0) {
      // Fallback: infer columns from data
      if (data.length > 0) {
        return Object.keys(data[0]).map(key => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          width: 150,
        }));
      }
      return [];
    }

    return Object.entries(dataset.columns).map(([columnName, columnType]) => {
      const column: GridColDef = {
        field: columnName,
        headerName: columnName.charAt(0).toUpperCase() + columnName.slice(1).replace(/_/g, ' '),
        width: 150,
      };

      // Add custom cell rendering based on column type
      if (columnType === 'boolean') {
        column.renderCell = (params) => (
          <Box sx={{ 
            px: 1.5, 
            py: 0.5, 
            borderRadius: 1, 
            fontSize: '0.75rem',
            fontWeight: 500,
            textAlign: 'center',
            minWidth: '50px',
            bgcolor: params.value ? '#dcfce7' : '#fef2f2',
            color: params.value ? '#166534' : '#dc2626',
            border: params.value ? '1px solid #bbf7d0' : '1px solid #fecaca'
          }}>
            {params.value ? 'Yes' : 'No'}
          </Box>
        );
      } else if (columnType === 'number') {
        column.renderCell = (params) => {
          const value = params.value as number;
          if (columnName.toLowerCase().includes('price')) {
            return (
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                ${value?.toFixed(2)}
              </Typography>
            );
          }
          return (
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {value}
            </Typography>
          );
        };
      } else if (columnType === 'date') {
        column.renderCell = (params) => {
          const value = params.value as string;
          try {
            const date = new Date(value);
            return (
              <Typography variant="body2" color="text.secondary">
                {date.toLocaleDateString()}
              </Typography>
            );
          } catch {
            return <Typography variant="body2">{value}</Typography>;
          }
        };
      } else if (columnName.toLowerCase().includes('status')) {
        column.renderCell = (params) => {
          const status = params.value as string;
          if (!status) return null;
          
          const isActive = status?.toLowerCase().includes('active') || status?.toLowerCase().includes('completed');
          const isInactive = status?.toLowerCase().includes('inactive') || status?.toLowerCase().includes('failed') || status?.toLowerCase().includes('pending');
          
          // Define softer color scheme
          let chipStyles = {};
          
          if (isActive) {
            chipStyles = {
              backgroundColor: '#e8f5e8',
              color: '#2d5016',
              border: '1px solid #c3e6c3',
            };
          } else if (isInactive) {
            chipStyles = {
              backgroundColor: '#fdeaea',
              color: '#7d2f2f',
              border: '1px solid #f5c6c6',
            };
          } else {
            chipStyles = {
              backgroundColor: '#fff4e6',
              color: '#8b5a00',
              border: '1px solid #f0d0a0',
            };
          }
          
          return (
            <Chip
              label={status}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 1.5,
                fontSize: '0.75rem',
                fontWeight: 500,
                minWidth: '70px',
                textTransform: 'capitalize',
                ...chipStyles,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          );
        };
      }

      return column;
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 4,
        flexDirection: 'column',
        gap: 1
      }}>
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary">
          Loading dataset...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="medium">
          Error Loading Data
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Showing sample data instead.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with MongoDB Query Options */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 2, 
        gap: 2 
      }}>
        <Box sx={{ flex: 1 }}>
          {dataset && (
            <Alert severity="info" sx={{ borderRadius: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {dataset.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {dataset.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      size="small" 
                      label={`${data.length} rows`} 
                      sx={{ borderRadius: 0 }}
                    />
                    <Chip 
                      size="small" 
                      label={`${Object.keys(dataset.columns || {}).length} columns`}
                      sx={{ borderRadius: 0 }}
                    />
                    {mongoQueryResult && (
                      <Chip 
                        size="small" 
                        label="MongoDB Query"
                        color="primary"
                        icon={<Code fontSize="small" />}
                        sx={{ borderRadius: 0 }}
                      />
                    )}
                  </Box>
                </Box>
                {onMongoQueryOpen && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Code />}
                    onClick={onMongoQueryOpen}
                    sx={{ borderRadius: 0, ml: 2 }}
                  >
                    MongoDB Query
                  </Button>
                )}
              </Box>
            </Alert>
          )}
          {!dataset && onMongoQueryOpen && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Button
                variant="contained"
                startIcon={<Code />}
                onClick={onMongoQueryOpen}
                sx={{ borderRadius: 0 }}
              >
                Create MongoDB Query
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      <DataGrid
        rows={data}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        slots={enableFiltering ? { toolbar: GridToolbar } : undefined}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: enablePagination ? Math.min(maxRows, 25) : 100,
            },
          },
        }}
        pageSizeOptions={enablePagination ? [5, 10, 25, 50] : []}
        disableColumnFilter={!enableFiltering}
        disableColumnMenu={!enableSorting}
        sortingOrder={enableSorting ? ['asc', 'desc'] : []}
        sx={{
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 0,
          '& .MuiDataGrid-root': {
            borderRadius: 0,
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'grey.200',
            fontSize: '0.875rem',
            padding: '12px 16px',
            '&:focus': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            borderColor: 'grey.300',
            bgcolor: '#f8fafc',
            color: 'grey.700',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 0,
            '& .MuiDataGrid-columnHeader': {
              '&:focus': {
                outline: 'none',
              },
            },
          },
          '& .MuiDataGrid-row': {
            '&:nth-of-type(even)': {
              bgcolor: '#fafbfc',
            },
            '&:hover': {
              bgcolor: '#f1f5f9',
            },
            '&.Mui-selected': {
              bgcolor: '#e0f2fe',
              '&:hover': {
                bgcolor: '#b3e5fc',
              },
            },
          },
          '& .MuiDataGrid-footerContainer': {
            borderColor: 'grey.300',
            bgcolor: '#f8fafc',
            borderRadius: 0,
          },
          '& .MuiDataGrid-toolbar': {
            borderBottom: 1,
            borderColor: 'grey.300',
            bgcolor: '#ffffff',
            padding: '8px 16px',
          },
          '& .MuiDataGrid-virtualScroller': {
            bgcolor: '#ffffff',
          },
        }}
      />
    </Box>
  );
}
