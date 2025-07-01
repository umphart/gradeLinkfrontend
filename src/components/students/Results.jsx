import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  CircularProgress,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Drawer,
  Container
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useReactToPrint } from 'react-to-print';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

const drawerWidth = 200;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/student-profile' },
  { text: 'Check Result', icon: <AssessmentIcon />, path: '/student-results' },
  { text: 'Progress', icon: <TrendingUpIcon />, path: '/student-progress' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/student-settings' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%', // Reduced width from 70% to 60%
  maxWidth: '700px', // Reduced from 800px
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  overflowY: 'auto',
  borderRadius: 2,
};

const StudentResultDashboard = () => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [examSummary, setExamSummary] = useState({ position: '', average: '', totalMark: '', grade: '' });
  const modalRef = useRef();
  
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [availableSessions, setAvailableSessions] = useState(['2023/2024', '2024/2025', '2025/2026']);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => modalRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchExamResults = async () => {
    if (!user || !user.schoolName || !user.className || !user.admissionNumber || !selectedTerm || !selectedSession) {
      setError('Please select both term and session');
      return;
    }

    setLoading(true);
    setExamResults([]);
    setExamSummary({ position: '', average: '', totalMark: '', grade: '' });
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('schoolName', user.schoolName);
      params.append('className', user.className);
      params.append('admissionNumber', user.admissionNumber);
      params.append('termName', selectedTerm);
      params.append('sessionName', selectedSession);

      const res = await fetch(
        `http://localhost:5000/api/students/get-exam-records?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch exam results');
      }

      const data = await res.json();

      if (data?.success) {
        const examData = data.examRecords?.map(exam => {
          const examMark = Number(exam.exam_mark) || 0;
          const ca = Number(exam.ca) || 0;
          const total = examMark + ca;

          let grade = 'F';
          if (total >= 75) grade = 'A';
          else if (total >= 60) grade = 'B';
          else if (total >= 50) grade = 'C';
          else if (total >= 45) grade = 'D';
          else if (total >= 40) grade = 'E';

          let remark = 'Fail';
          if (total >= 75) remark = 'Excellent';
          else if (total >= 65) remark = 'Very Good';
          else if (total >= 55) remark = 'Good';
          else if (total >= 45) remark = 'Credit';
          else if (total >= 40) remark = 'Pass';

          return { ...exam, total, grade, remark };
        }) || [];

        if (examData.length > 0) {
          const totalMark = examData.reduce((sum, exam) => sum + exam.total, 0);
          const average = totalMark / examData.length;

          let overallGrade = 'F';
          if (average >= 75) overallGrade = 'A';
          else if (average >= 60) overallGrade = 'B';
          else if (average >= 50) overallGrade = 'C';
          else if (average >= 45) overallGrade = 'D';

          setExamSummary({
            position: data.position || '',
            average: average.toFixed(2),
            totalMark: totalMark.toFixed(2),
            grade: overallGrade
          });
        }

        setExamResults(examData);
      } else {
        throw new Error(data?.message || 'No exam results found');
      }
    } catch (err) {
      console.error('Error fetching exam results:', err);
      setError(err.message || 'Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async () => {
    setModalOpen(true);
    await fetchExamResults();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setExamResults([]);
    setError(null);
  };

  const resultItems = [
    {
      title: 'Examination Result',
      value: 'Click to view result',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      onClick: handleOpenModal,
    },
    {
      title: 'Performance in school',
      value: examSummary.average ? `${examSummary.average}%` : 'N/A',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    },
    {
      title: 'View Report Sheet',
      value: 'Click to download',
      icon: <DescriptionIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      onClick: () => navigate('/student-report-sheet'),
    },
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
              sx={{ fontWeight: 'bold', fontFamily: 'Times New Roman', fontSize: '2rem' }}
            >
              {user?.schoolName || 'School Management System'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              Welcome back, {user?.fullName || 'Student'}!
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Box sx={{ px: 4, pt: 3 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Exam Results
            </Typography>

            {error && !modalOpen && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Term and Session Selection */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="term-label">Select Term</InputLabel>
                    <Select
                      labelId="term-label"
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      label="Select Term"
                    >
                      <MenuItem value="First Term">First Term</MenuItem>
                      <MenuItem value="Second Term">Second Term</MenuItem>
                      <MenuItem value="Third Term">Third Term</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="session-label">Select Session</InputLabel>
                    <Select
                      labelId="session-label"
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      label="Select Session"
                    >
                      {availableSessions.map(session => (
                        <MenuItem key={session} value={session}>{session}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Dashboard Cards */}
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

        {/* Results Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
  <Box 
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      maxWidth: '700px',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 3,
      borderRadius: 2,
      maxHeight: '90vh',
      overflowY: 'auto'
    }}
    ref={modalRef}
  >
    {/* Header Section */}
    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
      {user?.logo && (
        <Box
          component="img"
          src={`http://localhost:5000/uploads/logos/${user.logo}`}
          alt="School Logo"
          sx={{ 
            width: 60, 
            height: 60, 
            borderRadius: 1, 
            border: '1px solid #ccc',
            mb: 1
          }}
        />
      )}
      <Typography variant="h6" fontWeight="bold" textAlign="center">
        {user?.schoolName}
      </Typography>
      <Typography variant="subtitle1" textAlign="center">
        {selectedTerm} - {selectedSession}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" textAlign="center">
        Student: {user?.fullName} | Admission No: {user?.admissionNumber}
      </Typography>
      <Typography variant="body2" textAlign="center">
        Class: {user?.className} | Section: {user?.section || 'N/A'}
      </Typography>

      {examResults.length > 0 && (
        <Box display="flex" flexWrap="wrap" gap={2} mt={2} justifyContent="center">
          <Typography variant="body2">
            Position: <strong>{examSummary.position || 'N/A'}</strong>
          </Typography>
          <Typography variant="body2">
            Average: <strong>{examSummary.average || 'N/A'}</strong>
          </Typography>
          <Typography variant="body2">
            Total Mark: <strong>{examSummary.totalMark || 'N/A'}</strong>
          </Typography>
          <Typography variant="body2">
            Grade: <strong>{examSummary.grade || 'N/A'}</strong>
          </Typography>
        </Box>
      )}
    </Box>

    {/* Loading State */}
    {loading && (
      <Box textAlign="center" py={4}>
        <CircularProgress />
        <Typography mt={2}>Loading exam results...</Typography>
      </Box>
    )}

    {/* Error State */}
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    {/* Empty State */}
    {!loading && examResults.length === 0 && (
      <Typography textAlign="center">No exam results found for selected term and session.</Typography>
    )}

    {/* Results Table */}
    {!loading && examResults.length > 0 && (
      <Box sx={{ position: 'relative' }}>
        {/* Watermark */}
        {user?.logo && (
 <Box
  sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 1.0, // Increased opacity for better visibility
    zIndex: 0,
    width: '50%',
    maxWidth: 250,
    filter: 'grayscale(100%) contrast(70%)', // Adjusted contrast
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
  <img
    src={`http://localhost:5000/uploads/logos/${user.logo}`}
    alt="Watermark"
    style={{
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      mixBlendMode: 'multiply' // Ensures visibility on light backgrounds
    }}
  />
</Box>
        )}

        {/* Table with Serial Numbers */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.85)'
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>S/N</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Exam Mark</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>CA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Remark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examResults.map((exam, idx) => (
                <TableRow 
                  key={`${exam.subject}-${idx}`}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">{exam.subject}</TableCell>
                  <TableCell align="center">{exam.exam_mark}</TableCell>
                  <TableCell align="center">{exam.ca}</TableCell>
                  <TableCell align="center">{exam.total}</TableCell>
                  <TableCell align="center">{exam.grade}</TableCell>
                  <TableCell align="center">{exam.remark}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Signatures Section */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Box textAlign="center">
            <Typography variant="body2" fontWeight="bold">Principal's Signature</Typography>
            <Box sx={{ 
              height: '1px', 
              width: '150px', 
              backgroundColor: 'black', 
              my: 1, 
              mx: 'auto' 
            }} />
            <Typography variant="caption">Date: ________________</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="body2" fontWeight="bold">Exam Officer's Signature</Typography>
            <Box sx={{ 
              height: '1px', 
              width: '150px', 
              backgroundColor: 'black', 
              my: 1, 
              mx: 'auto' 
            }} />
            <Typography variant="caption">Date: ________________</Typography>
          </Box>
        </Box>
      </Box>
    )}

    {/* Action Buttons */}
    <Box mt={3} display="flex" justifyContent="space-between" className="no-print">
      <Button 
        variant="outlined" 
        onClick={handleCloseModal}
        sx={{ minWidth: 120 }}
      >
        Close
      </Button>
      <Button 
        variant="contained" 
        onClick={handlePrint}
        startIcon={<PrintIcon />}
        sx={{ minWidth: 120 }}
        disabled={examResults.length === 0}
      >
        Print
      </Button>
    </Box>
  </Box>
</Modal>
      </Box>
    </Box>
  );
};

export default StudentResultDashboard;