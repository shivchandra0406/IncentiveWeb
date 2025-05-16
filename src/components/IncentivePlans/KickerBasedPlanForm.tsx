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
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BasePlanForm from './BasePlanForm';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  AwardType
} from '../../core/models/incentivePlanTypes';
import {
  getMetricTypeLabel,
  getAwardTypeLabel
} from '../../utils/enumLabels';

import type { CreateKickerIncentivePlanRequest } from '../../core/models/incentivePlanTypes';

interface FormErrors {
  planName?: string;
  periodType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  metricType?: string;
  targetValue?: string;
  consistencyMonths?: string;
  awardType?: string;
  awardValue?: string;
  giftDescription?: string;
}

const KickerBasedPlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Base plan fields
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Kicker-based specific fields
  const [location, setLocation] = useState('');
  const [metricType, setMetricType] = useState<MetricType>(MetricType.BookingValue);
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [consistencyMonths, setConsistencyMonths] = useState<number | ''>('');
  const [awardType, setAwardType] = useState<AwardType>(AwardType.Cash);
  const [awardValue, setAwardValue] = useState<number | ''>('');
  const [giftDescription, setGiftDescription] = useState('');

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

      const response = await incentivePlanService.getKickerPlanById(id);
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

        // Set kicker-based specific fields
        setLocation(plan.location);
        setMetricType(plan.metricType);
        setTargetValue(plan.targetValue);
        setConsistencyMonths(plan.consistencyMonths);
        setAwardType(plan.awardType);
        setAwardValue(plan.awardValue || '');
        setGiftDescription(plan.giftDescription || '');
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

  const handleAwardTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAwardType(event.target.value as AwardType);

    // Reset award value or gift description when switching types
    if (event.target.value === AwardType.Cash) {
      setGiftDescription('');
    } else {
      setAwardValue('');
    }
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

    // Validate kicker-based specific fields
    if (!location.trim()) {
      errors.location = 'Location is required';
    }

    if (!metricType) {
      errors.metricType = 'Metric type is required';
    }

    if (!targetValue && targetValue !== 0) {
      errors.targetValue = 'Target value is required';
    }

    if (!consistencyMonths) {
      errors.consistencyMonths = 'Consistency months is required';
    }

    if (!awardType) {
      errors.awardType = 'Award type is required';
    }

    if (awardType === AwardType.Cash && !awardValue && awardValue !== 0) {
      errors.awardValue = 'Award value is required for cash awards';
    }

    if (awardType === AwardType.Gift && !giftDescription.trim()) {
      errors.giftDescription = 'Gift description is required for gift awards';
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
        planType: IncentivePlanType.KickerBased,
        periodType,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        isActive,
        location,
        metricType,
        targetValue: Number(targetValue),
        consistencyMonths: Number(consistencyMonths),
        awardType,
        awardValue: awardType === AwardType.Cash && awardValue !== '' ? Number(awardValue) : undefined,
        giftDescription: awardType === AwardType.Gift ? giftDescription : undefined
      };

      let response;

      if (isEditMode && id) {
        response = await incentivePlanService.updateKickerPlan(id, planData);
      } else {
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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit' : 'Create'} Kicker-Based Incentive Plan
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
          Kicker Configuration
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!formErrors.location}
              helperText={formErrors.location}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.metricType}>
              <InputLabel>Metric Type *</InputLabel>
              <Select
                value={metricType}
                label="Metric Type *"
                onChange={handleMetricTypeChange}
              >
                <MenuItem value={MetricType.BookingValue}>{getMetricTypeLabel(MetricType.BookingValue)}</MenuItem>
                <MenuItem value={MetricType.UnitsSold}>{getMetricTypeLabel(MetricType.UnitsSold)}</MenuItem>
                <MenuItem value={MetricType.Revenue}>{getMetricTypeLabel(MetricType.Revenue)}</MenuItem>
              </Select>
              {formErrors.metricType && <FormHelperText>{formErrors.metricType}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target Value *"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.targetValue}
              helperText={formErrors.targetValue}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Consistency Months *"
              type="number"
              value={consistencyMonths}
              onChange={(e) => setConsistencyMonths(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.consistencyMonths}
              helperText={formErrors.consistencyMonths || 'Number of consecutive months to maintain target'}
              InputProps={{ inputProps: { min: 1, max: 12 } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Award Configuration
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!formErrors.awardType}>
              <FormLabel component="legend">Award Type *</FormLabel>
              <RadioGroup
                row
                value={awardType}
                onChange={handleAwardTypeChange}
              >
                <FormControlLabel value={AwardType.Cash} control={<Radio />} label={getAwardTypeLabel(AwardType.Cash)} />
                <FormControlLabel value={AwardType.Gift} control={<Radio />} label={getAwardTypeLabel(AwardType.Gift)} />
              </RadioGroup>
              {formErrors.awardType && <FormHelperText>{formErrors.awardType}</FormHelperText>}
            </FormControl>
          </Grid>

          {awardType === AwardType.Cash && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Award Value *"
                type="number"
                value={awardValue}
                onChange={(e) => setAwardValue(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!formErrors.awardValue}
                helperText={formErrors.awardValue}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          )}

          {awardType === AwardType.Gift && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Gift Description *"
                value={giftDescription}
                onChange={(e) => setGiftDescription(e.target.value)}
                error={!!formErrors.giftDescription}
                helperText={formErrors.giftDescription}
                multiline
                rows={3}
              />
            </Grid>
          )}
        </Grid>

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

export default KickerBasedPlanForm;
