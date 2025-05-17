import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import EnumMappingTest from '../components/EnumMappingTest';

const EnumMappingTestPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Enum Mapping Test Page
          </Typography>
          <Typography variant="body1" paragraph>
            This page tests the enum mapping functionality to ensure that string enum values are properly converted to numeric values when sending data to the API.
          </Typography>
          <EnumMappingTest />
        </Box>
      </Paper>
    </Container>
  );
};

export default EnumMappingTestPage;
