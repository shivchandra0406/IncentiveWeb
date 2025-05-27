import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import DealsList from '../components/Deals/DealsList';
import DealForm from '../components/Deals/DealForm';
import DealDetails from '../components/Deals/DealDetails';

const Deals: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Routes>
        <Route index element={<DealsList />} />
        <Route path="create" element={<DealForm />} />
        <Route path="edit/:id" element={<DealForm />} />
        <Route path="view/:id" element={<DealDetails />} />
        <Route path="*" element={<Navigate to="/deals" replace />} />
      </Routes>
    </Box>
  );
};

export default Deals;
