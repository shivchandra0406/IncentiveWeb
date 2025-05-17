import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Switch
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  TargetType,
  IncentiveCalculationType
} from '../../core/models/incentivePlanTypes';
import type { CreateTargetBasedIncentivePlanRequest, TargetBasedIncentivePlan } from '../../core/models/incentivePlanTypes';

interface FormErrors {
  planName?: string;
  periodType?: string;
  startDate?: string;
  endDate?: string;
  targetType?: string;
  salary?: string;
  metricType?: string;
  targetValue?: string;
  calculationType?: string;
  incentiveValue?: string;
  additionalIncentivePercentage?: string;
}

interface TargetBasedPlanFormProps {
  initialData?: TargetBasedIncentivePlan;
}

const TargetBasedPlanForm: React.FC<TargetBasedPlanFormProps> = ({ initialData }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Base plan fields
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Target-based specific fields
  const [targetType, setTargetType] = useState<TargetType>(TargetType.MetricBased);
  const [salary, setSalary] = useState<number | ''>('');
  const [metricType, setMetricType] = useState<MetricType>(MetricType.BookingValue);
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');

  // Target configuration options
  const [incentiveAfterExceedingTarget, setIncentiveAfterExceedingTarget] = useState(false);
  const [provideAdditionalIncentiveOnExceeding, setProvideAdditionalIncentiveOnExceeding] = useState(false);
  const [additionalIncentivePercentage, setAdditionalIncentivePercentage] = useState<number | ''>('');
  const [includeSalaryInTarget, setIncludeSalaryInTarget] = useState(false);

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      // Use the provided initialData
      populateFormWithPlanData(initialData);
    } else if (isEditMode) {
      // Fetch data from API if initialData is not provided
      fetchPlanDetails();
    }
  }, [id, initialData]);

  const populateFormWithPlanData = (plan: TargetBasedIncentivePlan) => {
    // Set base plan fields
    setPlanName(plan.planName);
    setPeriodType(plan.periodType);
    setIsActive(plan.isActive);

    if (plan.startDate) {
      setStartDate(new Date(plan.startDate));
    }

    if (plan.endDate) {
      setEndDate(new Date(plan.endDate));
    }

    // Set target-based specific fields
    setTargetType(plan.targetType);
    setSalary(plan.salary || '');
    setMetricType(plan.metricType);
    setTargetValue(plan.targetValue);
    setCalculationType(plan.calculationType);
    setIncentiveValue(plan.incentiveValue);
    setIncentiveAfterExceedingTarget(plan.incentiveAfterExceedingTarget);
    setIncludeSalaryInTarget(plan.includeSalaryInTarget);
    setProvideAdditionalIncentiveOnExceeding(plan.provideAdditionalIncentiveOnExceeding || false);
    setAdditionalIncentivePercentage(plan.additionalIncentivePercentage || '');
  };

  const fetchPlanDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching target-based plan with ID:', id);
      const response = await incentivePlanService.getTargetBasedPlanById(id);

      if (response.succeeded) {
        // Use the helper function to populate the form
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

  const handleTargetTypeChange = (event: SelectChangeEvent) => {
    setTargetType(event.target.value as TargetType);

    // Reset salary if switching from salary-based
    if (event.target.value !== TargetType.SalaryBased) {
      setSalary('');
    }
  };

  const handleMetricTypeChange = (event: SelectChangeEvent) => {
    setMetricType(event.target.value as MetricType);
  };

  const handleCalculationTypeChange = (event: SelectChangeEvent) => {
    setCalculationType(event.target.value as IncentiveCalculationType);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validate base plan fields
    if (!planName.trim()) {
      errors.planName = 'Plan name is required';
    }

    if (!periodType) {
      errors.periodType = 'Period type is required';
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

    // Validate target-based specific fields
    if (!targetType) {
      errors.targetType = 'Target type is required';
    }

    if (targetType === TargetType.SalaryBased && !salary) {
      errors.salary = 'Salary is required for salary-based targets';
    }

    if (!metricType) {
      errors.metricType = 'Metric type is required';
    }

    if (!targetValue && targetValue !== 0) {
      errors.targetValue = 'Target value is required';
    }

    if (!calculationType) {
      errors.calculationType = 'Calculation type is required';
    }

    if (!incentiveValue && incentiveValue !== 0) {
      errors.incentiveValue = 'Incentive value is required';
    }

    // Validate additional incentive percentage if additional incentive is enabled
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

      // No need to update checkboxes as we're using separate checkboxes now

      // We're setting isCumulative to false as per the requirement to remove this option
      const isCumulativeValue = false;

      const planData: CreateTargetBasedIncentivePlanRequest = {
        planName,
        planType: IncentivePlanType.TargetBased,
        periodType,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        isActive,
        targetType,
        salary: salary !== '' ? Number(salary) : undefined,
        metricType,
        targetValue: Number(targetValue),
        calculationType,
        incentiveValue: Number(incentiveValue),
        isCumulative: isCumulativeValue,
        incentiveAfterExceedingTarget,
        includeSalaryInTarget,
        provideAdditionalIncentiveOnExceeding,
        additionalIncentivePercentage: provideAdditionalIncentiveOnExceeding && additionalIncentivePercentage !== ''
          ? Number(additionalIncentivePercentage)
          : undefined
      };

      let response;

      if (isEditMode && id) {
        console.log('Updating target-based plan with ID:', id);
        console.log('Update payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/target-based/${id}`);

        try {
          // For updating, use the type-specific endpoint
          response = await incentivePlanService.updateTargetBasedPlan(id, planData);
          console.log('Update response:', response);
        } catch (updateError: any) {
          console.error('Error in updateTargetBasedPlan:', updateError);
          console.error('Error response:', updateError.response?.data);
          throw updateError;
        }
      } else {
        console.log('Creating new target-based plan');
        console.log('Create payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/target-based`);
        response = await incentivePlanService.createTargetBasedPlan(planData);
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

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          {isEditMode ? 'Edit' : 'Create'} Target-Based Incentive Plan
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Section 1: Basic Information */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Basic Information
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
                  // Using InputLabelProps for date fields is still necessary for proper display
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
                  // Using InputLabelProps for date fields is still necessary for proper display
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
        </Paper>

        {/* Section 2: Target Configuration */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Target Configuration
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth error={!!formErrors.targetType}>
              <InputLabel>Target Type *</InputLabel>
              <Select
                value={targetType}
                label="Target Type *"
                onChange={handleTargetTypeChange}
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

            {targetType === TargetType.SalaryBased && (
              <TextField
                fullWidth
                label="Salary *"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.salary}
                helperText={formErrors.salary}
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
            )}

            <FormControl fullWidth error={!!formErrors.metricType}>
              <InputLabel>Metric Type *</InputLabel>
              <Select
                value={metricType}
                label="Metric Type *"
                onChange={handleMetricTypeChange}
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
              helperText={formErrors.targetValue}
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
                onChange={handleCalculationTypeChange}
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
              label={`Incentive ${calculationType === IncentiveCalculationType.FixedAmount ? 'Amount' : 'Percentage'} *`}
              type="number"
              value={incentiveValue}
              onChange={(e) => setIncentiveValue(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.incentiveValue}
              helperText={formErrors.incentiveValue}
              // Using min/max attributes on the input
              // InputProps is deprecated but still works
              InputProps={{
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
        </Paper>

        {/* Sticky Footer with Action Buttons */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            position: 'sticky',
            bottom: 16,
            bgcolor: 'background.paper',
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            zIndex: 1
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/incentive-plans')}
            disabled={loading}
            sx={{
              px: 3,
              borderColor: '#00b8a9',
              color: '#00b8a9',
              '&:hover': {
                borderColor: '#00a99a',
                backgroundColor: 'rgba(0, 184, 169, 0.04)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              px: 3,
              bgcolor: '#00b8a9',
              '&:hover': {
                bgcolor: '#00a99a',
                boxShadow: '0 2px 4px rgba(0,184,169,0.3)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                bgcolor: '#00877c',
                transform: 'translateY(0)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {isEditMode ? 'Update' : 'Create'} Plan
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TargetBasedPlanForm;
