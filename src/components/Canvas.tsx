import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Typography, TextField, Button, CardHeader, Chip } from '@mui/material';
import { ConnectedDataTable } from './ConnectedDataTable';
import { MongoQueryBuilder } from './MongoQueryBuilder';
import { AdvancedComponentRenderer } from './AdvancedComponentRenderer';
import type { UIComponent, MongoQueryResult } from '../types';
import type { LayoutOptions } from './LayoutSelector';

interface CanvasProps {
  components: UIComponent[];
  onComponentSelect?: (component: UIComponent) => void;
  onComponentResize?: (componentId: string, width: number, height: number) => void;
  layout?: LayoutOptions;
}

export function Canvas({ components, onComponentSelect, onComponentResize, layout }: CanvasProps) {
  const [showMongoQuery, setShowMongoQuery] = useState(false);
  const [mongoQueryResults, setMongoQueryResults] = useState<{ [componentId: string]: MongoQueryResult }>({});
  
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const handleComponentClick = (component: UIComponent) => {
    console.log('🎯 Canvas handleComponentClick called with:', component.type, component.name);
    console.log('🎯 onComponentSelect function exists:', !!onComponentSelect);
    console.log('🎯 Calling onComponentSelect...');
    onComponentSelect?.(component);
    console.log('🎯 onComponentSelect call completed');
  };

  const handleMongoQueryExecute = (componentId: string, result: MongoQueryResult) => {
    setMongoQueryResults(prev => ({
      ...prev,
      [componentId]: result
    }));
  };

  const handleMongoQueryOpen = (componentId: string) => {
    setShowMongoQuery(true);
    // Store which component triggered the query
    (window as any).currentQueryComponentId = componentId;
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{ 
        flexGrow: 1, 
        bgcolor: 'grey.50', 
        p: 4, 
        minHeight: '100vh', 
        position: 'relative', 
        overflow: 'auto' 
      }}
    >
      <Paper sx={{ 
        minHeight: '100%', 
        borderRadius: 0, 
        position: 'relative',
        elevation: 1
      }}>
        {components.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 400,
            flexDirection: 'column',
            textAlign: 'center'
          }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
              📋
            </Typography>
            <Typography variant="h5" fontWeight="medium" sx={{ mb: 1 }}>
              Start Building Your App
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Drag components from the left panel to start building your dynamic UI
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            p: 3, 
            display: layout?.type === 'columns' ? 'grid' : 'flex', 
            flexDirection: layout?.type === 'columns' ? undefined : 'column',
            gridTemplateColumns: layout?.type === 'columns' ? `repeat(${layout.columnCount}, 1fr)` : undefined,
            gap: layout?.spacing ? `${layout.spacing}px` : 3,
            alignItems: layout?.type === 'columns' ? 'start' : undefined
          }}>
            <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {components.map((component, index) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  index={index}
                  onClick={() => {
                    console.log('ComponentRenderer onClick prop called for:', component.type);
                    handleComponentClick(component);
                  }}
                  mongoQueryResult={mongoQueryResults[component.id]}
                  onMongoQueryOpen={(componentId: string) => handleMongoQueryOpen(componentId)}
                  onResize={onComponentResize}
                />
              ))}
            </SortableContext>
          </Box>
        )}
      </Paper>

      {/* MongoDB Query Builder Dialog */}
      <MongoQueryBuilder
        open={showMongoQuery}
        onClose={() => setShowMongoQuery(false)}
        onExecute={(result) => {
          const componentId = (window as any).currentQueryComponentId;
          if (componentId) {
            handleMongoQueryExecute(componentId, result);
          }
          setShowMongoQuery(false);
        }}
      />
    </Box>
  );
}

interface ComponentRendererProps {
  component: UIComponent;
  index: number;
  onClick: () => void;
  mongoQueryResult?: MongoQueryResult;
  onMongoQueryOpen: (componentId: string) => void;
  onResize?: (componentId: string, width: number, height: number) => void;
}

