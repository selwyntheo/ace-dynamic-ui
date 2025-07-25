import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Tab,
  Tabs,
  IconButton
} from '@mui/material';
import { Close, Dashboard, TableView, Description, ViewColumn } from '@mui/icons-material';
import { templates, type Template } from '../templates';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const categoryIcons = {
  dashboard: Dashboard,
  table: TableView,
  form: Description,
  layout: ViewColumn,
};

const categoryLabels = {
  dashboard: 'Dashboards',
  table: 'Data Tables',
  form: 'Forms',
  layout: 'Layouts',
};

export function TemplateSelector({ open, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Template['category'] | 'all'>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 0, minHeight: '70vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2
      }}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Choose a Template
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, value) => setSelectedCategory(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 3, pt: 2 }}
          >
            <Tab label="All Templates" value="all" />
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <Tab
                  key={key}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon fontSize="small" />
                      {label}
                    </Box>
                  }
                  value={key}
                />
              );
            })}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 3 
          }}>
            {filteredTemplates.map((template) => {
              const Icon = categoryIcons[template.category];
              return (
                <Card 
                  key={template.id}
                  sx={{ 
                    height: '100%',
                    borderRadius: 0,
                    border: 1,
                    borderColor: 'grey.200',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 2,
                    }
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Icon color="primary" fontSize="small" />
                      <Chip 
                        label={categoryLabels[template.category]} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                      {template.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {template.components.length} component{template.components.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      fullWidth
                      sx={{ borderRadius: 0 }}
                    >
                      Use Template
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>

          {filteredTemplates.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 200,
              flexDirection: 'column'
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try selecting a different category
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 0 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}