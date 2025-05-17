import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import BasePlanForm from './BasePlanForm';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  IncentiveCalculationType
} from '../../core/models/incentivePlanTypes';

import type {TieredIncentiveTier,CreateTieredIncentivePlanRequest } from '../../core/models/incentivePlanTypes';

interface FormErrors {
  planName?: string;
  periodType?: string;
  startDate?: string;
  endDate?: string;
  metricType?: string;
  tiers?: string;
  tierErrors?: {
    fromValue?: string;
    toValue?: string;
    incentiveValue?: string;
    calculationType?: string;
  }[];
}

const TieredBasedPlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Base plan fields
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  
  // Tiered-based specific fields
  const [metricType, setMetricType] = useState<MetricType>(MetricType.BookingValue);
  const [tiers, setTiers] = useState<TieredIncentiveTier[]>([
    {
      fromValue: 0,
      toValue: 0,
      incentiveValue: 0,
      calculationType: IncentiveCalculationType.FixedAmount
    }
  ]);
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  useEffect(() => {
    if (isEditMode) {
      fetchPlanDetails();
    }
  }, [id]);
  
  const fetchPlanDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await incentivePlanService.getTieredPlanById(id);
      if (response.succeeded) {
        const plan = response.data;
        
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
        
        // Set tiered-based specific fields
        setMetricType(plan.metricType);
        setTiers(plan.tiers.length > 0 ? plan.tiers : [
          {
            fromValue: 0,
            toValue: 0,
            incentiveValue: 0,
            calculationType: IncentiveCalculationType.FixedAmount
          }
        ]);
      } else {
        setError(response.message || 'Failed to fetch incentive plan details');
      }
    } catch (err: any) {
      console.error('Error fetching incentive plan details:', err);
      setError(err.message || 'An error occurred while fetching incentive plan details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleMetricTypeChange = (event: SelectChangeEvent) => {
    setMetricType(event.target.value as MetricType);
  };
  
  const handleAddTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newTier: TieredIncentiveTier = {
      fromValue: lastTier.toValue,
      toValue: lastTier.toValue + 1000,
      incentiveValue: 0,
      calculationType: IncentiveCalculationType.FixedAmount
    };
    
    setTiers([...tiers, newTier]);
  };
  
  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) {
      return;
    }
    
    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    setTiers(newTiers);
  };
  
  const handleTierChange = (index: number, field: keyof TieredIncentiveTier, value: any) => {
    const newTiers = [...tiers];
    
    if (field === 'calculationType') {
      newTiers[index][field] = value as IncentiveCalculationType;
    } else {
      newTiers[index][field] = Number(value);
    }
    
    // If changing fromValue, update the previous tier's toValue
    if (field === 'fromValue' && index > 0) {
      newTiers[index - 1].toValue = Number(value);
    }
    
    // If changing toValue, update the next tier's fromValue
    if (field === 'toValue' && index < tiers.length - 1) {
      newTiers[index + 1].fromValue = Number(value);
    }
    
    setTiers(newTiers);
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
    
    // Validate tiered-based specific fields
    if (!metricType) {
      errors.metricType = 'Metric type is required';
    }
    
    if (tiers.length === 0) {
      errors.tiers = 'At least one tier is required';
    } else {
      const tierErrors: any[] = [];
      let hasErrors = false;
      
      tiers.forEach((tier, index) => {
        const tierError: any = {};
        
        if (tier.fromValue < 0) {
          tierError.fromValue = 'From value must be non-negative';
          hasErrors = true;
        }
        
        if (tier.toValue <= tier.fromValue) {
          tierError.toValue = 'To value must be greater than from value';
          hasErrors = true;
        }
        
        if (tier.incentiveValue < 0) {
          tierError.incentiveValue = 'Incentive value must be non-negative';
          hasErrors = true;
        }
        
        if (tier.calculationType === IncentiveCalculationType.PercentageOnTarget && tier.incentiveValue > 100) {
          tierError.incentiveValue = 'Percentage cannot exceed 100%';
          hasErrors = true;
        }
        
        tierErrors[index] = tierError;
      });
      
      if (hasErrors) {
        errors.tierErrors = tierErrors;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0 && !errors.tierErrors;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const planData: CreateTieredIncentivePlanRequest = {
        planName,
        planType: IncentivePlanType.TieredBased,
        periodType,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        isActive,
        metricType,
        tiers
      };
      
      let response;
      
      if (isEditMode && id) {
        response = await incentivePlanService.updateTieredPlan(id, planData);
      } else {
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
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit' : 'Create'} Tiered-Based Incentive Plan
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        
        <BasePlanForm
          planName={planName}
          setPlanName={setPlanName}
          periodType={periodType}
          setPeriodType={setPeriodType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          isActive={isActive}
          setIsActive={setIsActive}
          errors={formErrors}
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Metric Configuration
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.metricType}>
              <InputLabel>Metric Type *</InputLabel>
              <Select
                value={metricType}
                label="Metric Type *"
                onChange={handleMetricTypeChange}
              >
                <MenuItem value={MetricType.BookingValue}>Booking Value</MenuItem>
                <MenuItem value={MetricType.UnitsSold}>Units Sold</MenuItem>
                <MenuItem value={MetricType.Revenue}>Revenue</MenuItem>
              </Select>
              {formErrors.metricType && <FormHelperText>{formErrors.metricType}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Tier Configuration
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddTier}
          >
            Add Tier
          </Button>
        </Box>
        
        {formErrors.tiers && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formErrors.tiers}
          </Alert>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From Value</TableCell>
                <TableCell>To Value</TableCell>
                <TableCell>Calculation Type</TableCell>
                <TableCell>Incentive Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tiers.map((tier, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={tier.fromValue}
                      onChange={(e) => handleTierChange(index, 'fromValue', e.target.value === '' ? 0 : e.target.value)}
                      error={!!(formErrors.tierErrors && formErrors.tierErrors[index]?.fromValue)}
                      helperText={formErrors.tierErrors && formErrors.tierErrors[index]?.fromValue}
                      InputProps={{ inputProps: { min: 0 } }}
                      disabled={index > 0} // Only first tier's fromValue can be edited directly
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={tier.toValue}
                      onChange={(e) => handleTierChange(index, 'toValue', e.target.value === '' ? 0 : e.target.value)}
                      error={!!(formErrors.tierErrors && formErrors.tierErrors[index]?.toValue)}
                      helperText={formErrors.tierErrors && formErrors.tierErrors[index]?.toValue}
                      InputProps={{ inputProps: { min: tier.fromValue } }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        value={tier.calculationType}
                        onChange={(e) => handleTierChange(index, 'calculationType', e.target.value)}
                        size="small"
                      >
                        <MenuItem value={IncentiveCalculationType.FixedAmount}>Fixed Amount</MenuItem>
                        <MenuItem value={IncentiveCalculationType.PercentageOnTarget}>Percentage</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={tier.incentiveValue}
                      onChange={(e) => handleTierChange(index, 'incentiveValue', e.target.value === '' ? 0 : e.target.value)}
                      error={!!(formErrors.tierErrors && formErrors.tierErrors[index]?.incentiveValue)}
                      helperText={formErrors.tierErrors && formErrors.tierErrors[index]?.incentiveValue}
                      InputProps={{ 
                        inputProps: { 
                          min: 0,
                          max: tier.calculationType === IncentiveCalculationType.PercentageOnTarget ? 100 : undefined
                        } 
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTier(index)}
                      disabled={tiers.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/incentive-plans')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {isEditMode ? 'Update' : 'Create'} Plan
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TieredBasedPlanForm;
