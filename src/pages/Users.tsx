import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Users: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          User management page content will go here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Users;
