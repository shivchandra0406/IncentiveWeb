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
  FormHelperText,
  IconButton
} from '@mui/material';
import {
  Help as HelpIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  PeriodType,
  IncentiveCalculationType,
  CurrencyType,
  IncentivePlanType,
  MetricType
} from '../../core/models/incentivePlanTypes';

import type { TieredIncentivePlan } from '../../core/models/incentivePlanTypes';

// Define a simplified tier interface for the form
interface TierLevel {
  level: number;
  fromValue: number;
  toValue: number;
  incentiveValue: number;
  currencyType: CurrencyType;
}

interface ModernTieredBasedPlanFormProps {
  initialData?: TieredIncentivePlan;
}

const ModernTieredBasedPlanForm: React.FC<ModernTieredBasedPlanFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id || !!initialData;

  // Form state
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [isActive, setIsActive] = useState(true);
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [tiers, setTiers] = useState<TierLevel[]>([
    { level: 1, fromValue: 0, toValue: 1000, incentiveValue: 0, currencyType: CurrencyType.Rupees }
  ]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tierErrors, setTierErrors] = useState<Record<string, Record<string, string>>>({});

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

      console.log(`Fetching tiered plan with ID: ${planId}`);
      const response = await incentivePlanService.getTieredPlanById(planId);

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

  const populateFormWithPlanData = (data: TieredIncentivePlan) => {
    setPlanName(data.planName || '');
    setPeriodType(data.periodType || PeriodType.Monthly);
    setIsActive(data.isActive !== undefined ? data.isActive : true);

    // Handle calculation type - it might be in different locations depending on the API response
    // Use type assertion to handle potential API response differences
    const anyData = data as any;
    if (anyData.calculationType !== undefined) {
      setCalculationType(anyData.calculationType);
    } else if (data.tiers && data.tiers.length > 0 && (data.tiers[0] as any).calculationType !== undefined) {
      setCalculationType((data.tiers[0] as any).calculationType);
    } else {
      setCalculationType(IncentiveCalculationType.FixedAmount);
    }

    if (data.tiers && data.tiers.length > 0) {
      // Map the backend tier model to our form tier model
      setTiers(data.tiers.map((tier, index) => ({
        level: index + 1, // Use index+1 as level
        fromValue: tier.fromValue || 0,
        toValue: tier.toValue || 0,
        incentiveValue: tier.incentiveValue || 0,
        currencyType: tier.currencyType || CurrencyType.Rupees
      })));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const tierValidationErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    if (!planName.trim()) {
      errors.planName = 'Plan name is required';
      isValid = false;
    }

    // Validate tiers
    tiers.forEach((tier, index) => {
      const tierError: Record<string, string> = {};

      // Validate fromValue
      if (tier.fromValue < 0) {
        tierError.fromValue = 'From value must be a positive number';
        isValid = false;
      }

      // Validate toValue
      if (tier.toValue <= 0) {
        tierError.toValue = 'To value must be greater than 0';
        isValid = false;
      }

      // Validate that toValue is greater than fromValue
      if (tier.toValue <= tier.fromValue) {
        tierError.toValue = 'To value must be greater than From value';
        isValid = false;
      }

      // Validate incentive value based on calculation type
      if (tier.incentiveValue === undefined || tier.incentiveValue === null || tier.incentiveValue <= 0) {
        tierError.incentiveValue = `Incentive value must be greater than 0${calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}`;
        isValid = false;
      } else if (calculationType === IncentiveCalculationType.PercentageOnTarget && tier.incentiveValue > 100) {
        tierError.incentiveValue = 'Percentage cannot exceed 100%';
        isValid = false;
      }

      // Check if tiers are properly ordered (no gaps or overlaps)
      if (index > 0) {
        const prevTier = tiers[index - 1];

        // Check for gaps between tiers
        if (tier.fromValue > prevTier.toValue) {
          tierError.fromValue = 'There should be no gaps between tiers';
          isValid = false;
        }

        // Check for overlaps between tiers
        if (tier.fromValue < prevTier.toValue) {
          tierError.fromValue = 'Tiers should not overlap';
          isValid = false;
        }
      }

      if (Object.keys(tierError).length > 0) {
        tierValidationErrors[index] = tierError;
      }
    });

    setFormErrors(errors);
    setTierErrors(tierValidationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Create the request payload
      // We need to cast the tiers to any to avoid TypeScript errors with the backend model
      const planData: any = {
        planName,
        periodType,
        isActive,
        calculationType,
        tiers: tiers.map(tier => ({
          level: tier.level,
          fromValue: tier.fromValue,
          toValue: tier.toValue,
          incentiveValue: tier.incentiveValue,
          currencyType: tier.currencyType,
          // Add calculationType to each tier as required by the backend
          calculationType: calculationType
        })),
        // Add required fields for the API
        planType: IncentivePlanType.TieredBased,
        metricType: MetricType.BookingValue
      };

      let response;

      if (isEditMode && id) {
        console.log('Updating tiered plan with ID:', id);
        console.log('Update payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/tiered-based/${id}`);

        try {
          // For updating, use the type-specific endpoint
          response = await incentivePlanService.updateTieredPlan(id, planData);
          console.log('Update response:', response);
        } catch (updateError: any) {
          console.error('Error in updateTieredPlan:', updateError);
          console.error('Error response:', updateError.response?.data);
          throw updateError;
        }
      } else {
        console.log('Creating new tiered plan');
        console.log('Create payload:', planData);
        console.log('API endpoint that will be called:', `https://localhost:44307/api/incentive-plans/tiered-based`);
        response = await incentivePlanService.createTieredPlan(planData);
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

  const handleAddTier = () => {
    const newLevel = tiers.length + 1;
    const lastTier = tiers.length > 0 ? tiers[tiers.length - 1] : null;

    // Calculate new from/to values based on the last tier
    const newFromValue = lastTier ? lastTier.toValue : 0;
    const newToValue = lastTier ? lastTier.toValue + 1000 : 1000; // Default increment of 1000

    setTiers([
      ...tiers,
      {
        level: newLevel,
        fromValue: newFromValue,
        toValue: newToValue,
        incentiveValue: 0,
        currencyType: CurrencyType.Rupees
      }
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) {
      return; // Keep at least one tier
    }

    const updatedTiers = tiers.filter((_, i) => i !== index);

    // Renumber levels
    const reorderedTiers = updatedTiers.map((tier, i) => ({
      ...tier,
      level: i + 1
    }));

    setTiers(reorderedTiers);
  };

  const handleTierChange = (index: number, field: keyof TierLevel, value: number | CurrencyType) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value
    };
    setTiers(updatedTiers);
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
          {isEditMode ? 'Edit' : 'Create'} Tiered-Based Incentive Plan
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

        {/* Incentive Configuration Card */}
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
              {renderTooltip('Configure how incentives are calculated')}
            </Typography>

            <Stack spacing={3}>
              <FormControl fullWidth error={!!formErrors.calculationType}>
                <InputLabel>Incentive Calculation Type *</InputLabel>
                <Select
                  value={calculationType}
                  label="Incentive Calculation Type *"
                  onChange={(e) => {
                    setCalculationType(e.target.value as IncentiveCalculationType);
                    // Reset incentive values when calculation type changes to ensure proper validation
                    if (e.target.value !== calculationType) {
                      const updatedTiers = tiers.map(tier => ({
                        ...tier,
                        incentiveValue: 0
                      }));
                      setTiers(updatedTiers);
                    }
                  }}
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
                <FormHelperText>
                  {calculationType === IncentiveCalculationType.FixedAmount
                    ? 'Fixed amount will be paid at each tier level (e.g., $1000, $2000, etc.)'
                    : 'Percentage of target will be paid at each tier level (e.g., 5%, 10%, etc.)'}
                </FormHelperText>
                <Box sx={{ mt: 1, p: 1, bgcolor: alpha('#00b8a9', 0.05), borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 'medium', color: 'text.secondary' }}>
                    <strong>Note:</strong> You will need to provide an incentive value for each tier based on the selected calculation type.
                    {calculationType === IncentiveCalculationType.PercentageOnTarget
                      ? ' Enter percentage values between 0-100%.'
                      : ' Enter fixed amount values in currency units.'}
                  </Typography>
                </Box>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* Tier Configuration Card */}
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
                Tier Configuration
                {renderTooltip('Configure the tiers and thresholds for this incentive plan')}
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTier}
                sx={{
                  bgcolor: '#00b8a9',
                  '&:hover': {
                    bgcolor: '#00a99d',
                  }
                }}
              >
                Add Tier
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Configure multiple tiers with increasing value ranges. Each tier represents a range (From-To) with its own incentive value.
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: calculationType === IncentiveCalculationType.PercentageOnTarget ? alpha('#2e7d32', 0.08) : alpha('#1976d2', 0.08),
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: calculationType === IncentiveCalculationType.PercentageOnTarget ? alpha('#2e7d32', 0.3) : alpha('#1976d2', 0.3)
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: calculationType === IncentiveCalculationType.PercentageOnTarget ? '#2e7d32' : '#1976d2' }}>
                  {calculationType === IncentiveCalculationType.PercentageOnTarget
                    ? 'Percentage-Based Incentives'
                    : 'Fixed Amount Incentives'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Each tier requires three values: <strong>From Value</strong>, <strong>To Value</strong>, and <strong>Incentive Value</strong>.
                  The incentive value should be {calculationType === IncentiveCalculationType.PercentageOnTarget
                    ? 'a percentage (0-100%)'
                    : 'a fixed amount'} based on your calculation type.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Example:</strong> Tier 1: From 0 To 1000 = {calculationType === IncentiveCalculationType.PercentageOnTarget
                    ? '5%, Tier 2: From 1000 To 2000 = 10%'
                    : '$500, Tier 2: From 1000 To 2000 = $1000'}
                </Typography>
              </Box>
            </Box>

            {tiers.map((tier, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: alpha('#00b8a9', 0.05),
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: alpha('#00b8a9', 0.2)
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: '#00b8a9',
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1
                        }}
                      >
                        {tier.level}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Tier {tier.level}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={() => handleRemoveTier(index)}
                      disabled={tiers.length <= 1}
                      sx={{
                        color: 'error.main',
                        '&.Mui-disabled': {
                          color: 'action.disabled'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {/* Visual range indicator */}
                  <Box sx={{ mb: 2, px: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#00b8a9',
                        mr: 1
                      }} />
                      Range: When value is between {tier.fromValue} and {tier.toValue}
                    </Typography>
                  </Box>

                  {/* All fields in rows */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* First row: From Value and To Value */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      {/* From Value */}
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="From Value *"
                          type="number"
                          value={tier.fromValue}
                          onChange={(e) => handleTierChange(index, 'fromValue', Number(e.target.value))}
                          error={!!tierErrors[index]?.fromValue}
                          helperText={tierErrors[index]?.fromValue || 'Min'}
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

                      {/* To Value */}
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="To Value *"
                          type="number"
                          value={tier.toValue}
                          onChange={(e) => handleTierChange(index, 'toValue', Number(e.target.value))}
                          error={!!tierErrors[index]?.toValue}
                          helperText={tierErrors[index]?.toValue || 'Max'}
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

                    {/* Second row: Incentive Value and Currency Type */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      {/* Incentive Value */}
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="Incentive Value *"
                          type="number"
                          value={tier.incentiveValue}
                          onChange={(e) => handleTierChange(index, 'incentiveValue', Number(e.target.value))}
                          error={!!tierErrors[index]?.incentiveValue}
                          helperText={tierErrors[index]?.incentiveValue || (
                            calculationType === IncentiveCalculationType.PercentageOnTarget
                              ? '%'
                              : 'Amount'
                          )}
                          sx={{
                            '& .MuiInputLabel-root': {
                              color: calculationType === IncentiveCalculationType.PercentageOnTarget ? '#2e7d32' : '#1976d2'
                            },
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: calculationType === IncentiveCalculationType.PercentageOnTarget ? '#2e7d32' : '#1976d2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: calculationType === IncentiveCalculationType.PercentageOnTarget ? '#2e7d32' : '#1976d2',
                              },
                            }
                          }}
                        />
                      </Box>

                      {/* Currency Type - only show if not percentage based */}
                      {calculationType !== IncentiveCalculationType.PercentageOnTarget && (
                        <Box sx={{ flex: 1 }}>
                          <FormControl fullWidth>
                            <InputLabel>Currency Type *</InputLabel>
                            <Select
                              value={tier.currencyType}
                              label="Currency Type *"
                              onChange={(e) => handleTierChange(index, 'currencyType', e.target.value as CurrencyType)}
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
                      )}
                    </Box>
                  </Box>

                  {/* Result indicator */}
                  <Box sx={{ mt: 2, px: 1 }}>
                    <Typography variant="caption" sx={{
                      color: calculationType === IncentiveCalculationType.PercentageOnTarget ? '#2e7d32' : '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 'medium'
                    }}>
                      <Box component="span" sx={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: calculationType === IncentiveCalculationType.PercentageOnTarget ? '#2e7d32' : '#1976d2',
                        mr: 1
                      }} />
                      Result: When in this range, incentive will be {calculationType === IncentiveCalculationType.PercentageOnTarget
                        ? `${tier.incentiveValue}% of target`
                        : `${tier.currencyType === CurrencyType.Rupees ? '₹' : '$'}${tier.incentiveValue}`}
                    </Typography>
                  </Box>
                </Box>

                {index < tiers.length - 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, position: 'relative' }}>
                    <Box sx={{
                      width: '2px',
                      height: '24px',
                      bgcolor: alpha('#00b8a9', 0.5),
                      borderRadius: '4px'
                    }} />

                    {/* Connector label showing that tiers connect */}
                    <Box
                      sx={{
                        position: 'absolute',
                        right: { xs: 'auto', sm: '30%' },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: alpha('#00b8a9', 0.1),
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        color: '#00b8a9',
                        fontWeight: 'medium'
                      }}
                    >
                      Tier {tier.level} ends at {tier.toValue} where Tier {tier.level + 1} begins
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
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

export default ModernTieredBasedPlanForm;
