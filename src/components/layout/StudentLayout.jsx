import { Outlet } from 'react-router-dom';

import { Box, CssBaseline, Toolbar } from '@mui/material';
import StudentSidebar from './StudentSidebar';
import Header from './Header';


const StudentLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header/>
      <StudentSidebar/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: 'calc(100% - 240px)',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentLayout;