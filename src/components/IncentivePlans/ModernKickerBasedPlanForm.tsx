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
  FormHelperText,
  Divider
} from '@mui/material';
import {
  Help as HelpIcon
} from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';

import {
  PeriodType,
  IncentiveCalculationType,
  AwardType,
  CurrencyType,
  IncentivePlanType,
  MetricType,
  TargetType
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [targetType, setTargetType] = useState<TargetType>(TargetType.MetricBased);
  const [salary, setSalary] = useState<number | ''>('');
  const [metricType, setMetricType] = useState<MetricType>(MetricType.BookingValue);
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');
  const [consistencyMonths, setConsistencyMonths] = useState<number | ''>('');
  const [awardType, setAwardType] = useState<AwardType>(AwardType.Cash);
  const [awardValue, setAwardValue] = useState<number | ''>('');
  const [currencyType, setCurrencyType] = useState<CurrencyType>(CurrencyType.Rupees);
  const [giftDescription, setGiftDescription] = useState('');

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
    setTargetType(data.targetType || TargetType.MetricBased);
    setSalary(data.salary !== undefined ? data.salary : '');
    setMetricType(data.metricType || MetricType.BookingValue);
    setTargetValue(data.targetValue !== undefined ? data.targetValue : '');
    setCalculationType(data.calculationType || IncentiveCalculationType.FixedAmount);
    setIncentiveValue(data.incentiveValue !== undefined ? data.incentiveValue : '');
    setConsistencyMonths(data.consistencyMonths !== undefined ? data.consistencyMonths : '');
    setAwardType(data.awardType || AwardType.Cash);
    setAwardValue(data.awardValue !== undefined ? data.awardValue : '');
    setCurrencyType(data.currencyType || CurrencyType.Rupees);
    setGiftDescription(data.giftDescription || '');

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

    if (targetType === TargetType.SalaryBased && salary === '') {
      errors.salary = 'Salary is required for salary-based targets';
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

    if (consistencyMonths === '') {
      errors.consistencyMonths = 'Consistency months is required';
    } else if (typeof consistencyMonths === 'number' && consistencyMonths <= 0) {
      errors.consistencyMonths = 'Consistency months must be greater than 0';
    }

    if (awardType === AwardType.Cash && awardValue === '') {
      errors.awardValue = 'Award value is required for cash awards';
    } else if (awardType === AwardType.Cash && typeof awardValue === 'number' && awardValue <= 0) {
      errors.awardValue = 'Award value must be greater than 0';
    }

    if (awardType === AwardType.Gift && !giftDescription.trim()) {
      errors.giftDescription = 'Gift description is required for non-cash awards';
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
        startDate: periodType === PeriodType.Custom && startDate ? startDate.toISOString() : undefined,
        endDate: periodType === PeriodType.Custom && endDate ? endDate.toISOString() : undefined,
        isActive,
        targetType,
        salary: targetType === TargetType.SalaryBased && salary !== '' ? Number(salary) : undefined,
        metricType,
        targetValue: targetValue as number,
        calculationType,
        incentiveValue: incentiveValue as number,
        consistencyMonths: consistencyMonths as number,
        awardType,
        awardValue: awardType === AwardType.Cash ? (awardValue as number) : undefined,
        currencyType,
        giftDescription: awardType === AwardType.Gift ? giftDescription : undefined,
        // Add required fields for the API
        planType: IncentivePlanType.KickerBased
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
                  label="Salary *"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!formErrors.salary}
                  helperText={formErrors.salary}
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

              {calculationType === IncentiveCalculationType.FixedAmount ? (
                <TextField
                  fullWidth
                  label="Incentive Amount *"
                  type="number"
                  value={incentiveValue}
                  onChange={(e) => setIncentiveValue(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!formErrors.incentiveValue}
                  helperText={formErrors.incentiveValue || `Enter fixed amount (${currencyType === CurrencyType.Rupees ? '₹' : '$'})`}
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
            </Stack>
          </CardContent>
        </Card>

        {/* Kicker Reward Configuration Card */}
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
              Kicker Reward Configuration
              {renderTooltip('Configure the kicker reward details based on consistency')}
            </Typography>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Consistency Months *"
                type="number"
                value={consistencyMonths}
                onChange={(e) => {
                  const value = e.target.value;
                  setConsistencyMonths(value === '' ? '' : Number(value));
                }}
                error={!!formErrors.consistencyMonths}
                helperText={formErrors.consistencyMonths || 'Enter the number of months the target must be consistently met'}
                InputProps={{
                  inputProps: { min: 1, step: 1 }
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

              <FormControl fullWidth error={!!formErrors.awardType}>
                <InputLabel>Award Type *</InputLabel>
                <Select
                  value={awardType}
                  label="Award Type *"
                  onChange={(e) => setAwardType(e.target.value as AwardType)}
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
                  <MenuItem value={AwardType.Cash}>Cash</MenuItem>
                  <MenuItem value={AwardType.Gift}>Gift</MenuItem>
                </Select>
                {formErrors.awardType && <FormHelperText>{formErrors.awardType}</FormHelperText>}
              </FormControl>

              {awardType === AwardType.Cash && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
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
                  </Box>
                </Box>
              )}

              {awardType === AwardType.Gift && (
                <TextField
                  fullWidth
                  label="Gift Description *"
                  multiline
                  rows={3}
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                  error={!!formErrors.giftDescription}
                  helperText={formErrors.giftDescription || 'Describe the gift in detail'}
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

export default ModernKickerBasedPlanForm;
