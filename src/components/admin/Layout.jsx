import { useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { sidebarCollapsedWidth, sidebarExpandedWidth } from './Sidebar';
import { theme } from './theme';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: theme.palette.background.default 
      }}>
        {/* Sidebar */}
        <Sidebar onCollapseStateChange={setIsSidebarCollapsed} />
        
        {/* Main Content Area */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          width: isSidebarCollapsed 
            ? `calc(100% - ${sidebarCollapsedWidth - 8}px)`  // Reduced width gap
            : `calc(100% - ${sidebarExpandedWidth - 8}px)`, // Reduced width gap
          ml: isSidebarCollapsed 
            ? `${sidebarCollapsedWidth - 16}px`  // Reduced margin by 16px
            : `${sidebarExpandedWidth - 16}px`,  // Reduced margin by 16px
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}>
          {/* Topbar */}
          <Topbar isSidebarCollapsed={isSidebarCollapsed} />
          
          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 2,  // Reduced padding from 3 to 2
              overflow: 'auto',
              backgroundColor: theme.palette.background.default,
            }}
          >
            {/* Content container with tighter spacing */}
            <Box sx={{ 
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: 1,
              p: 2,  // Reduced padding from 3 to 2
              mb: 2   // Reduced margin bottom from 3 to 2
            }}>
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;