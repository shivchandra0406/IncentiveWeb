import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import IncentivePlansList from '../components/IncentivePlans/IncentivePlansList';
import PlanTypeSelector from '../components/IncentivePlans/PlanTypeSelector';
import TargetBasedPlanForm from '../components/IncentivePlans/TargetBasedPlanForm';
import ModernTargetBasedPlanForm from '../components/IncentivePlans/ModernTargetBasedPlanForm';
import RoleBasedPlanForm from '../components/IncentivePlans/RoleBasedPlanForm';
import ModernRoleBasedPlanForm from '../components/IncentivePlans/ModernRoleBasedPlanForm';
import ProjectBasedPlanForm from '../components/IncentivePlans/ProjectBasedPlanForm';
import KickerBasedPlanForm from '../components/IncentivePlans/KickerBasedPlanForm';
import TieredBasedPlanForm from '../components/IncentivePlans/TieredBasedPlanForm';
import ModernProjectBasedPlanForm from '../components/IncentivePlans/ModernProjectBasedPlanForm';
import ModernKickerBasedPlanForm from '../components/IncentivePlans/ModernKickerBasedPlanForm';
import ModernTieredBasedPlanForm from '../components/IncentivePlans/ModernTieredBasedPlanForm';
import IncentivePlanDetail from '../components/IncentivePlans/IncentivePlanDetail';
import ModernIncentivePlanDetail from '../components/IncentivePlans/ModernIncentivePlanDetail';
import VerticalIncentivePlanDetail from '../components/IncentivePlans/VerticalIncentivePlanDetail';
import DynamicIncentivePlanForm from '../components/IncentivePlans/DynamicIncentivePlanForm';

const IncentivePlans: React.FC = () => {
  const location = useLocation();
  console.log('Current location:', location.pathname);

  return (
    <Box sx={{ width: '100%' }}>
      <Routes>
        <Route index element={<IncentivePlansList />} />
        <Route path="create" element={<PlanTypeSelector />} />

        {/* Create routes */}
        <Route path="create/targetbased" element={<ModernTargetBasedPlanForm />} />
        <Route path="create/rolebased" element={<ModernRoleBasedPlanForm />} />
        <Route path="create/projectbased" element={<ModernProjectBasedPlanForm />} />
        <Route path="create/kickerbased" element={<ModernKickerBasedPlanForm />} />
        <Route path="create/tieredbased" element={<ModernTieredBasedPlanForm />} />

        {/* Alternative routes with enum values */}
        <Route path="create/targetbasedplan" element={<ModernTargetBasedPlanForm />} />
        <Route path="create/rolebasedplan" element={<ModernRoleBasedPlanForm />} />
        <Route path="create/projectbasedplan" element={<ModernProjectBasedPlanForm />} />
        <Route path="create/kickerplan" element={<ModernKickerBasedPlanForm />} />
        <Route path="create/tieredplan" element={<ModernTieredBasedPlanForm />} />

        {/* Edit routes */}
        <Route path="edit/targetbased/:id" element={<ModernTargetBasedPlanForm />} />
        <Route path="edit/rolebased/:id" element={<ModernRoleBasedPlanForm />} />
        <Route path="edit/projectbased/:id" element={<ModernProjectBasedPlanForm />} />
        <Route path="edit/kickerbased/:id" element={<ModernKickerBasedPlanForm />} />
        <Route path="edit/tieredbased/:id" element={<ModernTieredBasedPlanForm />} />

        {/* Dynamic form routes */}
        <Route path="create/:type" element={<DynamicIncentivePlanForm mode="create" />} />
        <Route path="edit/:type/:id" element={<DynamicIncentivePlanForm mode="edit" />} />

        {/* View routes */}
        <Route path="view/:type/:id" element={<VerticalIncentivePlanDetail />} />

        <Route path="*" element={<Navigate to="/incentive-plans" replace />} />
      </Routes>
    </Box>
  );
};

export default IncentivePlans;
