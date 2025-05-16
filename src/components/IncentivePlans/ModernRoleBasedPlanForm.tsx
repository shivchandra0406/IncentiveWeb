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
  Info as InfoIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  PeriodType,
  TargetType,
  IncentiveCalculationType
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
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState('');
  const [isTeamBased, setIsTeamBased] = useState(false);
  const [teamId, setTeamId] = useState('');
  const [targetType, setTargetType] = useState<TargetType>(TargetType.MetricBased);
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');
  const [isCumulative, setIsCumulative] = useState(false);
  const [incentiveAfterExceedingTarget, setIncentiveAfterExceedingTarget] = useState(false);
  const [includeSalaryInTarget, setIncludeSalaryInTarget] = useState(false);

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
    setCalculationType(data.calculationType || IncentiveCalculationType.FixedAmount);
    setIncentiveValue(data.incentiveValue !== undefined ? data.incentiveValue : '');
    setIsCumulative(data.isCumulative !== undefined ? data.isCumulative : false);
    setIncentiveAfterExceedingTarget(data.incentiveAfterExceedingTarget !== undefined ? data.incentiveAfterExceedingTarget : false);
    setIncludeSalaryInTarget(data.includeSalaryInTarget !== undefined ? data.includeSalaryInTarget : false);
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

    if (incentiveValue === '') {
      errors.incentiveValue = 'Incentive value is required';
    } else if (typeof incentiveValue === 'number' && incentiveValue <= 0) {
      errors.incentiveValue = 'Incentive value must be greater than 0';
    }

    if (calculationType === IncentiveCalculationType.PercentageOnTarget &&
        typeof incentiveValue === 'number' && incentiveValue > 100) {
      errors.incentiveValue = 'Percentage cannot exceed 100%';
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
        isActive,
        role,
        isTeamBased,
        teamId: isTeamBased ? teamId : undefined,
        targetType,
        calculationType,
        incentiveValue: incentiveValue as number,
        isCumulative,
        incentiveAfterExceedingTarget,
        includeSalaryInTarget
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
                InputProps={{
                  endAdornment: calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : null,
                  inputProps: {
                    min: 0,
                    max: calculationType === IncentiveCalculationType.PercentageOnTarget ? 100 : undefined
                  }
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

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Options
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isCumulative}
                      onChange={(e) => setIsCumulative(e.target.checked)}
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
                      Cumulative
                      {renderTooltip('When enabled, incentives are calculated cumulatively across periods')}
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
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Incentive After Exceeding Target
                      {renderTooltip('When enabled, incentives continue to be earned after exceeding the target')}
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
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Include Salary in Calculation
                      {renderTooltip('When enabled, base salary is included in target calculations')}
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
              </Box>
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
