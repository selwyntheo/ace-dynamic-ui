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
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Switch
} from '@mui/material';
import { Close, ViewColumn, ViewStream, ViewQuilt } from '@mui/icons-material';

export interface LayoutOptions {
  type: 'single' | 'sidebar' | 'columns';
  sidebarWidth: number;
  columnCount: number;
  spacing: number;
  showHeader: boolean;
  showFooter: boolean;
}

interface LayoutSelectorProps {
  open: boolean;
  onClose: () => void;
  onApplyLayout: (layout: LayoutOptions) => void;
  currentLayout: LayoutOptions;
}

const layoutTypes = [
  {
    value: 'single' as const,
    label: 'Single Column',
    description: 'Full-width single column layout',
    icon: ViewStream,
  },
  {
    value: 'sidebar' as const,
    label: 'Sidebar Layout',
    description: 'Main content with sidebar',
    icon: ViewColumn,
  },
  {
    value: 'columns' as const,
    label: 'Multi-Column',
    description: 'Multiple column grid layout',
    icon: ViewQuilt,
  },
];

export function LayoutSelector({ open, onClose, onApplyLayout, currentLayout }: LayoutSelectorProps) {
  const [layout, setLayout] = useState<LayoutOptions>(currentLayout);

  const handleApply = () => {
    onApplyLayout(layout);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 0, minHeight: '60vh' }
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
        <Typography variant="h5" fontWeight="bold">
          Layout Options
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Layout Type Selection */}
          <FormControl>
            <FormLabel sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
              Layout Type
            </FormLabel>
            <RadioGroup
              value={layout.type}
              onChange={(e) => setLayout({ ...layout, type: e.target.value as LayoutOptions['type'] })}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                {layoutTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.value}
                      sx={{
                        border: 2,
                        borderColor: layout.type === type.value ? 'primary.main' : 'grey.300',
                        borderRadius: 0,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                        }
                      }}
                      onClick={() => setLayout({ ...layout, type: type.value })}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <FormControlLabel
                          value={type.value}
                          control={<Radio sx={{ display: 'none' }} />}
                          label={
                            <Box>
                              <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                              <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                {type.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {type.description}
                              </Typography>
                            </Box>
                          }
                          sx={{ m: 0 }}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </RadioGroup>
          </FormControl>

          {/* Layout Options */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {/* Sidebar Width (if sidebar layout) */}
            {layout.type === 'sidebar' && (
              <FormControl>
                <FormLabel sx={{ mb: 2 }}>Sidebar Width</FormLabel>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={layout.sidebarWidth}
                    onChange={(_, value) => setLayout({ ...layout, sidebarWidth: value as number })}
                    min={200}
                    max={400}
                    step={20}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}px`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Current: {layout.sidebarWidth}px
                  </Typography>
                </Box>
              </FormControl>
            )}

            {/* Column Count (if multi-column layout) */}
            {layout.type === 'columns' && (
              <FormControl>
                <FormLabel sx={{ mb: 2 }}>Number of Columns</FormLabel>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={layout.columnCount}
                    onChange={(_, value) => setLayout({ ...layout, columnCount: value as number })}
                    min={2}
                    max={4}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                      { value: 4, label: '4' },
                    ]}
                  />
                </Box>
              </FormControl>
            )}

            {/* Spacing */}
            <FormControl>
              <FormLabel sx={{ mb: 2 }}>Component Spacing</FormLabel>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={layout.spacing}
                  onChange={(_, value) => setLayout({ ...layout, spacing: value as number })}
                  min={8}
                  max={32}
                  step={4}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
                <Typography variant="caption" color="text.secondary">
                  Current: {layout.spacing}px
                </Typography>
              </Box>
            </FormControl>
          </Box>

          {/* Header and Footer Options */}
          <Box>
            <FormLabel sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600, display: 'block' }}>
              Additional Options
            </FormLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={layout.showHeader}
                    onChange={(e) => setLayout({ ...layout, showHeader: e.target.checked })}
                  />
                }
                label="Show Header"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={layout.showFooter}
                    onChange={(e) => setLayout({ ...layout, showFooter: e.target.checked })}
                  />
                }
                label="Show Footer"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 0 }}>
          Cancel
        </Button>
        <Button onClick={handleApply} variant="contained" sx={{ borderRadius: 0 }}>
          Apply Layout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
