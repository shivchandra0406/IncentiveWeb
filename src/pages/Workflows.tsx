import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Workflows: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workflows
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Workflows page content will go here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Workflows;
