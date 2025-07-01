import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton
} from '@mui/material';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Icons
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 200;

const dashboardItems = [
  {
    title: 'Your Courses',
    value: 'Enrolled: 5',
    icon: <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
  },
  {
    title: 'Upcoming Exams',
    value: 'Next: Math - 15 May',
    icon: <EventNoteIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
  },
  {
    title: 'Profile Status',
    value: 'Complete',
    icon: <AccountCircleIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
  },
];

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/student-profile' },
  { text: 'Check Result', icon: <AssessmentIcon />, path: '/student-results' },
  { text: 'Progress', icon: <TrendingUpIcon />, path: '/student-progress' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/student-settings' },
];

const StudentDashboard = () => {
  const [hovered, setHovered] = useState(false);
  const [studentName, setStudentName] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.fullName) {
      setStudentName(userData.fullName);
    }
  }, []);

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
    primaryTypographyProps={{
      sx: {
        fontWeight: 'bold',
        color: '#ffffff', 
      },
    }}
  />
)}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, px: 4, pt: 3 }}>
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

            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', fontFamily: 'Times New Roman', fontSize: '2rem' }}
            >
              {user?.schoolName || 'School Management System'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              Welcome back{studentName ? `, ${studentName}` : ''}!
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Dashboard Cards */}
        <Box sx={{ px: 4, pt: 3 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Student Dashboard
            </Typography>

          <Grid container spacing={4}>
            {dashboardItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 2,
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
</Box>
  );
};

export default StudentDashboard;
