import React from 'react';
import { Typography, Box } from '@mui/material';

const FreezeStudent = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Freeze Student</Typography>
      <Typography>This page will allow freezing a student's enrollment temporarily.</Typography>
    </Box>
  );
};

export default FreezeStudent;
