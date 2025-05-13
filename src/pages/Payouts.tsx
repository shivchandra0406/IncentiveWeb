import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Payouts: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Payouts
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Payouts page content will go here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Payouts;
