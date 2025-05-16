import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import testEnumMapping from '../utils/enumMapperTest';

const EnumMappingTest: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);

  const runTest = () => {
    const result = testEnumMapping();
    setTestResult(result);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Enum Mapping Test
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={runTest}
        sx={{ mb: 2 }}
      >
        Run Test
      </Button>
      
      {testResult && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Test Result (Processed Data with Numeric Enums):
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </Paper>
      )}
      
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Check the browser console for more detailed test output.
      </Typography>
    </Box>
  );
};

export default EnumMappingTest;
