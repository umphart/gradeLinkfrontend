import React, { useState, useEffect } from 'react';
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Button,
  Stack,
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 200;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/student-profile' },
  { text: 'Check Result', icon: <AssessmentIcon />, path: '/student-results' },
  { text: 'Progress', icon: <TrendingUpIcon />, path: '/student-progress' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/student-settings' },
];

const StudentResultDashboard = () => {
  const [hovered, setHovered] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [showModal, setShowModal] = useState(false);
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

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const resultItems = [
    {
      title: 'Examination Result',
      value: 'click to view result',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      onClick: handleOpenModal,
    },
    {
      title: 'Performance in school',
      value: '82%',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    },
    {
      title: 'View Report Sheet',
      value: 'Click to download',
      icon: <DescriptionIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      onClick: () => navigate('/student-report-sheet'),
    },
  ];

  const summaryData = {
    schoolName: user?.schoolName || 'Sample School',
    section: 'Junior Secondary',
    className: 'JSS 2',
    position: '3rd',
    average: '76%',
  };

  const subjectResults = [
    { subject: 'Mathematics', ca: 18, exam: 65, total: 83, grade: 'A', remark: 'Excellent' },
    { subject: 'English', ca: 15, exam: 60, total: 75, grade: 'B', remark: 'Very Good' },
    { subject: 'Basic Science', ca: 17, exam: 50, total: 67, grade: 'C', remark: 'Good' },
    { subject: 'Social Studies', ca: 19, exam: 58, total: 77, grade: 'B', remark: 'Very Good' },
    { subject: 'Civic Education', ca: 20, exam: 60, total: 80, grade: 'A', remark: 'Excellent' },
    { subject: 'Agricultural Science', ca: 16, exam: 55, total: 71, grade: 'B', remark: 'Good' },
    { subject: 'Home Economics', ca: 10, exam: 40, total: 50, grade: 'D', remark: 'Pass' },
  ];

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
              <ListItem button component={Link} to={item.path} sx={{ py: 2, px: 2 }}>
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
              Exam Result
            </Typography>

            <Grid container spacing={4}>
              {resultItems.map((item, index) => (
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
                      cursor: item.onClick ? 'pointer' : 'default',
                    }}
                    onClick={item.onClick}
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
<Modal
  open={showModal}
  onClose={handleCloseModal}
  aria-labelledby="result-modal-title"
  aria-describedby="result-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: '80%', sm: 350, md: 450 },
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 2,
      borderRadius: 2,
      maxHeight: '70vh',
      overflowY: 'auto',
    }}
  >
    {/* Modal Header with logo */}
    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
      {user?.logo && (
        <Box
          component="img"
          src={`http://localhost:5000/uploads/logos/${user.logo}`}
          alt="School Logo"
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            border: '1px solid black',
            boxShadow: 1,
          }}
        />
      )}
      <Stack direction="column" sx={{ alignItems: 'center', textAlign: 'center', flex: 1 }}>
        <Typography
          id="result-modal-title"
          variant="subtitle1"
          sx={{ fontWeight: 'bold', fontSize: '1rem' }}
        >
          {summaryData.schoolName}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          {studentName || 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Section: {summaryData.section} | Class: {summaryData.className} | Position: {summaryData.position} | Average: {summaryData.average}
        </Typography>
      </Stack>
    </Stack>

    {/* Subject Scores Table */}
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
          <TableRow>
            <TableCell sx={{ fontSize: '0.75rem' }}><strong>Subject</strong></TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}><strong>CA</strong></TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}><strong>Exam</strong></TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}><strong>Total</strong></TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}><strong>Grade</strong></TableCell>
            <TableCell sx={{ fontSize: '0.75rem' }}><strong>Remark</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjectResults.map((subj, i) => (
            <TableRow key={i}>
              <TableCell sx={{ fontSize: '0.75rem' }}>{subj.subject}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{subj.ca}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{subj.exam}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{subj.total}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{subj.grade}</TableCell>
              <TableCell sx={{ fontSize: '0.75rem' }}>{subj.remark}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
</Modal>

      </Box>
    </Box>
  );
};

export default StudentResultDashboard;
