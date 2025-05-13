import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import RolesList from '../components/Roles/RolesList';

const Roles: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box>
          <RolesList />
        </Box>
      </Paper>
    </Container>
  );
};

export default Roles;
