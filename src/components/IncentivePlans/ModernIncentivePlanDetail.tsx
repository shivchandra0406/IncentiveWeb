import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  Edit as EditIcon
} from '@mui/icons-material';
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

const ModernIncentivePlanDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        setPlan(response.data);
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
        planTypeStr = String(plan.planType).toLowerCase();
    }

    navigate(`/incentive-plans/edit/${planTypeStr}/${id}`);
  };

  // Get status color based on plan status
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  // Get status label based on plan status
  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  // Render option pill/tag with tooltip
  const renderOptionPill = (
    isEnabled: boolean,
    enabledLabel: string,
    disabledLabel: string,
    tooltipText: string
  ) => (
    <Tooltip title={tooltipText} arrow>
      <Chip
        label={isEnabled ? enabledLabel : disabledLabel}
        color={isEnabled ? 'primary' : 'default'}
        size="small"
        sx={{
          mr: 1,
          mb: 1,
          borderRadius: '16px',
          backgroundColor: isEnabled ? 'primary.light' : 'grey.100',
          color: isEnabled ? 'primary.dark' : 'text.secondary',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: isEnabled ? 'primary.main' : 'grey.200',
            color: isEnabled ? 'white' : 'text.primary',
          }
        }}
      />
    </Tooltip>
  );

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (!plan) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No plan details found.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with back button and actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto'
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/incentive-plans')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: 600
            }}
          >
            {plan.planName}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            ml: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Edit Plan
        </Button>
      </Box>

      {/* Basic Information Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: '1.25rem'
            }}
          >
            Basic Information
          </Typography>

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      mb: 0.5
                    }}
                  >
                    Plan Type
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {getIncentivePlanTypeLabel(plan.planType)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      mb: 0.5
                    }}
                  >
                    Period Type
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                  >
                    {getPeriodTypeLabel(plan.periodType)}
                  </Typography>
                </Grid>

                {plan.startDate && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        mb: 0.5
                      }}
                    >
                      Start Date
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary'
                      }}
                    >
                      {new Date(plan.startDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}

                {plan.endDate && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        mb: 0.5
                      }}
                    >
                      End Date
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary'
                      }}
                    >
                      {new Date(plan.endDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      mb: 0.5
                    }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={getStatusLabel(plan.isActive)}
                    color={getStatusColor(plan.isActive)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: '8px',
                      px: 1
                    }}
                  />
                </Grid>

                {plan.createdAt && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        mb: 0.5
                      }}
                    >
                      Created At
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary'
                      }}
                    >
                      {new Date(plan.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}

                {plan.lastModifiedAt && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        mb: 0.5
                      }}
                    >
                      Last Modified At
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary'
                      }}
                    >
                      {new Date(plan.lastModifiedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Plan Details Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: '1.25rem'
            }}
          >
            Plan Details
          </Typography>

          {/* Render plan-specific details based on plan type */}
          {plan.planType === IncentivePlanType.TargetBased && (
            <TargetBasedDetails plan={plan as TargetBasedIncentivePlan} renderOptionPill={renderOptionPill} />
          )}

          {plan.planType === IncentivePlanType.RoleBased && (
            <RoleBasedDetails plan={plan as RoleBasedIncentivePlan} renderOptionPill={renderOptionPill} />
          )}

          {plan.planType === IncentivePlanType.ProjectBased && (
            <ProjectBasedDetails plan={plan as ProjectBasedIncentivePlan} renderOptionPill={renderOptionPill} />
          )}

          {plan.planType === IncentivePlanType.KickerBased && (
            <KickerBasedDetails plan={plan as KickerIncentivePlan} />
          )}

          {plan.planType === IncentivePlanType.TieredBased && (
            <TieredBasedDetails plan={plan as TieredIncentivePlan} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Target-Based Plan Details Component
interface PlanDetailsProps {
  renderOptionPill: (
    isEnabled: boolean,
    enabledLabel: string,
    disabledLabel: string,
    tooltipText: string
  ) => JSX.Element;
}

const TargetBasedDetails: React.FC<{
  plan: TargetBasedIncentivePlan;
  renderOptionPill: PlanDetailsProps['renderOptionPill'];
}> = ({ plan, renderOptionPill }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Grid container spacing={3}>
        {/* First row */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Target Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getTargetTypeLabel(plan.targetType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Metric Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getMetricTypeLabel(plan.metricType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Target Value
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.targetValue}
            </Typography>
          </Box>
        </Grid>

        {/* Second row */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Calculation Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getCalculationTypeLabel(plan.calculationType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Incentive Value
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.incentiveValue}
              {plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
            </Typography>
          </Box>
        </Grid>

        {plan.targetType === TargetType.SalaryBased && (
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 0.5
                }}
              >
                Salary
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                {plan.salary}%
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Options Section */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5
          }}
        >
          Options
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {renderOptionPill(
            plan.isCumulative,
            'Cumulative',
            'Non-Cumulative',
            'When enabled, incentives are calculated cumulatively across periods'
          )}

          {renderOptionPill(
            plan.incentiveAfterExceedingTarget,
            'Incentive After Exceeding Target',
            'No Incentive After Target',
            'When enabled, incentives continue to be earned after exceeding the target'
          )}

          {renderOptionPill(
            plan.includeSalaryInTarget,
            'Include Salary In Target',
            'Exclude Salary From Target',
            'When enabled, base salary is included in target calculations'
          )}

          {plan.provideAdditionalIncentiveOnExceeding && (
            <Tooltip title="Additional percentage incentive on exceeding target" arrow>
              <Chip
                label={`Additional ${plan.additionalIncentiveOnExceeding}% on Exceeding`}
                color="primary"
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  borderRadius: '16px',
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Role-Based Plan Details Component
const RoleBasedDetails: React.FC<{
  plan: RoleBasedIncentivePlan;
  renderOptionPill: PlanDetailsProps['renderOptionPill'];
}> = ({ plan, renderOptionPill }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* First row */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Role
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.role}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Team Based
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.isTeamBased ? 'Yes' : 'No'}
            </Typography>
          </Box>
        </Grid>

        {plan.isTeamBased && plan.teamId && (
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 0.5
                }}
              >
                Team ID
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                {plan.teamId}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Target Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getTargetTypeLabel(plan.targetType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Calculation Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getCalculationTypeLabel(plan.calculationType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Incentive Value
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.incentiveValue}
              {plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Options Section */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5
          }}
        >
          Options
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {renderOptionPill(
            plan.isCumulative,
            'Cumulative',
            'Non-Cumulative',
            'When enabled, incentives are calculated cumulatively across periods'
          )}

          {renderOptionPill(
            plan.incentiveAfterExceedingTarget,
            'Incentive After Exceeding Target',
            'No Incentive After Target',
            'When enabled, incentives continue to be earned after exceeding the target'
          )}

          {renderOptionPill(
            plan.includeSalaryInTarget,
            'Include Salary In Target',
            'Exclude Salary From Target',
            'When enabled, base salary is included in target calculations'
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Project-Based Plan Details Component
const ProjectBasedDetails: React.FC<{
  plan: ProjectBasedIncentivePlan;
  renderOptionPill: PlanDetailsProps['renderOptionPill'];
}> = ({ plan, renderOptionPill }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Project
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.projectName}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Calculation Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getCalculationTypeLabel(plan.calculationType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Incentive Value
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.incentiveValue}
              {plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Options Section */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5
          }}
        >
          Options
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {renderOptionPill(
            plan.isCumulative,
            'Cumulative',
            'Non-Cumulative',
            'When enabled, incentives are calculated cumulatively across periods'
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Kicker-Based Plan Details Component
const KickerBasedDetails: React.FC<{ plan: KickerIncentivePlan }> = ({ plan }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Location
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.location}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Metric Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getMetricTypeLabel(plan.metricType)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Target Value
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.targetValue}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Consistency Months
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {plan.consistencyMonths}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Award Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getAwardTypeLabel(plan.awardType)}
            </Typography>
          </Box>
        </Grid>

        {plan.awardType === AwardType.Cash && plan.awardValue && (
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 0.5
                }}
              >
                Award Value
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                {plan.awardValue}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {plan.awardType === AwardType.Gift && plan.giftDescription && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              mb: 0.5
            }}
          >
            Gift Description
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: 'text.primary'
            }}
          >
            {plan.giftDescription}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Tiered-Based Plan Details Component
const TieredBasedDetails: React.FC<{ plan: TieredIncentivePlan }> = ({ plan }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5
              }}
            >
              Metric Type
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: 'text.primary'
              }}
            >
              {getMetricTypeLabel(plan.metricType)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mt: 3,
          mb: 2
        }}
      >
        Tiers
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>From Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>To Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Calculation Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Incentive Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plan.tiers.map((tier, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 184, 169, 0.04)'
                  }
                }}
              >
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
    </Box>
  );
};

export default ModernIncentivePlanDetail;
