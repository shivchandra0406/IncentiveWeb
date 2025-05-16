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
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BasePlanForm from './BasePlanForm';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  IncentiveCalculationType
} from '../../core/models/incentivePlanTypes';
import type { CreateProjectBasedIncentivePlanRequest,Project } from '../../core/models/incentivePlanTypes';

interface FormErrors {
  planName?: string;
  periodType?: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  metricType?: string;
  targetValue?: string;
  calculationType?: string;
  incentiveValue?: string;
}

const ProjectBasedPlanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Base plan fields
  const [planName, setPlanName] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.Monthly);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);
  
  // Project-based specific fields
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [metricType, setMetricType] = useState<MetricType>(MetricType.BookingValue);
  const [targetValue, setTargetValue] = useState<number | ''>('');
  const [calculationType, setCalculationType] = useState<IncentiveCalculationType>(IncentiveCalculationType.FixedAmount);
  const [incentiveValue, setIncentiveValue] = useState<number | ''>('');
  const [incentiveAfterExceedingTarget, setIncentiveAfterExceedingTarget] = useState(false);
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  useEffect(() => {
    fetchProjects();
    
    if (isEditMode) {
      fetchPlanDetails();
    }
  }, [id]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await incentivePlanService.getProjects();
      setProjects(projectsData);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPlanDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await incentivePlanService.getProjectBasedPlanById(id);
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
        
        // Set project-based specific fields
        setProjectId(plan.projectId);
        setMetricType(plan.metricType);
        setTargetValue(plan.targetValue);
        setCalculationType(plan.calculationType);
        setIncentiveValue(plan.incentiveValue);
        setIncentiveAfterExceedingTarget(plan.incentiveAfterExceedingTarget);
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
  
  const handleCalculationTypeChange = (event: SelectChangeEvent) => {
    setCalculationType(event.target.value as IncentiveCalculationType);
  };
  
  const handleProjectChange = (event: SelectChangeEvent) => {
    setProjectId(event.target.value);
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
    
    // Validate project-based specific fields
    if (!projectId) {
      errors.projectId = 'Project is required';
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
      
      const planData: CreateProjectBasedIncentivePlanRequest = {
        planName,
        planType: IncentivePlanType.ProjectBased,
        periodType,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        isActive,
        projectId,
        metricType,
        targetValue: Number(targetValue),
        calculationType,
        incentiveValue: Number(incentiveValue),
        incentiveAfterExceedingTarget
      };
      
      let response;
      
      if (isEditMode && id) {
        response = await incentivePlanService.updateProjectBasedPlan(id, planData);
      } else {
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
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isEditMode ? 'Edit' : 'Create'} Project-Based Incentive Plan
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
          Project Configuration
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!formErrors.projectId}>
              <InputLabel>Project *</InputLabel>
              <Select
                value={projectId}
                label="Project *"
                onChange={handleProjectChange}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                ))}
              </Select>
              {formErrors.projectId && <FormHelperText>{formErrors.projectId}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Target Configuration
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
            <FormControl fullWidth error={!!formErrors.calculationType}>
              <InputLabel>Calculation Type *</InputLabel>
              <Select
                value={calculationType}
                label="Calculation Type *"
                onChange={handleCalculationTypeChange}
              >
                <MenuItem value={IncentiveCalculationType.FixedAmount}>Fixed Amount</MenuItem>
                <MenuItem value={IncentiveCalculationType.PercentageOnTarget}>Percentage on Target</MenuItem>
              </Select>
              {formErrors.calculationType && <FormHelperText>{formErrors.calculationType}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Incentive ${calculationType === IncentiveCalculationType.FixedAmount ? 'Amount' : 'Percentage'} *`}
              type="number"
              value={incentiveValue}
              onChange={(e) => setIncentiveValue(e.target.value === '' ? '' : Number(e.target.value))}
              error={!!formErrors.incentiveValue}
              helperText={formErrors.incentiveValue}
              InputProps={{ 
                inputProps: { 
                  min: 0,
                  max: calculationType === IncentiveCalculationType.PercentageOnTarget ? 100 : undefined
                } 
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={incentiveAfterExceedingTarget}
                  onChange={(e) => setIncentiveAfterExceedingTarget(e.target.checked)}
                />
              }
              label="Provide incentive after exceeding target"
            />
          </Grid>
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

export default ProjectBasedPlanForm;
