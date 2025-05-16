import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  TargetType,
  IncentiveCalculationType,
  AwardType
} from '../../core/models/incentivePlanTypes';
import {
  getIncentivePlanTypeLabel,
  getPeriodTypeLabel,
  getMetricTypeLabel,
  getTargetTypeLabel,
  getCalculationTypeLabel,
  getAwardTypeLabel
} from '../../utils/enumLabels';

import type { IncentivePlanBase,
  TargetBasedIncentivePlan,
  RoleBasedIncentivePlan,
  ProjectBasedIncentivePlan,
  KickerIncentivePlan,
  TieredIncentivePlan
} from '../../core/models/incentivePlanTypes';

const IncentivePlanDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<IncentivePlanBase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlanDetails();
    }
  }, [id, type]);

  const fetchPlanDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Use a unified approach to fetch the plan by ID
      const response = await incentivePlanService.getIncentivePlanById(id);

      if (response.succeeded) {
        // The plan data will have numeric enum values converted to string enum values
        // by our enhanced API client wrapper
        setPlan(response.data);

        // Log the plan data for debugging
        console.log('Fetched plan data:', response.data);
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

  const handleEdit = () => {
    if (!plan) return;

    // Get the plan type as a string for the URL
    let planTypeStr = '';

    switch (plan.planType) {
      case IncentivePlanType.TargetBased:
        planTypeStr = 'targetbased';
        break;
      case IncentivePlanType.RoleBased:
        planTypeStr = 'rolebased';
        break;
      case IncentivePlanType.ProjectBased:
        planTypeStr = 'projectbased';
        break;
      case IncentivePlanType.KickerBased:
        planTypeStr = 'kickerbased';
        break;
      case IncentivePlanType.TieredBased:
        planTypeStr = 'tieredbased';
        break;
      default:
        // If we can't determine the plan type, use the string value and convert to lowercase
        planTypeStr = String(plan.planType).toLowerCase();
    }

    navigate(`/incentive-plans/edit/${planTypeStr}/${id}`);
  };

  // Using the utility functions from enumLabels.ts for displaying human-readable labels

  const renderTargetBasedDetails = (plan: TargetBasedIncentivePlan) => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Target Type</Typography>
          <Typography variant="body1">{getTargetTypeLabel(plan.targetType)}</Typography>
        </Grid>

        {plan.targetType === TargetType.SalaryBased && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Salary</Typography>
            <Typography variant="body1">{plan.salary}%</Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Metric Type</Typography>
          <Typography variant="body1">{getMetricTypeLabel(plan.metricType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Target Value</Typography>
          <Typography variant="body1">{plan.targetValue}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Calculation Type</Typography>
          <Typography variant="body1">{getCalculationTypeLabel(plan.calculationType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Incentive Value</Typography>
          <Typography variant="body1">
            {plan.incentiveValue}{plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2">Options</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={plan.isCumulative ? 'Cumulative' : 'Non-Cumulative'}
              color={plan.isCumulative ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={plan.incentiveAfterExceedingTarget ? 'Incentive After Exceeding Target' : 'No Incentive After Target'}
              color={plan.incentiveAfterExceedingTarget ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={plan.includeSalaryInTarget ? 'Include Salary In Target' : 'Exclude Salary From Target'}
              color={plan.includeSalaryInTarget ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );

  const renderRoleBasedDetails = (plan: RoleBasedIncentivePlan) => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Role</Typography>
          <Typography variant="body1">{plan.role}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Team Based</Typography>
          <Typography variant="body1">{plan.isTeamBased ? 'Yes' : 'No'}</Typography>
        </Grid>

        {plan.isTeamBased && plan.teamId && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Team ID</Typography>
            <Typography variant="body1">{plan.teamId}</Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Target Type</Typography>
          <Typography variant="body1">{getTargetTypeLabel(plan.targetType)}</Typography>
        </Grid>

        {plan.targetType === TargetType.SalaryBased && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Salary Percentage</Typography>
            <Typography variant="body1">{plan.salaryPercentage}%</Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Metric Type</Typography>
          <Typography variant="body1">{getMetricTypeLabel(plan.metricType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Target Value</Typography>
          <Typography variant="body1">{plan.targetValue}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Calculation Type</Typography>
          <Typography variant="body1">{getCalculationTypeLabel(plan.calculationType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Incentive Value</Typography>
          <Typography variant="body1">
            {plan.incentiveValue}{plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2">Options</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={plan.isCumulative ? 'Cumulative' : 'Non-Cumulative'}
              color={plan.isCumulative ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={plan.incentiveAfterExceedingTarget ? 'Incentive After Exceeding Target' : 'No Incentive After Target'}
              color={plan.incentiveAfterExceedingTarget ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={plan.includeSalaryInTarget ? 'Include Salary In Target' : 'Exclude Salary From Target'}
              color={plan.includeSalaryInTarget ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );

  const renderProjectBasedDetails = (plan: ProjectBasedIncentivePlan) => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Project ID</Typography>
          <Typography variant="body1">{plan.projectId}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Metric Type</Typography>
          <Typography variant="body1">{getMetricTypeLabel(plan.metricType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Target Value</Typography>
          <Typography variant="body1">{plan.targetValue}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Calculation Type</Typography>
          <Typography variant="body1">{getCalculationTypeLabel(plan.calculationType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Incentive Value</Typography>
          <Typography variant="body1">
            {plan.incentiveValue}{plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2">Options</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={plan.incentiveAfterExceedingTarget ? 'Incentive After Exceeding Target' : 'No Incentive After Target'}
              color={plan.incentiveAfterExceedingTarget ? 'success' : 'default'}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );

  const renderKickerBasedDetails = (plan: KickerIncentivePlan) => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Location</Typography>
          <Typography variant="body1">{plan.location}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Metric Type</Typography>
          <Typography variant="body1">{getMetricTypeLabel(plan.metricType)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Target Value</Typography>
          <Typography variant="body1">{plan.targetValue}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Consistency Months</Typography>
          <Typography variant="body1">{plan.consistencyMonths}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Award Type</Typography>
          <Typography variant="body1">{getAwardTypeLabel(plan.awardType)}</Typography>
        </Grid>

        {plan.awardType === AwardType.Cash && plan.awardValue && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Award Value</Typography>
            <Typography variant="body1">{plan.awardValue}</Typography>
          </Grid>
        )}

        {plan.awardType === AwardType.Gift && plan.giftDescription && (
          <Grid item xs={12}>
            <Typography variant="subtitle2">Gift Description</Typography>
            <Typography variant="body1">{plan.giftDescription}</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );

  const renderTieredBasedDetails = (plan: TieredIncentivePlan) => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Metric Type</Typography>
          <Typography variant="body1">{getMetricTypeLabel(plan.metricType)}</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Tiers</Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From Value</TableCell>
              <TableCell>To Value</TableCell>
              <TableCell>Calculation Type</TableCell>
              <TableCell>Incentive Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plan.tiers.map((tier, index) => (
              <TableRow key={index}>
                <TableCell>{tier.fromValue}</TableCell>
                <TableCell>{tier.toValue}</TableCell>
                <TableCell>{getCalculationTypeLabel(tier.calculationType)}</TableCell>
                <TableCell>
                  {tier.incentiveValue}
                  {tier.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderPlanDetails = () => {
    if (!plan) return null;

    switch (plan.planType) {
      case IncentivePlanType.TargetBased:
        return renderTargetBasedDetails(plan as TargetBasedIncentivePlan);
      case IncentivePlanType.RoleBased:
        return renderRoleBasedDetails(plan as RoleBasedIncentivePlan);
      case IncentivePlanType.ProjectBased:
        return renderProjectBasedDetails(plan as ProjectBasedIncentivePlan);
      case IncentivePlanType.KickerBased:
        return renderKickerBasedDetails(plan as KickerIncentivePlan);
      case IncentivePlanType.TieredBased:
        return renderTieredBasedDetails(plan as TieredIncentivePlan);
      default:
        return (
          <Typography>No specific details available for this plan type.</Typography>
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!plan) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No plan details found.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/incentive-plans')}
          sx={{ mr: 2 }}
        >
          Back to List
        </Button>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {plan.planName}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit}
        >
          Edit Plan
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Plan Type</Typography>
            <Typography variant="body1">{getIncentivePlanTypeLabel(plan.planType)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Period Type</Typography>
            <Typography variant="body1">{getPeriodTypeLabel(plan.periodType)}</Typography>
          </Grid>

          {plan.startDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Start Date</Typography>
              <Typography variant="body1">{new Date(plan.startDate).toLocaleDateString()}</Typography>
            </Grid>
          )}

          {plan.endDate && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">End Date</Typography>
              <Typography variant="body1">{new Date(plan.endDate).toLocaleDateString()}</Typography>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Status</Typography>
            <Chip
              label={plan.isActive ? 'Active' : 'Inactive'}
              color={plan.isActive ? 'success' : 'default'}
              size="small"
            />
          </Grid>

          {plan.createdAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Created At</Typography>
              <Typography variant="body1">{new Date(plan.createdAt).toLocaleString()}</Typography>
            </Grid>
          )}

          {plan.lastModifiedAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Last Modified At</Typography>
              <Typography variant="body1">{new Date(plan.lastModifiedAt).toLocaleString()}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Plan Details
        </Typography>

        {renderPlanDetails()}
      </Paper>
    </Box>
  );
};

export default IncentivePlanDetail;
