import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import MainLayout from '../../layouts/MainLayout';
import Login from '../../pages/Login';

// Lazy loaded components
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const Users = lazy(() => import('../../pages/Users'));
const Leads = lazy(() => import('../../pages/Leads'));
const IncentivePlans = lazy(() => import('../../pages/IncentivePlans'));
const Deals = lazy(() => import('../../pages/Deals'));
const Payouts = lazy(() => import('../../pages/Payouts'));
const Workflows = lazy(() => import('../../pages/Workflows'));
const Settings = lazy(() => import('../../pages/Settings'));
const Profile = lazy(() => import('../../pages/Profile'));
const NotFound = lazy(() => import('../../pages/NotFound'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="leads" element={<Leads />} />
          <Route path="incentive-plans" element={<IncentivePlans />} />
          <Route path="deals" element={<Deals />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
