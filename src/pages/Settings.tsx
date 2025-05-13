import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Settings page content will go here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