function ComponentRenderer({ 
  component, 
  index, 
  onClick, 
  mongoQueryResult, 
  onMongoQueryOpen,
  onResize
}: ComponentRendererProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [currentSize, setCurrentSize] = useState({
    width: component.width || 320,
    height: component.height || 240
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    data: {
      type: 'component',
      index,
    },
  });

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = currentSize.width;
    const startHeight = currentSize.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = Math.max(120, startWidth + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(120, startWidth - deltaX);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(80, startHeight + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(80, startHeight - deltaY);
      }

      setCurrentSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onResize?.(component.id, currentSize.width, currentSize.height);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderComponent = () => {
    // List of basic component types handled by the original logic
    const basicComponentTypes = ['table', 'form', 'button', 'text', 'card'];
    
    if (basicComponentTypes.includes(component.type)) {
      // Handle basic components with original logic
      switch (component.type) {
        case 'table':
          return (
            <Paper sx={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 2, 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardHeader 
                title={component.name}
                subheader={component.properties.datasetId ? 
                  `Connected to dataset ID: ${component.properties.datasetId}` : 
                  undefined
                }
                titleTypographyProps={{ variant: 'caption', fontWeight: 'medium', component: 'div' }}
                subheaderTypographyProps={{ variant: 'caption', fontSize: '0.7rem', component: 'div' }}
                sx={{ 
                  bgcolor: 'grey.50', 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 0.5,
                  px: 1,
                  minHeight: 'auto'
                }}
              />
              <Box sx={{ flex: 1, p: 1, overflow: 'hidden' }}>
                <ConnectedDataTable
                  datasetId={component.properties.datasetId}
                  enablePagination={component.properties.showPagination ?? true}
                  enableSorting={true}
                  enableFiltering={component.properties.showSearch ?? true}
                  maxRows={3}
                  mongoQueryResult={mongoQueryResult}
                  onMongoQueryOpen={() => onMongoQueryOpen(component.id)}
                />
              </Box>
            </Paper>
          );
        case 'form':
          return (
            <Paper sx={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ p: 2, flex: 1 }}>
                <Typography variant="caption" fontWeight="medium" sx={{ mb: 1.5, display: 'block' }}>
                  {component.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      Field 1
                    </Typography>
                    <TextField 
                      fullWidth
                      placeholder="Enter value..."
                      size="small"
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        } 
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      Field 2
                    </Typography>
                    <TextField 
                      fullWidth
                      placeholder="Enter value..."
                      size="small"
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        } 
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          );
        case 'button':
          return (
            <Paper sx={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Button variant="contained" size="small" sx={{ borderRadius: 1 }}>
                {component.name}
              </Button>
            </Paper>
          );
        case 'text':
          return (
            <Paper sx={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}>
              <Typography variant="body2" color="text.primary" textAlign="center">
                {component.name}
              </Typography>
            </Paper>
          );
        case 'card':
          return (
            <Paper sx={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              elevation: 1
            }}>
              <Box sx={{ p: 2, flex: 1 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  {component.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Card content goes here...
                </Typography>
              </Box>
            </Paper>
          );
      }
    }
    
    // For all advanced component types, use the AdvancedComponentRenderer
    return (
      <Paper sx={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <AdvancedComponentRenderer component={component} />
      </Paper>
    );
  };

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: currentSize.width,
        height: currentSize.height,
      }}
      {...attributes}
      onMouseDown={(e) => {
        // Apply drag listeners manually to control event handling
        if (listeners?.onMouseDown && !e.defaultPrevented) {
          listeners.onMouseDown(e);
        }
      }}
      onClick={(e) => {
        console.log('🎯 Box onClick triggered, isDragging:', isDragging, 'isResizing:', isResizing);
        // Only trigger selection if not dragging and not clicking on resize handles
        if (!isDragging && !isResizing) {
          const target = e.target as HTMLElement;
          console.log('🎯 Click target:', target.tagName, target.className);
          if (!target.closest('.resize-handle') && !target.closest('button')) {
            console.log('🎯 Calling onClick handler');
            e.stopPropagation();
            e.preventDefault();
            onClick();
          } else {
            console.log('Click ignored - target is resize handle or button');
          }
        } else {
          console.log('Click ignored - dragging or resizing');
        }
      }}
      sx={{
        position: 'relative',
        cursor: isDragging ? 'grabbing' : isResizing ? 'resizing' : 'grab',
        borderRadius: 2,
        transition: isDragging ? 'none' : 'all 0.2s ease-in-out',
        minWidth: 120,
        minHeight: 80,
        '&:hover': {
          '& .component-type-chip': {
            opacity: 1,
          },
          '& .resize-handle': {
            opacity: 1,
          },
          boxShadow: '0 0 0 2px',
          boxShadowColor: 'primary.main',
        },
        // Remove absolute positioning that was causing spacing issues
        // left: component.xPosition,
        // top: component.yPosition,
      }}
    >
      {renderComponent()}
      
      {/* Component Type Chip */}
      <Chip
        label={component.type}
        size="small"
        color="primary"
        className="component-type-chip"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
          borderTopLeftRadius: 0,
          borderBottomRightRadius: 0,
          fontSize: '0.75rem',
        }}
      />

      {/* Resize Handles */}
      {/* Bottom-right corner */}
      <Box
        className="resize-handle"
        onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 12,
          height: 12,
          backgroundColor: 'primary.main',
          cursor: 'nw-resize',
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
          '&:hover': {
            opacity: 1,
          },
        }}
      />

      {/* Right edge */}
      <Box
        className="resize-handle"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 4,
          height: '100%',
          cursor: 'ew-resize',
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: 0.3,
          },
        }}
      />

      {/* Bottom edge */}
      <Box
        className="resize-handle"
        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 4,
          cursor: 'ns-resize',
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: 0.3,
          },
        }}
      />
    </Box>
  );
}
