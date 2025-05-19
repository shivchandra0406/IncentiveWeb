import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  useMediaQuery,
  Container,
  IconButton,
  Stack,
  alpha
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  BarChart as BarChartIcon,
  AttachMoney as AttachMoneyIcon,
  Calculate as CalculateIcon,
  Gavel as GavelIcon,
  Assessment as AssessmentIcon
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

// Render a detail item with label and value
const renderDetailItem = (label: string, value: React.ReactNode, icon?: React.ReactNode) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          mb: 1,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {icon && <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          backgroundColor: alpha(theme.palette.background.default, 0.7),
          p: 1.5,
          borderRadius: '8px',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.5)
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const VerticalIncentivePlanDetail: React.FC = () => {
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

    // Log the navigation for debugging
    console.log(`Navigating to edit page for plan type: ${planTypeStr}, ID: ${id}`);
    console.log(`API endpoints that will be called:`);
    console.log(`- For fetching: https://localhost:44307/api/incentive-plans/${id}`);
    console.log(`- For updating: https://localhost:44307/api/incentive-plans/${planTypeStr}/${id}`);

    // Navigate to the edit page
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
        size="medium"
        icon={isEnabled ? <CheckCircleIcon /> : <CancelIcon />}
        sx={{
          py: 2,
          px: 1,
          my: 0.5,
          mx: 0.5,
          borderRadius: '24px',
          backgroundColor: isEnabled ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[300], 0.5),
          color: isEnabled ? theme.palette.primary.main : theme.palette.text.secondary,
          fontWeight: 500,
          border: '1px solid',
          borderColor: isEnabled ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: isEnabled ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.grey[400], 0.3),
            transform: 'translateY(-2px)',
            boxShadow: isEnabled ? `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
          }
        }}
      />
    </Tooltip>
  );

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Render empty state
  if (!plan) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          No plan details found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <IconButton
            onClick={() => navigate('/incentive-plans')}
            sx={{
              mr: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Incentive Plan: {plan.planName}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            ml: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : 'auto',
            py: 1.2,
            px: 3,
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            }
          }}
        >
          Edit Plan
        </Button>
      </Box>

      {/* Basic Information Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.7)
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              '&::after': {
                content: '""',
                display: 'block',
                height: '2px',
                background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
                flexGrow: 1,
                ml: 2
              }
            }}
          >
            Basic Information
          </Typography>

          <Stack spacing={3}>
            {/* Plan Type */}
            {renderDetailItem('Plan Type', getIncentivePlanTypeLabel(plan.planType))}

            {/* Period Type */}
            {renderDetailItem('Period Type', getPeriodTypeLabel(plan.periodType))}

            {/* Date Range */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CalendarIcon sx={{ mr: 1, fontSize: '1rem' }} />
                Date Range
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2,
                  backgroundColor: alpha(theme.palette.background.default, 0.7),
                  p: 1.5,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.5)
                }}
              >
                {plan.startDate && (
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Start Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(plan.startDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                {plan.endDate && (
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      End Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(plan.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Status */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 1
                }}
              >
                Status
              </Typography>
              <Chip
                label={getStatusLabel(plan.isActive)}
                color={getStatusColor(plan.isActive)}
                size="medium"
                sx={{
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 2,
                  py: 2.5,
                  boxShadow: plan.isActive ? '0 2px 8px rgba(76, 175, 80, 0.2)' : '0 2px 8px rgba(244, 67, 54, 0.2)'
                }}
              />
            </Box>

            {/* Timestamps */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <TimeIcon sx={{ mr: 1, fontSize: '1rem' }} />
                Timestamps
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2,
                  backgroundColor: alpha(theme.palette.background.default, 0.7),
                  p: 1.5,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.5)
                }}
              >
                {plan.createdAt && (
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Created At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(plan.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}

                {plan.lastModifiedAt && (
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Last Modified At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(plan.lastModifiedAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Plan Details Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.7)
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              '&::after': {
                content: '""',
                display: 'block',
                height: '2px',
                background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
                flexGrow: 1,
                ml: 2
              }
            }}
          >
            Plan Details
          </Typography>

          {/* Render plan-specific details based on plan type */}
          {plan.planType === IncentivePlanType.TargetBased && (
            <TargetBasedDetails plan={plan as TargetBasedIncentivePlan} />
          )}

          {plan.planType === IncentivePlanType.RoleBased && (
            <RoleBasedDetails plan={plan as RoleBasedIncentivePlan} />
          )}

          {plan.planType === IncentivePlanType.ProjectBased && (
            <ProjectBasedDetails plan={plan as ProjectBasedIncentivePlan} />
          )}

          {plan.planType === IncentivePlanType.KickerBased && (
            <KickerBasedDetails plan={plan as KickerIncentivePlan} />
          )}

          {plan.planType === IncentivePlanType.TieredBased && (
            <TieredBasedDetails plan={plan as TieredIncentivePlan} />
          )}
        </CardContent>
      </Card>

      {/* Options Tags Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.7)
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              '&::after': {
                content: '""',
                display: 'block',
                height: '2px',
                background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
                flexGrow: 1,
                ml: 2
              }
            }}
          >
            Options
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {plan.planType === IncentivePlanType.TargetBased && (
              <TargetBasedOptions plan={plan as TargetBasedIncentivePlan} renderOptionPill={renderOptionPill} />
            )}

            {plan.planType === IncentivePlanType.RoleBased && (
              <RoleBasedOptions plan={plan as RoleBasedIncentivePlan} renderOptionPill={renderOptionPill} />
            )}

            {plan.planType === IncentivePlanType.ProjectBased && (
              <ProjectBasedOptions plan={plan as ProjectBasedIncentivePlan} renderOptionPill={renderOptionPill} />
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

// Target-Based Plan Details Component
const TargetBasedDetails: React.FC<{ plan: TargetBasedIncentivePlan }> = ({ plan }) => {
  return (
    <Stack spacing={3}>
      {renderDetailItem(
        'Target Type',
        getTargetTypeLabel(plan.targetType),
        <GavelIcon fontSize="small" />
      )}

      {renderDetailItem(
        'Metric Type',
        getMetricTypeLabel(plan.metricType),
        <BarChartIcon fontSize="small" />
      )}

      {renderDetailItem(
        'Target Value',
        plan.targetValue
      )}

      {renderDetailItem(
        'Calculation Type',
        getCalculationTypeLabel(plan.calculationType),
        <CalculateIcon fontSize="small" />
      )}

      {renderDetailItem(
        'Incentive Value',
        <>
          {plan.incentiveValue}
          {plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
        </>,
        <AttachMoneyIcon fontSize="small" />
      )}

      {plan.targetType === TargetType.SalaryBased && (
        renderDetailItem('Salary', `${plan.salary}%`)
      )}
    </Stack>
  );
};

// Role-Based Plan Details Component
const RoleBasedDetails: React.FC<{ plan: RoleBasedIncentivePlan }> = ({ plan }) => {
  return (
    <Stack spacing={3}>
      {renderDetailItem('Role', plan.role)}

      {renderDetailItem('Team Based', plan.isTeamBased ? 'Yes' : 'No')}

      {plan.isTeamBased && plan.teamId && (
        renderDetailItem('Team ID', plan.teamId)
      )}

      {renderDetailItem(
        'Target Type',
        getTargetTypeLabel(plan.targetType),
        <GavelIcon fontSize="small" />
      )}

      {renderDetailItem(
        'Calculation Type',
        getCalculationTypeLabel(plan.calculationType),
        <CalculateIcon fontSize="small" />
      )}

      {renderDetailItem(
        'Incentive Value',
        <>
          {plan.incentiveValue}
          {plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
        </>,
        <AttachMoneyIcon fontSize="small" />
      )}
    </Stack>
  );
};

// Project-Based Plan Details Component
const ProjectBasedDetails: React.FC<{ plan: ProjectBasedIncentivePlan }> = ({ plan }) => {
  return (
    <Stack spacing={3}>
      {renderDetailItem('Project', plan.projectName)}

      {renderDetailItem(
        'Calculation Type',
        getCalculationTypeLabel(plan.calculationType),
        <CalculateIcon fontSize="small" />
      )}

      {renderDetailItem(
        'Incentive Value',
        <>
          {plan.incentiveValue}
          {plan.calculationType === IncentiveCalculationType.PercentageOnTarget ? '%' : ''}
        </>,
        <AttachMoneyIcon fontSize="small" />
      )}
    </Stack>
  );
};

// Kicker-Based Plan Details Component
const KickerBasedDetails: React.FC<{ plan: KickerIncentivePlan }> = ({ plan }) => {
  return (
    <Stack spacing={3}>
      {renderDetailItem('Location', plan.location)}

      {renderDetailItem(
        'Metric Type',
        getMetricTypeLabel(plan.metricType),
        <BarChartIcon fontSize="small" />
      )}

      {renderDetailItem('Target Value', plan.targetValue)}

      {renderDetailItem('Consistency Months', plan.consistencyMonths)}

      {renderDetailItem('Award Type', getAwardTypeLabel(plan.awardType))}

      {plan.awardType === AwardType.Cash && plan.awardValue && (
        renderDetailItem('Award Value', plan.awardValue)
      )}

      {plan.awardType === AwardType.Gift && plan.giftDescription && (
        renderDetailItem('Gift Description', plan.giftDescription)
      )}
    </Stack>
  );
};

// Tiered-Based Plan Details Component
const TieredBasedDetails: React.FC<{ plan: TieredIncentivePlan }> = ({ plan }) => {
  const theme = useTheme();

  return (
    <Stack spacing={3}>
      {renderDetailItem(
        'Metric Type',
        getMetricTypeLabel(plan.metricType),
        <BarChartIcon fontSize="small" />
      )}

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 2,
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
            borderColor: alpha(theme.palette.divider, 0.7)
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
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
                      backgroundColor: alpha(theme.palette.background.default, 0.5)
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transition: 'background-color 0.2s ease-in-out'
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
    </Stack>
  );
};

// Target-Based Options Component
const TargetBasedOptions: React.FC<{
  plan: TargetBasedIncentivePlan;
  renderOptionPill: (isEnabled: boolean, enabledLabel: string, disabledLabel: string, tooltipText: string) => JSX.Element;
}> = ({ plan, renderOptionPill }) => {
  return (
    <>
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
            size="medium"
            sx={{
              py: 2,
              px: 1,
              my: 0.5,
              mx: 0.5,
              borderRadius: '24px',
              backgroundColor: alpha('#00b8a9', 0.1),
              color: '#00b8a9',
              fontWeight: 500,
              border: '1px solid',
              borderColor: alpha('#00b8a9', 0.2),
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha('#00b8a9', 0.2),
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 184, 169, 0.2)',
              }
            }}
          />
        </Tooltip>
      )}
    </>
  );
};

// Role-Based Options Component
const RoleBasedOptions: React.FC<{
  plan: RoleBasedIncentivePlan;
  renderOptionPill: (isEnabled: boolean, enabledLabel: string, disabledLabel: string, tooltipText: string) => JSX.Element;
}> = ({ plan, renderOptionPill }) => {
  return (
    <>
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
    </>
  );
};

// Project-Based Options Component
const ProjectBasedOptions: React.FC<{
  plan: ProjectBasedIncentivePlan;
  renderOptionPill: (isEnabled: boolean, enabledLabel: string, disabledLabel: string, tooltipText: string) => JSX.Element;
}> = ({ plan, renderOptionPill }) => {
  return (
    <>
      {renderOptionPill(
        plan.isCumulative,
        'Cumulative',
        'Non-Cumulative',
        'When enabled, incentives are calculated cumulatively across periods'
      )}
    </>
  );
};

export default VerticalIncentivePlanDetail;
