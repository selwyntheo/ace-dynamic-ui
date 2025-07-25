import { useState, useEffect, useCallback } from 'react';
import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  DialogActions
} from '@mui/material';
import { 
  PlayArrow, 
  Settings, 
  Add, 
  ViewColumn,
  Save,
  FolderOpen,
  MoreVert
} from '@mui/icons-material';
import { ComponentPanel } from './components/ComponentPanel';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TemplateSelector } from './components/TemplateSelector';
import { LayoutSelector, type LayoutOptions } from './components/LayoutSelector';
import { useAppStore } from './stores/appStore';
import { type Template } from './templates';
import { generateId } from './utils/id';
import type { UIComponent, ComponentType } from './types';
import { pageService } from './services/pageService';

function App() {
  const { 
    components, 
    addComponent, 
    updateComponent, 
    removeComponent,
    reorderComponents
  } = useAppStore();

  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null);
  const [isBuilderMode, setBuilderMode] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [componentPanelCollapsed, setComponentPanelCollapsed] = useState(false);
  
  // Page management state
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentPageName, setCurrentPageName] = useState<string>('Untitled Page');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [savePageName, setSavePageName] = useState('');
  const [savePageDescription, setSavePageDescription] = useState('');
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  const [currentLayout, setCurrentLayout] = useState<LayoutOptions>({
    type: 'single',
    sidebarWidth: 280,
    columnCount: 2,
    spacing: 16,
    showHeader: true,
    showFooter: false,
  });

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (currentPageId && components.length > 0) {
      try {
        await pageService.updatePage(currentPageId, {
          name: currentPageName,
          description: 'Auto-saved page',
          components: components.map(comp => ({
            id: comp.id,
            type: comp.type,
            name: comp.name,
            properties: comp.properties,
            xPosition: comp.xPosition,
            yPosition: comp.yPosition,
            width: comp.width,
            height: comp.height,
            createdAt: comp.createdAt,
            updatedAt: new Date().toISOString()
          })),
          layout: currentLayout
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  }, [currentPageId, currentPageName, components, currentLayout]);

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [autoSave]);

  // Load available pages on mount
  useEffect(() => {
    loadAvailablePages();
  }, []);

  const loadAvailablePages = async () => {
    try {
      const pages = await pageService.getAllPages();
      setAvailablePages(pages);
    } catch (error) {
      console.error('Failed to load pages:', error);
    }
  };

  useEffect(() => {
    console.log('🔍 selectedComponent changed to:', selectedComponent?.type || 'null');
    console.log('🔍 showProperties will be set to:', !!selectedComponent);
    setShowProperties(!!selectedComponent);
  }, [selectedComponent]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle component panel with Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        setComponentPanelCollapsed(!componentPanelCollapsed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [componentPanelCollapsed]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle component reordering within canvas
    if (active.data.current?.type === 'component' && over.id !== 'canvas') {
      const activeIndex = active.data.current?.index;
      const overIndex = over.data.current?.index;
      
      if (activeIndex !== undefined && overIndex !== undefined && activeIndex !== overIndex) {
        reorderComponents(activeIndex, overIndex);
      }
      return;
    }

    // Handle dropping new components from panel to canvas
    if (over.id === 'canvas') {
      // Handle new component creation from panel
      const componentType = active.data.current?.type as ComponentType;
      if (componentType && active.data.current?.type !== 'component') {
        // Set default properties based on component type
        let defaultProperties = {};
        if (componentType === 'table') {
          defaultProperties = {
            datasetId: '6882fa61f4439e5691890c75', // Default to Users dataset (first valid one)
            showPagination: true,
            showSearch: true,
            pageSize: '10'
          };
        }

        const newComponent: UIComponent = {
          id: generateId(),
          type: componentType,
          name: `${componentType.charAt(0).toUpperCase() + componentType.slice(1)} ${components.length + 1}`,
          properties: defaultProperties,
          xPosition: 0,
          yPosition: 0,
          width: undefined,
          height: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addComponent(newComponent);
      }
    }
  };

  const handleTemplateSelect = (template: Template) => {
    // Clear existing components first
    components.forEach(component => {
      removeComponent(component.id);
    });

    // Add template components
    const newComponents = template.components.map((comp) => ({
      ...comp,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Add new components
    newComponents.forEach(component => {
      addComponent(component);
    });
  };

  const handleLayoutChange = (layout: LayoutOptions) => {
    setCurrentLayout(layout);
    // Apply layout changes to components if needed
    // This is where you could implement actual layout transformations
  };

  const handleComponentSelect = (component: UIComponent) => {
    console.log('🔍 handleComponentSelect called with:', component.type, component.name);
    console.log('🔍 Setting selectedComponent state...');
    setSelectedComponent(component);
  };

  const handleComponentUpdate = (updatedComponent: UIComponent) => {
    updateComponent(updatedComponent.id, updatedComponent);
    setSelectedComponent(updatedComponent);
  };

  const handleComponentResize = (componentId: string, width: number, height: number) => {
    updateComponent(componentId, { width, height });
  };

  const handlePropertiesClose = () => {
    setSelectedComponent(null);
    setShowProperties(false);
  };

  // Page management handlers
  const handleSavePage = async () => {
    if (!savePageName.trim()) {
      setSnackbarMessage('Please enter a page name');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const pageData = {
        name: savePageName,
        description: savePageDescription || 'A saved page',
        components: components.map(comp => ({
          id: comp.id,
          type: comp.type,
          name: comp.name,
          properties: comp.properties,
          xPosition: comp.xPosition,
          yPosition: comp.yPosition,
          width: comp.width,
          height: comp.height,
          createdAt: comp.createdAt,
          updatedAt: new Date().toISOString()
        })),
        layout: currentLayout
      };

      const savedPage = await pageService.createPage(pageData);
      setCurrentPageId(savedPage.id || null);
      setCurrentPageName(savedPage.name);
      setShowSaveDialog(false);
      setSavePageName('');
      setSavePageDescription('');
      setSnackbarMessage('Page saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await loadAvailablePages();
    } catch (error) {
      setSnackbarMessage('Failed to save page');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Save failed:', error);
    }
  };

  const handleLoadPage = async (pageId: string) => {
    try {
      const page = await pageService.getPageById(pageId);
      
      // Clear existing components
      components.forEach(component => {
        removeComponent(component.id);
      });

      // Load page components
      if (page.components) {
        page.components.forEach((comp: any) => {
          addComponent({
            id: comp.id,
            type: comp.type,
            name: comp.name,
            properties: comp.properties,
            xPosition: comp.xPosition,
            yPosition: comp.yPosition,
            width: comp.width,
            height: comp.height,
            createdAt: comp.createdAt,
            updatedAt: comp.updatedAt
          });
        });
      }

      // Set layout
      if (page.layout) {
        setCurrentLayout(page.layout);
      }

      setCurrentPageId(page.id || null);
      setCurrentPageName(page.name);
      setShowLoadDialog(false);
      setSnackbarMessage(`Loaded page: ${page.name}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to load page');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Load failed:', error);
    }
  };

  const handleNewPage = () => {
    // Clear existing components
    components.forEach(component => {
      removeComponent(component.id);
    });
    
    // Reset to default layout
    setCurrentLayout({
      type: 'single',
      sidebarWidth: 280,
      columnCount: 2,
      spacing: 16,
      showHeader: true,
      showFooter: false,
    });

    setCurrentPageId(null);
    setCurrentPageName('Untitled Page');
    setSnackbarMessage('New page created');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header App Bar */}
      <AppBar position="static" sx={{ 
        zIndex: 1200,
        bgcolor: 'grey.900',
        '& .MuiToolbar-root': {
          bgcolor: 'grey.900'
        }
      }}>
        <Toolbar sx={{ bgcolor: 'grey.900' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', mr: 2, color: 'white' }}>
              Dynamic UI Builder
            </Typography>
            <Typography variant="body2" sx={{ 
              fontStyle: 'italic',
              px: 2,
              py: 0.5,
              backgroundColor: 'grey.700',
              color: 'grey.100',
              borderRadius: 1
            }}>
              {currentPageName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Save />}
              onClick={() => setShowSaveDialog(true)}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 0,
                borderColor: 'grey.400',
                color: 'grey.100',
                '&:hover': {
                  borderColor: 'grey.300',
                  bgcolor: 'grey.800'
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FolderOpen />}
              onClick={() => {
                loadAvailablePages();
                setShowLoadDialog(true);
              }}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 0,
                borderColor: 'grey.400',
                color: 'grey.100',
                '&:hover': {
                  borderColor: 'grey.300',
                  bgcolor: 'grey.800'
                }
              }}
            >
              Load
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MoreVert />}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 0,
                borderColor: 'grey.400',
                color: 'grey.100',
                '&:hover': {
                  borderColor: 'grey.300',
                  bgcolor: 'grey.800'
                }
              }}
            >
              More
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => setShowTemplateSelector(true)}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 0,
                borderColor: 'grey.400',
                color: 'grey.100',
                '&:hover': {
                  borderColor: 'grey.300',
                  bgcolor: 'grey.800'
                }
              }}
            >
              Templates
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ViewColumn />}
              onClick={() => setShowLayoutSelector(true)}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 0,
                borderColor: 'grey.400',
                color: 'grey.100',
                '&:hover': {
                  borderColor: 'grey.300',
                  bgcolor: 'grey.800'
                }
              }}
            >
              Layout
            </Button>
            <Button
              variant={isBuilderMode ? "contained" : "outlined"}
              size="small"
              startIcon={<Settings />}
              onClick={() => setBuilderMode(true)}
              sx={{ 
                textTransform: 'none',
                ...(isBuilderMode ? {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                } : {
                  borderColor: 'grey.400',
                  color: 'grey.100',
                  '&:hover': {
                    borderColor: 'grey.300',
                    bgcolor: 'grey.800'
                  }
                })
              }}
            >
              Builder
            </Button>
            <Button
              variant={!isBuilderMode ? "contained" : "outlined"}
              size="small"
              startIcon={<PlayArrow />}
              onClick={() => setBuilderMode(false)}
              sx={{ 
                textTransform: 'none',
                ...(!isBuilderMode ? {
                  bgcolor: 'success.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'success.dark'
                  }
                } : {
                  borderColor: 'grey.400',
                  color: 'grey.100',
                  '&:hover': {
                    borderColor: 'grey.300',
                    bgcolor: 'grey.800'
                  }
                })
              }}
            >
              Preview
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'grey.300' }}>
            {components.length} component{components.length !== 1 ? 's' : ''}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Always visible debug panel */}
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '10px',
          background: 'lime',
          color: 'black',
          padding: '15px',
          zIndex: 99999,
          border: '3px solid blue',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          <div>🔍 ALWAYS VISIBLE DEBUG:</div>
          <div>isBuilderMode: {String(isBuilderMode)}</div>
          <div>showProperties: {String(showProperties)}</div>
          <div>selectedComponent: {selectedComponent?.type || 'null'}</div>
          <div>components.length: {components.length}</div>
          <button 
            onClick={() => {
              console.log('🧪 TEST: Manual selection of first component');
              if (components.length > 0) {
                handleComponentSelect(components[0]);
              }
            }}
            style={{ marginTop: '10px', padding: '5px', background: 'yellow' }}
          >
            TEST: Select First Component
          </button>
        </div>
        
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          {isBuilderMode && (
            <ComponentPanel 
              collapsed={componentPanelCollapsed}
              onToggleCollapse={() => setComponentPanelCollapsed(!componentPanelCollapsed)}
            />
          )}
          
          <Canvas
            components={components}
            onComponentSelect={handleComponentSelect}
            onComponentResize={handleComponentResize}
            layout={currentLayout}
          />
          
          {isBuilderMode && showProperties && (
            <>
              <div style={{
                position: 'fixed',
                top: '200px',
                left: '10px',
                background: 'orange',
                color: 'black',
                padding: '10px',
                zIndex: 99999,
                border: '2px solid red'
              }}>
                🔍 DEBUG: showProperties={String(showProperties)}, selectedComponent={selectedComponent?.type || 'null'}
              </div>
              <PropertiesPanel
                component={selectedComponent}
                onClose={handlePropertiesClose}
                onUpdate={handleComponentUpdate}
              />
            </>
          )}
        </DndContext>

        {/* Template Selector Dialog */}
        <TemplateSelector
          open={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelectTemplate={(template: Template) => {
            handleTemplateSelect(template);
            setShowTemplateSelector(false);
          }}
        />

        {/* Layout Selector Dialog */}
        <LayoutSelector
          open={showLayoutSelector}
          onClose={() => setShowLayoutSelector(false)}
          onApplyLayout={(layout: LayoutOptions) => {
            handleLayoutChange(layout);
            setShowLayoutSelector(false);
          }}
          currentLayout={currentLayout}
        />

        {/* Page Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => {
            handleNewPage();
            setMenuAnchor(null);
          }}>
            New Page
          </MenuItem>
          <MenuItem onClick={() => {
            if (currentPageId) {
              // Duplicate current page
              setSavePageName(`Copy of ${currentPageName}`);
              setSavePageDescription('');
              setShowSaveDialog(true);
            }
            setMenuAnchor(null);
          }}>
            Duplicate Page
          </MenuItem>
        </Menu>

        {/* Save Page Dialog */}
        <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Save Page</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Page Name"
              fullWidth
              variant="outlined"
              value={savePageName}
              onChange={(e) => setSavePageName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={savePageDescription}
              onChange={(e) => setSavePageDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSavePage} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Load Page Dialog */}
        <Dialog open={showLoadDialog} onClose={() => setShowLoadDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Load Page</DialogTitle>
          <DialogContent>
            {availablePages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No saved pages found. Create and save a page first.
              </Typography>
            ) : (
              <List>
                {availablePages.map((page) => (
                  <ListItem key={page.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleLoadPage(page.id)}
                      sx={{ borderRadius: 1, mb: 1 }}
                    >
                      <ListItemText
                        primary={page.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {page.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Components: {page.components?.length || 0} • 
                              Layout: {page.layout?.type || 'single'} • 
                              {page.isPublished ? 'Published' : 'Draft'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowLoadDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
