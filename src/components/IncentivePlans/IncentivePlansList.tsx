import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import {
  IncentivePlanType,
  PeriodType
} from '../../core/models/incentivePlanTypes';
import type { IncentivePlanBase } from '../../core/models/incentivePlanTypes';

const IncentivePlansList: React.FC = () => {
  const [plans, setPlans] = useState<IncentivePlanBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planTypeFilter, setPlanTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncentivePlans();
  }, [planTypeFilter, statusFilter]);
  console.log("plans: shiv ", plans);

  const fetchIncentivePlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (planTypeFilter) filters.planType = planTypeFilter;
      if (statusFilter) filters.isActive = statusFilter === 'active';
      if (searchTerm) filters.search = searchTerm;

      const response = await incentivePlanService.getIncentivePlans(filters);
      if (response.succeeded) {
        setPlans(response.data);
      } else {
        setError(response.message || 'Failed to fetch incentive plans');
      }
    } catch (err: any) {
      console.error('Error fetching incentive plans:', err);
      setError(err.message || 'An error occurred while fetching incentive plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchIncentivePlans();
  };

  const handlePlanTypeChange = (event: SelectChangeEvent) => {
    setPlanTypeFilter(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleEditPlan = (plan: IncentivePlanBase) => {
    navigate(`/incentive-plans/edit/${plan.planType.toLowerCase()}/${plan.id}`);
  };

  const handleViewPlan = (plan: IncentivePlanBase) => {
    navigate(`/incentive-plans/view/${plan.planType.toLowerCase()}/${plan.id}`);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this incentive plan?')) {
      try {
        setLoading(true);
        const response = await incentivePlanService.deleteIncentivePlan(id);
        if (response.succeeded) {
          setPlans(plans.filter(plan => plan.id !== id));
        } else {
          setError(response.message || 'Failed to delete incentive plan');
        }
      } catch (err: any) {
        console.error('Error deleting incentive plan:', err);
        setError(err.message || 'An error occurred while deleting the incentive plan');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      const response = await incentivePlanService.toggleIncentivePlanStatus(id, !currentStatus);
      if (response.succeeded) {
        setPlans(plans.map(plan =>
          plan.id === id ? { ...plan, isActive: !currentStatus } : plan
        ));
      } else {
        setError(response.message || 'Failed to update incentive plan status');
      }
    } catch (err: any) {
      console.error('Error updating incentive plan status:', err);
      setError(err.message || 'An error occurred while updating the incentive plan status');
    } finally {
      setLoading(false);
    }
  };

  const getPlanTypeLabel = (planType: IncentivePlanType): string => {
    console.log("planType: shiv ", planType);

    switch (planType) {
      case IncentivePlanType.TargetBased:
        return 'Target Based';
      case IncentivePlanType.RoleBased:
        return 'Role Based';
      case IncentivePlanType.ProjectBased:
        return 'Project Based';
      case IncentivePlanType.KickerBased:
        return 'Kicker Based';
      case IncentivePlanType.TieredBased:
        return 'Tiered Based';
      default:
        return planType;
    }
  };

  const getPeriodTypeLabel = (periodType: PeriodType): string => {
    switch (periodType) {
      case PeriodType.Monthly:
        return 'Monthly';
      case PeriodType.Quarterly:
        return 'Quarterly';
      case PeriodType.HalfYearly:
        return 'Half Yearly';
      case PeriodType.Yearly:
        return 'Yearly';
      case PeriodType.Custom:
        return 'Custom';
      default:
        return periodType;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 2 }}>
        <Typography variant="h5">Incentive Plans</Typography>
        <Box sx={{ mt: 2 }}> {/* Added margin-top to move button down */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              console.log('Navigating to create plan page');
              navigate('/incentive-plans/create');
            }}
            sx={{
              fontWeight: 500,
              px: 3,
              py: 1.2,
              borderRadius: '4px',
              backgroundColor: '#00b8a9',
              color: 'white',
              boxShadow: '0 2px 4px rgba(0,184,169,0.3)',
              '&:hover': {
                backgroundColor: '#00a599',
                boxShadow: '0 4px 8px rgba(0,184,169,0.4)',
                transform: 'translateY(-2px)'
              },
              '&:active': {
                backgroundColor: '#00877c',
                transform: 'translateY(0px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Create Plan
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: 2 }}>
            <TextField
              fullWidth
              label="Search Plans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              size="small"
              placeholder="Enter plan name to search"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth size="small">
              {/* <InputLabel>Plan Type</InputLabel> */}
              <Select
                value={planTypeFilter}
                label="Plan Type"
                onChange={handlePlanTypeChange}
                displayEmpty
                renderValue={(value) => value ? getPlanTypeLabel(value as IncentivePlanType) : "Select Plan Type"}
              >
                <MenuItem value="">All Plan Types</MenuItem>
                {Object.values(IncentivePlanType).map((type) => (
                  <MenuItem key={type} value={type}>{getPlanTypeLabel(type as IncentivePlanType)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth size="small">
              {/* <InputLabel>Status</InputLabel> */}
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusChange}
                displayEmpty
                renderValue={(value) => value ? (value === 'active' ? 'Active' : 'Inactive') : "Select Status"}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              height: '40px',
              backgroundColor: '#00b8a9',
              '&:hover': {
                backgroundColor: '#00a599'
              },
              px: 4
            }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan Name</TableCell>
                <TableCell>Plan Type</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.length > 0 ? (
                plans.map((plan) => (
                  console.log("plan: shiv ", plan),
                  <TableRow key={plan.id}>
                    <TableCell>{plan.planName}</TableCell>
                    <TableCell>{getPlanTypeLabel(plan.planType)}</TableCell>
                    <TableCell>{getPeriodTypeLabel(plan.periodType)}</TableCell>
                    <TableCell>{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={plan.isActive ? 'Active' : 'Inactive'}
                        color={plan.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton size="small" color="primary" onClick={() => handleViewPlan(plan)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEditPlan(plan)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeletePlan(plan.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={plan.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          color={plan.isActive ? 'error' : 'success'}
                          onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                        >
                          {plan.isActive ? <InactiveIcon /> : <ActiveIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No incentive plans found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default IncentivePlansList;
