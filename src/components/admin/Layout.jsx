import { useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { sidebarCollapsedWidth, sidebarExpandedWidth } from './Sidebar';
import { theme } from './theme'; // Import your theme

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: theme.palette.background.default 
      }}>
        {/* Sidebar - Using primary dark color */}
        <Sidebar onCollapseStateChange={setIsSidebarCollapsed} />
        
        {/* Main Content Area */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          width: isSidebarCollapsed 
            ? `calc(100% - ${sidebarCollapsedWidth}px)` 
            : `calc(100% - ${sidebarExpandedWidth}px)`,
          ml: isSidebarCollapsed 
            ? `${sidebarCollapsedWidth}px` 
            : `${sidebarExpandedWidth}px`,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}>
          {/* Topbar - Will automatically use primary.main from theme */}
          <Topbar isSidebarCollapsed={isSidebarCollapsed} />
          
          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              overflow: 'auto',
              backgroundColor: theme.palette.background.default,
            }}
          >
            {/* White cards/papers for content sections */}
            <Box sx={{ 
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: 1,
              p: 3,
              mb: 3
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