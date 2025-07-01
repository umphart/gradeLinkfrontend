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
import { useAuth } from '../../contexts/AuthContext';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
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
    title: 'Update Password',
    value: 'Change your password',
    icon: <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
  },
  {
    title: 'Notice Board',
    value: 'Check latest updates',
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
 { text: 'My Result', icon: <AssessmentIcon />, path: '/student-results' },
  { text: 'Progress', icon: <TrendingUpIcon />, path: '/student-progress' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/student-settings' },
];

const StudentSetting = () => {
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

            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                fontFamily: 'Times New Roman, serif',
                fontSize: '2rem',
              }}
            >
              {user?.schoolName || 'School Management System'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              Welcome back{studentName ? `, ${studentName}` : ''}!
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
             <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Student Profile Settings
                      </Typography>
          <Grid container spacing={3}>
            {dashboardItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    boxShadow: 3,
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
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
  );
};

export default StudentSetting;
