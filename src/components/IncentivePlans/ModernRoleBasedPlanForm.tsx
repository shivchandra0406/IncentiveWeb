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
  Checkbox,
  Switch,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
  alpha,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import {
  Help as HelpIcon
} from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  PeriodType,
  TargetType,
  IncentiveCalculationType,
  CurrencyType,
  IncentivePlanType,
  MetricType
} from '../../core/models/incentivePlanTypes';

import type {  CreateRoleBasedIncentivePlanRequest,
  RoleBasedIncentivePlan } from '../../core/models/incentivePlanTypes';

interface ModernRoleBasedPlanFormProps {
  initialData?: RoleBasedIncentivePlan;
}

const ModernRoleBasedPlanForm: React.FC<ModernRoleBasedPlanFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id || !!initialData;

  // Form state
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState('');
  const [isTeamBased, setIsTeamBased] = useState(false);
  const [teamId, setTeamId] = useState('');
  const [targetType, setTargetType] = useState<TargetType>(TargetType.MetricBased);
  const [salary, setSalary] = useState<number | ''>('');
  const [metricType, setMetricType] = useState<MetricType>(MetricType.BookingValue);
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');
  const [currencyType, setCurrencyType] = useState<CurrencyType>(CurrencyType.Rupees);
  const [incentiveAfterExceedingTarget, setIncentiveAfterExceedingTarget] = useState(false);
  const [includeSalaryInTarget, setIncludeSalaryInTarget] = useState(false);
  const [provideAdditionalIncentiveOnExceeding, setProvideAdditionalIncentiveOnExceeding] = useState(false);
  const [additionalIncentivePercentage, setAdditionalIncentivePercentage] = useState<number | ''>('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Available roles for dropdown
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    'Sales Representative',
    'Account Manager',
    'Sales Manager',
    'Business Development',
    'Customer Success'
  ]);

  // Available teams for dropdown (when isTeamBased is true)
  const [availableTeams, setAvailableTeams] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'North America Sales' },
    { id: '2', name: 'EMEA Sales' },
    { id: '3', name: 'APAC Sales' },
    { id: '4', name: 'Enterprise Sales' }
  ]);

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

      console.log(`Fetching role-based plan with ID: ${planId}`);
      const response = await incentivePlanService.getRoleBasedPlanById(planId);

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

  const populateFormWithPlanData = (data: RoleBasedIncentivePlan) => {
    setPlanName(data.planName || '');
    setPeriodType(data.periodType || PeriodType.Monthly);
    setIsActive(data.isActive !== undefined ? data.isActive : true);
    setRole(data.role || '');
    setIsTeamBased(data.isTeamBased !== undefined ? data.isTeamBased : false);
    setTeamId(data.teamId || '');
    setTargetType(data.targetType || TargetType.MetricBased);
    setSalary(data.salaryPercentage !== undefined ? data.salaryPercentage : '');
    setMetricType(data.metricType || MetricType.BookingValue);
    setTargetValue(data.targetValue !== undefined ? data.targetValue : '');
    setCalculationType(data.calculationType || IncentiveCalculationType.FixedAmount);
    setIncentiveValue(data.incentiveValue !== undefined ? data.incentiveValue : '');
    setCurrencyType(data.currencyType || CurrencyType.Rupees);
    setIncentiveAfterExceedingTarget(data.incentiveAfterExceedingTarget !== undefined ? data.incentiveAfterExceedingTarget : false);
    setIncludeSalaryInTarget(data.includeSalaryInTarget !== undefined ? data.includeSalaryInTarget : false);
    setProvideAdditionalIncentiveOnExceeding(data.provideAdditionalIncentiveOnExceeding || false);
    setAdditionalIncentivePercentage(data.additionalIncentivePercentage !== undefined ? data.additionalIncentivePercentage : '');

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

    if (!role.trim()) {
      errors.role = 'Role is required';
    }

    if (isTeamBased && !teamId) {
      errors.teamId = 'Team is required when team-based is selected';
    }

    if (targetType === TargetType.SalaryBased && salary === '') {
      errors.salary = 'Salary factor is required for salary-based targets';
    }

    if (targetValue === '') {
      errors.targetValue = 'Target value is required';
    } else if (typeof targetValue === 'number' && targetValue <= 0) {
      errors.targetValue = 'Target value must be greater than 0';
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

    if (provideAdditionalIncentiveOnExceeding && (!additionalIncentivePercentage && additionalIncentivePercentage !== 0)) {
      errors.additionalIncentivePercentage = 'Please specify the percentage of incentive to be given on the exceeded amount';
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

      const planData: CreateRoleBasedIncentivePlanRequest = {
        planName,
        periodType,
        startDate: periodType === PeriodType.Custom && startDate ? startDate.toISOString() : undefined,
        endDate: periodType === PeriodType.Custom && endDate ? endDate.toISOString() : undefined,
        isActive,
        role,
        isTeamBased,
        teamId: isTeamBased ? teamId : undefined,
        targetType,
        salaryPercentage: targetType === TargetType.SalaryBased && salary !== '' ? Number(salary) : undefined,
        metricType,
        targetValue: targetValue as number,
        calculationType,
        incentiveValue: incentiveValue as number,
        currencyType,
        isCumulative: false, // Setting to false as per requirement
        incentiveAfterExceedingTarget,
        includeSalaryInTarget,
        provideAdditionalIncentiveOnExceeding,
        additionalIncentivePercentage: provideAdditionalIncentiveOnExceeding && additionalIncentivePercentage !== ''
          ? Number(additionalIncentivePercentage)
          : undefined,
        // Add required fields for the API
        planType: IncentivePlanType.RoleBased
      };

      let response;

      if (isEditMode && id) {
        console.log('Updating role-based plan with ID:', id);
        console.log('Update payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/role-based/${id}`);

        try {
          // For updating, use the type-specific endpoint
          response = await incentivePlanService.updateRoleBasedPlan(id, planData);
          console.log('Update response:', response);
        } catch (updateError: any) {
          console.error('Error in updateRoleBasedPlan:', updateError);
          console.error('Error response:', updateError.response?.data);
          throw updateError;
        }
      } else {
        console.log('Creating new role-based plan');
        console.log('Create payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/role-based`);
        response = await incentivePlanService.createRoleBasedPlan(planData);
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

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {isEditMode ? 'Edit' : 'Create'} Role-Based Incentive Plan
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
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
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

        {/* Role Configuration Card */}
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
              Role Configuration
              {renderTooltip('Configure which role this incentive plan applies to')}
            </Typography>

            <Stack spacing={3}>
              <Autocomplete
                options={availableRoles}
                value={role}
                onChange={(event, newValue) => {
                  setRole(newValue || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role *"
                    error={!!formErrors.role}
                    helperText={formErrors.role}
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
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTeamBased}
                    onChange={(e) => setIsTeamBased(e.target.checked)}
                    sx={{
                      color: '#00b8a9',
                      '&.Mui-checked': {
                        color: '#00b8a9',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Team-Based Plan
                    {renderTooltip('Enable if this plan applies to an entire team rather than individuals')}
                  </Box>
                }
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  '& .MuiFormControlLabel-label': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              />

              {isTeamBased && (
                <FormControl fullWidth error={!!formErrors.teamId}>
                  <InputLabel>Team *</InputLabel>
                  <Select
                    value={teamId}
                    label="Team *"
                    onChange={(e) => setTeamId(e.target.value)}
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b8a9',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b8a9',
                      },
                    }}
                  >
                    {availableTeams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                    ))}
                  </Select>
                  {formErrors.teamId && <FormHelperText>{formErrors.teamId}</FormHelperText>}
                </FormControl>
              )}
            </Stack>
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
              Target Configuration
              {renderTooltip('Configure the target and incentive calculation details')}
            </Typography>

            <Stack spacing={3}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth error={!!formErrors.targetType}>
                    <InputLabel>Target Type *</InputLabel>
                    <Select
                      value={targetType}
                      label="Target Type *"
                      onChange={(e) => setTargetType(e.target.value as TargetType)}
                      sx={{
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b8a9',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b8a9',
                        },
                      }}
                    >
                      <MenuItem value={TargetType.MetricBased}>Metric Based</MenuItem>
                      <MenuItem value={TargetType.SalaryBased}>Salary Based</MenuItem>
                    </Select>
                    {formErrors.targetType && <FormHelperText>{formErrors.targetType}</FormHelperText>}
                  </FormControl>
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

              {targetType === TargetType.SalaryBased && (
                <TextField
                  fullWidth
                  label="Salary Factor *"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!formErrors.salary}
                  helperText={formErrors.salary || 'Enter decimal value of salary to be used for calculation (e.g., 0.5 for half salary)'}
                  // Using min attribute directly on the input
                  // inputProps is deprecated but still works
                  inputProps={{ min: 0, max: 10, step: 0.01 }}
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
              )}

              <FormControl fullWidth error={!!formErrors.metricType}>
                <InputLabel>Metric Type *</InputLabel>
                <Select
                  value={metricType}
                  label="Metric Type *"
                  onChange={(e) => setMetricType(e.target.value as MetricType)}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                  }}
                >
                  <MenuItem value={MetricType.BookingValue}>Booking Value</MenuItem>
                  <MenuItem value={MetricType.UnitsSold}>Units Sold</MenuItem>
                  <MenuItem value={MetricType.Revenue}>Revenue</MenuItem>
                </Select>
                {formErrors.metricType && <FormHelperText>{formErrors.metricType}</FormHelperText>}
              </FormControl>

              <TextField
                fullWidth
                label="Target Value *"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.targetValue}
                helperText={formErrors.targetValue || 'Enter the target value to be achieved'}
                // Using min attribute directly on the input
                // inputProps is deprecated but still works
                inputProps={{ min: 0 }}
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

              <FormControl fullWidth error={!!formErrors.calculationType}>
                <InputLabel>Calculation Type *</InputLabel>
                <Select
                  value={calculationType}
                  label="Calculation Type *"
                  onChange={(e) => setCalculationType(e.target.value as IncentiveCalculationType)}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                  }}
                >
                  <MenuItem value={IncentiveCalculationType.FixedAmount}>Fixed Amount</MenuItem>
                  <MenuItem value={IncentiveCalculationType.PercentageOnTarget}>Percentage on Target</MenuItem>
                </Select>
                {formErrors.calculationType && <FormHelperText>{formErrors.calculationType}</FormHelperText>}
              </FormControl>

              {calculationType === IncentiveCalculationType.FixedAmount ? (
                <TextField
                  fullWidth
                  label="Incentive Amount *"
                  type="number"
                  value={incentiveValue}
                  onChange={(e) => setIncentiveValue(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!formErrors.incentiveValue}
                  helperText={formErrors.incentiveValue || `Enter fixed amount (${currencyType === CurrencyType.Rupees ? '₹' : '$'})`}
                  // Note: We're using InputProps despite the deprecation warning
                  // because it's the only way to add endAdornment in MUI v5
                  // This will be updated when we migrate to MUI v6
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
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
              ) : (
                <TextField
                  fullWidth
                  label="Incentive Percentage *"
                  type="number"
                  value={incentiveValue}
                  onChange={(e) => setIncentiveValue(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!formErrors.incentiveValue}
                  helperText={formErrors.incentiveValue || 'Enter percentage value (0-100)'}
                  // Note: We're using InputProps despite the deprecation warning
                  // because it's the only way to add endAdornment in MUI v5
                  // This will be updated when we migrate to MUI v6
                  InputProps={{
                    endAdornment: '%',
                    inputProps: { min: 0, max: 100, step: 0.1 }
                  }}
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
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                Additional Options
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={incentiveAfterExceedingTarget}
                    onChange={(e) => setIncentiveAfterExceedingTarget(e.target.checked)}
                    sx={{
                      color: '#00b8a9',
                      '&.Mui-checked': {
                        color: '#00b8a9',
                      },
                    }}
                  />
                }
                label="Provide incentive after exceeding target"
                sx={{ display: 'block', mb: 1 }}
              />

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={provideAdditionalIncentiveOnExceeding}
                      onChange={(e) => {
                        setProvideAdditionalIncentiveOnExceeding(e.target.checked);

                        // Reset additional incentive percentage if checkbox is unchecked
                        if (!e.target.checked) {
                          setAdditionalIncentivePercentage('');
                        }
                      }}
                      sx={{
                        color: '#00b8a9',
                        '&.Mui-checked': {
                          color: '#00b8a9',
                        },
                      }}
                    />
                  }
                  label="Provide additional incentive on exceeding target"
                  sx={{ display: 'block', mb: 1 }}
                />

                {provideAdditionalIncentiveOnExceeding && (
                  <Box sx={{ ml: 4, mt: 1 }}>
                    <TextField
                      fullWidth
                      label="Additional Incentive Percentage (%)"
                      type="number"
                      value={additionalIncentivePercentage}
                      onChange={(e) => setAdditionalIncentivePercentage(e.target.value === '' ? '' : Number(e.target.value))}
                      error={!!formErrors.additionalIncentivePercentage}
                      helperText={formErrors.additionalIncentivePercentage || 'Percentage of additional incentive to be given on the exceeded amount'}
                      // Using min/max attributes on the input
                      // InputProps is deprecated but still works
                      InputProps={{
                        inputProps: { min: 0, max: 100 }
                      }}
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
                  </Box>
                )}
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeSalaryInTarget}
                    onChange={(e) => setIncludeSalaryInTarget(e.target.checked)}
                    sx={{
                      color: '#00b8a9',
                      '&.Mui-checked': {
                        color: '#00b8a9',
                      },
                    }}
                  />
                }
                label="Include salary in target calculation"
                sx={{ display: 'block' }}
              />
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

export default ModernRoleBasedPlanForm;
