// src/layouts/TeacherLayout.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';

import SettingsIcon from '@mui/icons-material/Settings';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { SubjectSharp } from '@mui/icons-material';
import FiberSmartRecord from '@mui/icons-material/FiberSmartRecord';

const drawerWidth = 200;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher-dashboard' },
  { text: 'My Profile', icon: <PersonIcon />, path: '/teacher-profile' },
  { text: 'My Classes', icon: <ClassIcon />, path: '/teacher-classes' },
   { text: 'Manage Exam', icon: <FiberSmartRecord  />, path: '/teacher-exams' },
   { text: 'Records', icon: <AssessmentIcon />, path: '/classes' },
  { text: 'My Subjects', icon: <SubjectSharp />, path: '/teacher-subject' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/teacher-settings' },
];

const TeacherLayout = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.fullName) setTeacherName(userData.fullName);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: hovered ? drawerWidth : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          '& .MuiDrawer-paper': {
            width: hovered ? drawerWidth : 60,
            transition: 'width 0.3s',
            boxSizing: 'border-box',
            backgroundColor: '#1976d2',
            color: '#fff',
            borderRight: 0,
          },
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <List>
          {navItems.map((item, index) => (
            <Tooltip title={!hovered ? item.text : ''} placement="right" key={index}>
              <ListItem button sx={{ py: 2, px: 2 }} component={Link} to={item.path}>
                <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                {hovered && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ sx: { fontWeight: 'bold', color: '#fff' } }}
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 2,
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid #ccc',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user?.logo && (
              <Box
                component="img"
                src={`http://localhost:5000/uploads/logos/${user.logo}`}
                alt="School Logo"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  border: '1px solid black',
                  boxShadow: 1,
                }}
              />
            )}
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '2rem', fontFamily: 'Times New Roman' }}>
              {user?.schoolName || 'School Management System'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              Welcome back{teacherName ? `, ${teacherName}` : ''}!
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default TeacherLayout;
