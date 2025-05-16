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
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
  alpha,
  FormHelperText
} from '@mui/material';
import {
  Help as HelpIcon
} from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';

import {
  PeriodType,
  IncentiveCalculationType,
  AwardType
} from '../../core/models/incentivePlanTypes';

import type {  CreateKickerIncentivePlanRequest,
  KickerIncentivePlan } from '../../core/models/incentivePlanTypes';
interface ModernKickerBasedPlanFormProps {
  initialData?: KickerIncentivePlan;
}

const ModernKickerBasedPlanForm: React.FC<ModernKickerBasedPlanFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id || !!initialData;

  // Form state
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [isActive, setIsActive] = useState(true);
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');
  const [awardType, setAwardType] = useState<AwardType>(AwardType.Cash);
  const [awardValue, setAwardValue] = useState<number | ''>('');
  const [awardDescription, setAwardDescription] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

      console.log(`Fetching kicker plan with ID: ${planId}`);
      const response = await incentivePlanService.getKickerPlanById(planId);

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

  const populateFormWithPlanData = (data: KickerIncentivePlan) => {
    setPlanName(data.planName || '');
    setPeriodType(data.periodType || PeriodType.Monthly);
    setIsActive(data.isActive !== undefined ? data.isActive : true);
    setTargetValue(data.targetValue !== undefined ? data.targetValue : '');
    setCalculationType(data.calculationType || IncentiveCalculationType.FixedAmount);
    setIncentiveValue(data.incentiveValue !== undefined ? data.incentiveValue : '');
    setAwardType(data.awardType || AwardType.Cash);
    setAwardValue(data.awardValue !== undefined ? data.awardValue : '');
    setAwardDescription(data.awardDescription || '');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!planName.trim()) {
      errors.planName = 'Plan name is required';
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

    if (awardType === AwardType.Cash && awardValue === '') {
      errors.awardValue = 'Award value is required for cash awards';
    } else if (awardType === AwardType.Cash && typeof awardValue === 'number' && awardValue <= 0) {
      errors.awardValue = 'Award value must be greater than 0';
    }

    if (awardType === AwardType.NonCash && !awardDescription.trim()) {
      errors.awardDescription = 'Award description is required for non-cash awards';
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

      const planData: CreateKickerIncentivePlanRequest = {
        planName,
        periodType,
        isActive,
        targetValue: targetValue as number,
        calculationType,
        incentiveValue: incentiveValue as number,
        awardType,
        awardValue: awardType === AwardType.Cash ? (awardValue as number) : undefined,
        awardDescription: awardType === AwardType.NonCash ? awardDescription : undefined
      };

      let response;

      if (isEditMode && id) {
        console.log('Updating kicker plan with ID:', id);
        console.log('Update payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/kicker/${id}`);

        try {
          // For updating, use the type-specific endpoint
          response = await incentivePlanService.updateKickerPlan(id, planData);
          console.log('Update response:', response);
        } catch (updateError: any) {
          console.error('Error in updateKickerPlan:', updateError);
          console.error('Error response:', updateError.response?.data);
          throw updateError;
        }
      } else {
        console.log('Creating new kicker plan');
        console.log('Create payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/kicker`);
        response = await incentivePlanService.createKickerPlan(planData);
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
          {isEditMode ? 'Edit' : 'Create'} Kicker-Based Incentive Plan
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
              <TextField
                fullWidth
                label="Target Value *"
                type="number"
                value={targetValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setTargetValue(value === '' ? '' : Number(value));
                }}
                error={!!formErrors.targetValue}
                helperText={formErrors.targetValue || 'Enter the target value that triggers the kicker'}
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
            </Stack>
          </CardContent>
        </Card>

        {/* Award Configuration Card */}
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
              Award Configuration
              {renderTooltip('Configure the award details for this kicker plan')}
            </Typography>

            <Stack spacing={3}>
              <FormControl fullWidth error={!!formErrors.awardType}>
                <InputLabel>Award Type *</InputLabel>
                <Select
                  value={awardType}
                  label="Award Type *"
                  onChange={(e) => setAwardType(e.target.value as AwardType)}
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b8a9',
                    },
                  }}
                >
                  <MenuItem value={AwardType.Cash}>Cash</MenuItem>
                  <MenuItem value={AwardType.NonCash}>Non-Cash</MenuItem>
                </Select>
                {formErrors.awardType && <FormHelperText>{formErrors.awardType}</FormHelperText>}
              </FormControl>

              {awardType === AwardType.Cash && (
                <TextField
                  fullWidth
                  label="Award Value *"
                  type="number"
                  value={awardValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAwardValue(value === '' ? '' : Number(value));
                  }}
                  error={!!formErrors.awardValue}
                  helperText={formErrors.awardValue || 'Enter the cash award amount'}
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
              )}

              {awardType === AwardType.NonCash && (
                <TextField
                  fullWidth
                  label="Award Description *"
                  multiline
                  rows={3}
                  value={awardDescription}
                  onChange={(e) => setAwardDescription(e.target.value)}
                  error={!!formErrors.awardDescription}
                  helperText={formErrors.awardDescription || 'Describe the non-cash award in detail'}
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

export default ModernKickerBasedPlanForm;
