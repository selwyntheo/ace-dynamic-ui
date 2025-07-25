import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Slider,
  Rating,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link,
  Avatar,
  IconButton
} from '@mui/material';
import {
  DatePicker,
  TimePicker,
  DateTimePicker
} from '@mui/x-date-pickers';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Upload,
  Home,
  FilterList,
  ExpandMore,
  ExpandLess,
  Code,
  KeyboardArrowRight
} from '@mui/icons-material';
import type { UIComponent } from '../types';

interface AdvancedComponentRendererProps {
  component: UIComponent;
  onClick?: () => void;
}

// Sample chart data
const sampleBarData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 }
];

const samplePieData = [
  { name: 'Desktop', value: 400, fill: '#0088FE' },
  { name: 'Mobile', value: 300, fill: '#00C49F' },
  { name: 'Tablet', value: 200, fill: '#FFBB28' },
  { name: 'Other', value: 100, fill: '#FF8042' }
];

const sampleJsonData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", active: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", active: false }
  ],
  metadata: {
    total: 2,
    lastUpdated: "2024-01-15T10:30:00Z"
  }
};

export function AdvancedComponentRenderer({ component, onClick }: AdvancedComponentRendererProps) {
  const [value, setValue] = useState<any>(component.properties.defaultValue || '');
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const renderComponent = () => {
    switch (component.type) {
      case 'date-picker':
        return (
          <DatePicker
            label={component.properties.label || 'Select Date'}
            value={selectedDate}
            onChange={(newValue: Date | null) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                sx: { '& .MuiOutlinedInput-root': { borderRadius: 0 } }
              }
            }}
          />
        );

      case 'time-picker':
        return (
          <TimePicker
            label={component.properties.label || 'Select Time'}
            value={selectedDate}
            onChange={(newValue: Date | null) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                sx: { '& .MuiOutlinedInput-root': { borderRadius: 0 } }
              }
            }}
          />
        );

      case 'datetime-picker':
        return (
          <DateTimePicker
            label={component.properties.label || 'Select Date & Time'}
            value={selectedDate}
            onChange={(newValue: Date | null) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                sx: { '& .MuiOutlinedInput-root': { borderRadius: 0 } }
              }
            }}
          />
        );

      case 'number-input':
        return (
          <TextField
            type="number"
            label={component.properties.label || 'Number Input'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            variant="outlined"
            fullWidth
            inputProps={{
              min: component.properties.min || 0,
              max: component.properties.max || 100,
              step: component.properties.step || 1
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        );

      case 'textarea':
        return (
          <TextField
            label={component.properties.label || 'Text Area'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={component.properties.rows || 4}
            placeholder={component.properties.placeholder || 'Enter text here...'}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
          />
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={value}
                onChange={(e) => setValue(e.target.checked)}
                sx={{ '&.Mui-checked': { color: component.properties.color || 'primary.main' } }}
              />
            }
            label={component.properties.label || 'Checkbox'}
          />
        );

      case 'radio-group':
        return (
          <FormControl component="fieldset">
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.properties.label || 'Radio Group'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              {(component.properties.options || ['Option 1', 'Option 2', 'Option 3']).map((option: string) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={(e) => setValue(e.target.checked)}
                color={component.properties.color || 'primary'}
              />
            }
            label={component.properties.label || 'Switch'}
          />
        );

      case 'slider':
        return (
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.properties.label || 'Slider'}: {value}
            </Typography>
            <Slider
              value={value || 50}
              onChange={(_, newValue) => setValue(newValue)}
              min={component.properties.min || 0}
              max={component.properties.max || 100}
              step={component.properties.step || 1}
              marks={component.properties.showMarks}
              valueLabelDisplay="auto"
            />
          </Box>
        );

      case 'rating':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.properties.label || 'Rating'}
            </Typography>
            <Rating
              value={value || 0}
              onChange={(_, newValue) => setValue(newValue)}
              max={component.properties.max || 5}
              size={component.properties.size || 'medium'}
            />
          </Box>
        );

      case 'data-filter':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FilterList />
                <Typography variant="h6">Data Filter</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  size="small"
                  label="Search"
                  placeholder="Filter data..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select value="" label="Category" sx={{ borderRadius: 0 }}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" sx={{ borderRadius: 0 }}>Apply</Button>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="Status: Active" 
                  onDelete={() => {}} 
                  size="small" 
                  sx={{ 
                    borderRadius: 1.5,
                    backgroundColor: '#e8f5e8',
                    color: '#2d5016',
                    border: '1px solid #c3e6c3',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }} 
                />
                <Chip 
                  label="Date: Last 30 days" 
                  onDelete={() => {}} 
                  size="small" 
                  sx={{ 
                    borderRadius: 1.5,
                    backgroundColor: '#f0f9ff',
                    color: '#1e3a8a',
                    border: '1px solid #bfdbfe',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        );

      case 'json-explorer':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Code />
                <Typography variant="h6">JSON Explorer</Typography>
                <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 0,
                  maxHeight: expanded ? 400 : 150,
                  overflow: 'auto',
                  transition: 'max-height 0.3s ease'
                }}
              >
                <pre style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  {JSON.stringify(component.properties.data || sampleJsonData, null, 2)}
                </pre>
              </Paper>
            </CardContent>
          </Card>
        );

      case 'key-value':
        const keyValueData = component.properties.data || {
          'User ID': '12345',
          'Name': 'John Doe',
          'Email': 'john@example.com',
          'Status': 'Active',
          'Last Login': '2024-01-15 10:30:00'
        };
        
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Key-Value Pairs</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(keyValueData).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                      {key}:
                    </Typography>
                    <Typography variant="body2">
                      {String(value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        );

      case 'bar-chart':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Bar Chart</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={component.properties.data || sampleBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={component.properties.color || '#8884d8'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case 'line-chart':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Line Chart</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={component.properties.data || sampleBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={component.properties.color || '#8884d8'}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case 'pie-chart':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Pie Chart</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={component.properties.data || samplePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(component.properties.data || samplePieData).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case 'area-chart':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Area Chart</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={component.properties.data || sampleBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={component.properties.color || '#8884d8'}
                    fill={component.properties.color || '#8884d8'}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );

      case 'navigation':
        return (
          <Paper sx={{ borderRadius: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.dark' }}>
                <Home />
              </Avatar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {component.properties.title || 'App Name'}
              </Typography>
              <Button color="inherit" sx={{ borderRadius: 0 }}>Menu</Button>
              <Button color="inherit" sx={{ borderRadius: 0 }}>Profile</Button>
            </Box>
          </Paper>
        );

      case 'breadcrumb':
        return (
          <Box sx={{ p: 2 }}>
            <Breadcrumbs separator={<KeyboardArrowRight fontSize="small" />}>
              <Link color="inherit" href="#" underline="hover">
                Home
              </Link>
              <Link color="inherit" href="#" underline="hover">
                Category
              </Link>
              <Typography color="text.primary">Current Page</Typography>
            </Breadcrumbs>
          </Box>
        );

      case 'tabs':
        return (
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Tab 1" sx={{ borderRadius: 0 }} />
              <Tab label="Tab 2" sx={{ borderRadius: 0 }} />
              <Tab label="Tab 3" sx={{ borderRadius: 0 }} />
            </Tabs>
            <Box sx={{ p: 3 }}>
              <Typography>Content for Tab {tabValue + 1}</Typography>
            </Box>
          </Box>
        );

      case 'stepper':
        const steps = component.properties.steps || ['Step 1', 'Step 2', 'Step 3'];
        return (
          <Box sx={{ width: '100%', p: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label: string) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                sx={{ borderRadius: 0 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveStep(prev => prev + 1)}
                disabled={activeStep === steps.length - 1}
                sx={{ borderRadius: 0 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );

      case 'progress':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {component.properties.label || 'Progress'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={component.properties.value || 65}
              sx={{ height: 8, borderRadius: 0 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {component.properties.value || 65}% Complete
            </Typography>
          </Box>
        );

      case 'file-upload':
        return (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 0,
              p: 4,
              textAlign: 'center',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
          >
            <Upload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Drop files here or click to upload
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supports: {component.properties.accepts || 'JPG, PNG, PDF'}
            </Typography>
            <Button variant="contained" sx={{ borderRadius: 0 }}>
              Choose Files
            </Button>
          </Box>
        );

      case 'image':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={component.properties.src || 'https://via.placeholder.com/300x200?text=Sample+Image'}
              alt={component.properties.alt || 'Sample Image'}
              style={{
                maxWidth: '100%',
                height: component.properties.height || 'auto',
                borderRadius: 0
              }}
            />
            {component.properties.caption && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {component.properties.caption}
              </Typography>
            )}
          </Box>
        );

      case 'video':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <video
              controls
              style={{
                maxWidth: '100%',
                height: component.properties.height || 'auto',
                borderRadius: 0
              }}
            >
              <source src={component.properties.src || ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {component.properties.caption && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                {component.properties.caption}
              </Typography>
            )}
          </Box>
        );

      case 'map':
        return (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Map Component</Typography>
              <Box
                sx={{
                  height: 300,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 0
                }}
              >
                <Typography color="text.secondary">
                  Map integration placeholder
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Component type "{component.type}" not yet implemented
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box onClick={onClick} sx={{ cursor: 'pointer' }}>
      {renderComponent()}
    </Box>
  );
}
