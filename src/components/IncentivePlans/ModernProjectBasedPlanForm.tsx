import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
  alpha,
  FormHelperText
} from '@mui/material';
import {
  Help as HelpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  PeriodType,
  IncentiveCalculationType,
  CurrencyType
} from '../../core/models/incentivePlanTypes';

import type {ProjectBasedIncentivePlan,Project} from '../../core/models/incentivePlanTypes';
import CreateProjectDialog from '../Projects/CreateProjectDialog';
import projectService from '../../infrastructure/projects/ProjectServiceImpl';

interface ModernProjectBasedPlanFormProps {
  initialData?: ProjectBasedIncentivePlan;
}

const ModernProjectBasedPlanForm: React.FC<ModernProjectBasedPlanFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id || !!initialData;

  // Form state
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [projectId, setProjectId] = useState('');
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');
  const [currencyType, setCurrencyType] = useState<CurrencyType>(CurrencyType.Rupees);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Available projects for dropdown
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  // Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        console.log('Fetching projects for dropdown...');
        const projects = await projectService.getProjects();
        console.log('Projects fetched:', projects);
        setAvailableProjects(projects || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Populate form with initial data if in edit mode
  useEffect(() => {
    if (initialData) {
      populateFormWithPlanData(initialData);
    } else if (isEditMode && id) {
      fetchPlanData(id);
    }
  }, [initialData, isEditMode, id]);

  const fetchPlanData = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching project-based plan with ID: ${planId}`);
      const response = await incentivePlanService.getProjectBasedPlanById(planId);

      if (response.succeeded) {
        console.log('Successfully fetched plan data:', response.data);
        populateFormWithPlanData(response.data);
      } else {
        console.error('API returned error:', response.message);
        setError(response.message || 'Failed to fetch incentive plan details');
      }
    } catch (err: any) {
      console.error('Error fetching incentive plan details:', err);
      setError(err.message || 'An error occurred while fetching incentive plan details');
    } finally {
      setLoading(false);
    }
  };

  const populateFormWithPlanData = (data: ProjectBasedIncentivePlan) => {
    setPlanName(data.planName || '');
    setPeriodType(data.periodType || PeriodType.Monthly);
    setIsActive(data.isActive !== undefined ? data.isActive : true);
    setProjectId(data.projectId || '');
    setCalculationType(data.calculationType || IncentiveCalculationType.FixedAmount);
    setIncentiveValue(data.incentiveValue !== undefined ? data.incentiveValue : '');
    setCurrencyType(data.currencyType || CurrencyType.Rupees);

    if (data.startDate) {
      setStartDate(new Date(data.startDate));
    }

    if (data.endDate) {
      setEndDate(new Date(data.endDate));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!planName.trim()) {
      errors.planName = 'Plan name is required';
    }

    if (!projectId) {
      errors.projectId = 'Project is required';
    }

    if (incentiveValue === '') {
      errors.incentiveValue = 'Incentive value is required';
    } else if (typeof incentiveValue === 'number' && incentiveValue <= 0) {
      errors.incentiveValue = 'Incentive value must be greater than 0';
    }

    if (calculationType === IncentiveCalculationType.PercentageOnTarget &&
        typeof incentiveValue === 'number' && incentiveValue > 100) {
      errors.incentiveValue = 'Percentage cannot exceed 100%';
    }

    if (periodType === PeriodType.Custom) {
      if (!startDate) {
        errors.startDate = 'Start date is required for custom period';
      }

      if (!endDate) {
        errors.endDate = 'End date is required for custom period';
      } else if (startDate && endDate && endDate < startDate) {
        errors.endDate = 'End date must be after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const planData: any = {
        planName,
        periodType,
        isActive,
        projectId,
        calculationType,
        incentiveValue: incentiveValue as number,
        currencyType,
        startDate: periodType === PeriodType.Custom && startDate ? startDate.toISOString() : undefined,
        endDate: periodType === PeriodType.Custom && endDate ? endDate.toISOString() : undefined,
        // Add required fields for the API
        planType: 'ProjectBased',
        metricType: 'BookingValue',
        targetValue: 0,
        isCumulative: false // Setting to false as per requirement to remove this option
      };

      let response;

      if (isEditMode && id) {
        console.log('Updating project-based plan with ID:', id);
        console.log('Update payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/incentive-plans/project-based/${id}`);

        try {
          // For updating, use the type-specific endpoint
          response = await incentivePlanService.updateProjectBasedPlan(id, planData);
          console.log('Update response:', response);
        } catch (updateError: any) {
          console.error('Error in updateProjectBasedPlan:', updateError);
          console.error('Error response:', updateError.response?.data);
          throw updateError;
        }
      } else {
        console.log('Creating new project-based plan');
        console.log('Create payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/incentive-plans/project-based`);
        response = await incentivePlanService.createProjectBasedPlan(planData);
      }

      if (response.succeeded) {
        setSuccess(`Incentive plan ${isEditMode ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/incentive-plans');
        }, 1500);
      } else {
        setError(response.message || `Failed to ${isEditMode ? 'update' : 'create'} incentive plan`);
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} incentive plan:`, err);
      setError(err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the incentive plan`);
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (text: string) => (
    <Tooltip title={text} arrow placement="top">
      <HelpIcon fontSize="small" color="action" sx={{ ml: 1, verticalAlign: 'middle' }} />
    </Tooltip>
  );

  const handleProjectCreated = (newProject: Project) => {
    setAvailableProjects(prev => [...prev, newProject]);
    setProjectId(newProject.id);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {isEditMode ? 'Edit' : 'Create'} Project-Based Incentive Plan
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
            {success}
          </Alert>
        )}

        {/* Basic Information Card */}
        <Card
          elevation={0}
          sx={{
            p: 0,
            mb: 3,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha('#000', 0.1)
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              Basic Information
              {renderTooltip('General information about the incentive plan')}
            </Typography>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Plan Name *"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                error={!!formErrors.planName}
                helperText={formErrors.planName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00b8a9',
                    },
                  }
                }}
              />

              <FormControl fullWidth error={!!formErrors.periodType}>
                <InputLabel>Period Type *</InputLabel>
                <Select
                  value={periodType}
                  label="Period Type *"
                  onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: '250px', // Wider dropdown menu
                        maxHeight: '300px' // Taller dropdown for more options
                      }
                    }
                  }}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '& .MuiSelect-select': {
                      minWidth: '150px', // Ensure the selected value has enough space
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                >
                  <MenuItem value={PeriodType.Monthly}>Monthly</MenuItem>
                  <MenuItem value={PeriodType.Quarterly}>Quarterly</MenuItem>
                  <MenuItem value={PeriodType.HalfYearly}>Half-Yearly</MenuItem>
                  <MenuItem value={PeriodType.Yearly}>Yearly</MenuItem>
                  <MenuItem value={PeriodType.Custom}>Custom</MenuItem>
                </Select>
                {formErrors.periodType && <FormHelperText>{formErrors.periodType}</FormHelperText>}
              </FormControl>

              {periodType === PeriodType.Custom && (
                <>
                  <TextField
                    fullWidth
                    label="Start Date *"
                    type="date"
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setStartDate(date);
                    }}
                    error={!!formErrors.startDate}
                    helperText={formErrors.startDate}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00b8a9',
                        },
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="End Date *"
                    type="date"
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setEndDate(date);
                    }}
                    error={!!formErrors.endDate}
                    helperText={formErrors.endDate}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00b8a9',
                        },
                      }
                    }}
                  />
                </>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00b8a9',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 184, 169, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#00b8a9',
                      },
                    }}
                  />
                }
                label="Active"
                sx={{ ml: 0 }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Project Configuration Card */}
        <Card
          elevation={0}
          sx={{
            p: 0,
            mb: 3,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha('#000', 0.1)
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                Project Configuration
                {renderTooltip('Configure which project this incentive plan applies to')}
              </Typography>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setProjectDialogOpen(true)}
                sx={{
                  borderColor: '#00b8a9',
                  color: '#00b8a9',
                  '&:hover': {
                    borderColor: '#00a99d',
                    backgroundColor: 'rgba(0, 184, 169, 0.08)',
                  }
                }}
              >
                Create Project
              </Button>
            </Box>

            <Stack spacing={3}>
              <FormControl fullWidth error={!!formErrors.projectId}>
                <InputLabel>Project *</InputLabel>
                <Select
                  value={projectId}
                  label="Project *"
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={loadingProjects}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: '350px', // Wider dropdown menu
                        maxHeight: '400px' // Taller dropdown for more options
                      }
                    }
                  }}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '& .MuiSelect-select': {
                      minWidth: '200px', // Ensure the selected value has enough space
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                >
                  {availableProjects.length === 0 && !loadingProjects ? (
                    <MenuItem disabled>No projects available. Create a new project.</MenuItem>
                  ) : (
                    availableProjects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                    ))
                  )}
                </Select>
                {formErrors.projectId && <FormHelperText>{formErrors.projectId}</FormHelperText>}
                {loadingProjects && <FormHelperText>Loading projects...</FormHelperText>}
                {availableProjects.length === 0 && !loadingProjects && (
                  <FormHelperText>
                    No projects available. Click the "Create Project" button to add a new project.
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>

            {/* Project Creation Dialog */}
            <CreateProjectDialog
              open={projectDialogOpen}
              onClose={() => setProjectDialogOpen(false)}
              onProjectCreated={handleProjectCreated}
            />
          </CardContent>
        </Card>

        {/* Target Configuration Card */}
        <Card
          elevation={0}
          sx={{
            p: 0,
            mb: 3,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: alpha('#000', 0.1)
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              Incentive Configuration
              {renderTooltip('Configure the incentive calculation details')}
            </Typography>

            <Stack spacing={3}>
              <FormControl fullWidth error={!!formErrors.calculationType}>
                <InputLabel>Calculation Type *</InputLabel>
                <Select
                  value={calculationType}
                  label="Calculation Type *"
                  onChange={(e) => setCalculationType(e.target.value as IncentiveCalculationType)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        width: '300px', // Wider dropdown menu
                        maxHeight: '300px' // Taller dropdown for more options
                      }
                    }
                  }}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '& .MuiSelect-select': {
                      minWidth: '200px', // Ensure the selected value has enough space
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }
                  }}
                >
                  <MenuItem value={IncentiveCalculationType.FixedAmount}>Fixed Amount</MenuItem>
                  <MenuItem value={IncentiveCalculationType.PercentageOnTarget}>Percentage on Target</MenuItem>
                </Select>
                {formErrors.calculationType && <FormHelperText>{formErrors.calculationType}</FormHelperText>}
              </FormControl>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Incentive Value *"
                    type="number"
                    value={incentiveValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setIncentiveValue(value === '' ? '' : Number(value));
                    }}
                    error={!!formErrors.incentiveValue}
                    helperText={formErrors.incentiveValue || (
                      calculationType === IncentiveCalculationType.PercentageOnTarget
                        ? 'Enter percentage value (0-100)'
                        : 'Enter fixed amount'
                    )}
                    // Note: We're using InputProps despite the deprecation warning
                    // because it's the only way to add endAdornment in MUI v5
                    // This will be updated when we migrate to MUI v6
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: calculationType === IncentiveCalculationType.PercentageOnTarget ? 100 : undefined,
                        step: calculationType === IncentiveCalculationType.PercentageOnTarget ? 0.1 : 1
                      },
                      // Add a suffix for percentage
                      endAdornment: calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : null
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00b8a9',
                        },
                      },
                      '& input': {
                        minWidth: '100px'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel>Currency Type *</InputLabel>
                    <Select
                      value={currencyType}
                      label="Currency Type *"
                      onChange={(e) => setCurrencyType(e.target.value as CurrencyType)}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            width: '250px', // Wider dropdown menu
                            maxHeight: '300px' // Taller dropdown for more options
                          }
                        }
                      }}
                      sx={{
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b8a9',
                        },
                        '& .MuiSelect-select': {
                          minWidth: '150px', // Ensure the selected value has enough space
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    >
                      <MenuItem value={CurrencyType.Rupees}>Rupees (₹)</MenuItem>
                      <MenuItem value={CurrencyType.Dollar}>Dollar ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Options section removed as per requirements */}
            </Stack>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/incentive-plans')}
            sx={{
              mr: 2,
              borderColor: '#00b8a9',
              color: '#00b8a9',
              '&:hover': {
                borderColor: '#00a99d',
                backgroundColor: 'rgba(0, 184, 169, 0.08)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: '#00b8a9',
              '&:hover': {
                bgcolor: '#00a99d',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0, 184, 169, 0.5)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isEditMode ? 'Update Plan' : 'Create Plan'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ModernProjectBasedPlanForm;
