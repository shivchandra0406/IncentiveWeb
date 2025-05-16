import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import incentivePlanService from '../../infrastructure/incentivePlans/IncentivePlanServiceImpl';
import { IncentivePlanType } from '../../core/models/incentivePlanTypes';
import TargetBasedPlanForm from './TargetBasedPlanForm';
import RoleBasedPlanForm from './RoleBasedPlanForm';
import ProjectBasedPlanForm from './ProjectBasedPlanForm';
import KickerBasedPlanForm from './KickerBasedPlanForm';
import TieredBasedPlanForm from './TieredBasedPlanForm';
import { getIncentivePlanTypeLabel } from '../../utils/enumLabels';

interface DynamicIncentivePlanFormProps {
  mode: 'create' | 'edit';
}

const DynamicIncentivePlanForm: React.FC<DynamicIncentivePlanFormProps> = ({ mode }) => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();

  const [planType, setPlanType] = useState<IncentivePlanType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planData, setPlanData] = useState<any>(null);

  useEffect(() => {
    // Determine the plan type from the URL parameter
    if (type) {
      switch (type.toLowerCase()) {
        case 'targetbased':
          setPlanType(IncentivePlanType.TargetBased);
          break;
        case 'rolebased':
          setPlanType(IncentivePlanType.RoleBased);
          break;
        case 'projectbased':
          setPlanType(IncentivePlanType.ProjectBased);
          break;
        case 'kickerbased':
          setPlanType(IncentivePlanType.KickerBased);
          break;
        case 'tieredbased':
          setPlanType(IncentivePlanType.TieredBased);
          break;
        default:
          setError(`Unknown plan type: ${type}`);
      }
    }
  }, [type]);

  useEffect(() => {
    // If in edit mode, fetch the plan data
    if (mode === 'edit' && id && planType) {
      fetchPlanData();
    }
  }, [mode, id, planType]);

  const fetchPlanData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching plan data for type: ${planType}, ID: ${id}`);

      // Use the type-specific API endpoint based on the plan type
      let response;

      // Use the common endpoint for fetching plan details
      console.log(`Calling API: GET /incentive-plans/${id}`);

      // Call the appropriate method based on plan type
      switch (planType) {
        case IncentivePlanType.TargetBased:
          response = await incentivePlanService.getTargetBasedPlanById(id);
          break;
        case IncentivePlanType.RoleBased:
          response = await incentivePlanService.getRoleBasedPlanById(id);
          break;
        case IncentivePlanType.ProjectBased:
          response = await incentivePlanService.getProjectBasedPlanById(id);
          break;
        case IncentivePlanType.KickerBased:
          response = await incentivePlanService.getKickerPlanById(id);
          break;
        case IncentivePlanType.TieredBased:
          response = await incentivePlanService.getTieredPlanById(id);
          break;
        default:
          throw new Error(`Unknown plan type: ${planType}`);
      }

      if (response.succeeded) {
        // The plan data will have numeric enum values converted to string enum values
        // by our enhanced API client wrapper
        setPlanData(response.data);

        // Log the plan data for debugging
        console.log('Fetched plan data for editing:', response.data);
      } else {
        console.error('API returned error:', response.message);
        setError(response.message || 'Failed to fetch incentive plan details');
      }
    } catch (err: any) {
      console.error('Error fetching incentive plan details:', err);
      console.error('Error details:', err.response?.data);
      setError(err.message || 'An error occurred while fetching incentive plan details');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!planType) return null;

    // Pass the plan data to the form component if in edit mode
    const formProps = mode === 'edit' && planData ? { initialData: planData } : {};

    switch (planType) {
      case IncentivePlanType.TargetBased:
        return <TargetBasedPlanForm {...formProps} />;
      case IncentivePlanType.RoleBased:
        return <RoleBasedPlanForm {...formProps} />;
      case IncentivePlanType.ProjectBased:
        return <ProjectBasedPlanForm {...formProps} />;
      case IncentivePlanType.KickerBased:
        return <KickerBasedPlanForm {...formProps} />;
      case IncentivePlanType.TieredBased:
        return <TieredBasedPlanForm {...formProps} />;
      default:
        return (
          <Alert severity="error">
            Unknown plan type: {planType}
          </Alert>
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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {mode === 'create' ? 'Create' : 'Edit'} {planType ? getIncentivePlanTypeLabel(planType) : ''} Incentive Plan
      </Typography>

      {renderForm()}
    </Box>
  );
};

export default DynamicIncentivePlanForm;
