import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid,
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
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 200;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/student-profile' },
  { text: 'Check Result', icon: <AssessmentIcon />, path: '/student-results' },
  { text: 'Progress', icon: <TrendingUpIcon />, path: '/student-progress' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/student-settings' },
];

const StudentProfile = () => {
  const [hovered, setHovered] = useState(false);
  const [student, setStudent] = useState({});
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
    if (userData) {
      setStudent(userData);
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
        color: '#ffffff', // Change color here if needed
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

          <Typography variant="subtitle1" sx={{ color: '#333' }}>
            Welcome back{student.fullName ? `, ${student.fullName}` : ''}!
          </Typography>
           <IconButton color="inherit" onClick={handleLogout} title="Logout">
                      <LogoutIcon />
                    </IconButton>
        </Box>

        {/* Student Info */}
        <Box sx={{ px: 4, pt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Student Profile
          </Typography>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Grid container spacing={4}>
              {/* Profile Photo */}
              <Grid item xs={12} md={4}>
               {student?.photoUrl ? (
  <Box
    component="img"
    src={`http://localhost:5000${student.photoUrl}`}
    alt="Student"
    sx={{
      width: '90px',
      height: '90px',
      borderRadius: 2,
      border: '1px solid #ccc',
      boxShadow: 1,
    }}
  />
) : (
  <Typography>No photo uploaded</Typography>
)}

              </Grid>

              {/* Details Table */}
              <Grid item xs={12} md={8}>
                <TableContainer>
<Table>
  <TableBody>
    <TableRow>
      <TableCell><strong>Full Name</strong></TableCell>
      <TableCell>{student.fullName}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Admission Number</strong></TableCell>
      <TableCell>{student.admissionNumber}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Class</strong></TableCell>
      <TableCell>{student.className}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Section</strong></TableCell>
      <TableCell>{student.section}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Gender</strong></TableCell>
      <TableCell>{student.gender}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Age</strong></TableCell>
      <TableCell>{student.age}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Phone</strong></TableCell>
      <TableCell>{student.phone}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Guardian Name</strong></TableCell>
      <TableCell>{student.guidanceName}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell><strong>Guardian Contact</strong></TableCell>
      <TableCell>{student.guidanceContact}</TableCell>
    </TableRow>
  </TableBody>
</Table>

                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentProfile;
