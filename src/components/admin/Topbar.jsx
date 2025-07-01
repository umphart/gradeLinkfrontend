import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { sidebarCollapsedWidth, sidebarExpandedWidth } from './Sidebar';

const Topbar = ({ isSidebarCollapsed }) => {
  return (
    <AppBar 
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ml: isSidebarCollapsed ? `${sidebarCollapsedWidth}px` : `${sidebarExpandedWidth}px`,
        width: isSidebarCollapsed 
          ? `calc(100% - ${sidebarCollapsedWidth}px)` 
          : `calc(100% - ${sidebarExpandedWidth}px)`,
        backgroundColor: 'primary.main', // Using theme primary color
        color: 'primary.contrastText',   // Automatic contrast text
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: (theme) =>
          theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
         🎓 GradeLink365 Super Admin Panel
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              position: 'relative',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SearchIcon color="action" />
            <InputBase 
              placeholder="Search…" 
              sx={{ 
                ml: 1,
                color: 'text.secondary',
              }} 
            />
          </Box>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Avatar alt="Admin" src="/admin-avatar.png" sx={{ width: 32, height: 32 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;