import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          User profile page content will go here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
