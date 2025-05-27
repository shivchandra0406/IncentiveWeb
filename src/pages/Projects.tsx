import React from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectForm from '../components/Projects/ProjectForm';
import ProjectsList from '../components/Projects/ProjectsList';

const Projects: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Routes>
        <Route index element={<ProjectsList />} />
        <Route path="create" element={<ProjectForm />} />
        <Route path="edit/:id" element={<ProjectForm />} />
        <Route path="view/:id" element={<ProjectForm />} /> {/* We can reuse ProjectForm in read-only mode */}
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </Box>
  );
};

export default Projects;
