import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from 'react-router-dom';

export const sidebarCollapsedWidth = 72;
export const sidebarExpandedWidth = 240;

const Sidebar = ({ onCollapseStateChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/superadmin' },
    { text: 'Schools', icon: <SchoolIcon />, path: '/admin-schools' },
    { text: 'Admins', icon: <AdminPanelSettingsIcon />, path: '/schooladmins' },
     { text: 'Students', icon: <PersonIcon />, path: '/admin-students' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin-settings' },
  ];

  const handleToggle = (collapsed) => {
    setIsCollapsed(collapsed);
    onCollapseStateChange?.(collapsed);
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => handleToggle(false)}
      onMouseLeave={() => handleToggle(true)}
      sx={{
        width: isCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth,
        flexShrink: 0,
        transition: 'width 0.2s ease-out',
        '& .MuiDrawer-paper': {
          width: isCollapsed ? sidebarCollapsedWidth : sidebarExpandedWidth,
          boxSizing: 'border-box',
          backgroundColor: 'primary.dark', // Using theme primary dark
          color: 'primary.contrastText',  // Automatic contrast text
          borderRight: 'none',
          transition: 'width 0.2s ease-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          {isCollapsed ? (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>🎓</Typography>
          ) : (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                animation: 'fadeIn 0.2s ease-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 },
                }
              }}
            >
              🎓 GradeLink365
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List sx={{ mt: 1 }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname.startsWith(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              py: 1.25,
              px: isCollapsed ? 0 : 2,
              color: 'inherit',
              justifyContent: 'center',
              minHeight: 48,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.24)',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              transition: 'background-color 0.2s ease, padding 0.2s ease',
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: 'inherit', 
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
                sx={{
                  animation: 'fadeIn 0.2s ease-out',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;