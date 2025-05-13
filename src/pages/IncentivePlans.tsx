import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const IncentivePlans: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Incentive Plans
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Incentive plans page content will go here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default IncentivePlans;
