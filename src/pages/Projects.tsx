import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectForm from '../components/Projects/ProjectForm';

const Projects: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Routes>
        <Route index element={<Navigate to="/projects/create" replace />} />
        <Route path="create" element={<ProjectForm />} />
        <Route path="edit/:id" element={<ProjectForm />} />
        <Route path="*" element={<Navigate to="/projects/create" replace />} />
      </Routes>
    </Box>
  );
};

export default Projects;
