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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { FiberSmartRecord, SubjectSharp } from '@mui/icons-material';


const drawerWidth = 200;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher-dashboard' },
  { text: 'My Profile', icon: <PersonIcon />, path: '/teacher-profile' },
  { text: 'My Classes', icon: <ClassIcon />, path: '/teacher-classes' },
  { text: 'Manage Exam', icon: <FiberSmartRecord />, path: '/teacher-exams' },
  { text: 'Records', icon: <AssessmentIcon />, path: '/classes' },
  { text: 'My Subjects', icon: <SubjectSharp />, path: '/teacher-subject' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/teacher-settings' },
];

const TeacherDashboard = () => {
  const [hovered, setHovered] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get teacher name on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.fullName) {
      setTeacherName(userData.fullName);
    }
  }, []);

  // Fetch assigned subjects
useEffect(() => {
  const fetchAssignedSubjects = async () => {
    try {
      if (!user?.schoolName || !(user?._id || user?.id)) {
        console.log('Missing schoolName or _id');
        return;
      }

      const teacherId = user._id || user.id;

      console.log('Fetching assigned subjects with:', {
        schoolName: user.schoolName,
        teacherId,
      });

     const response = await fetch(
  `http://localhost:5000/api/subjects/assigned?schoolName=${user.schoolName}&teacher_id=${user.teacherId}` // full teacherId
);

      const data = await response.json();

      if (response.ok) {
        setAssignedSubjects(data.subjects || []);
      } else {
        console.error('Failed to fetch subjects:', data.message);
      }
    } catch (error) {
      console.error('Error fetching assigned subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  fetchAssignedSubjects();
}, [user]);

 useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        if (!user?.schoolName || !(user?._id || user?.id)) {
          console.log('Missing schoolName or _id');
          return;
        }

        const teacherId = user._id || user.id;

        const response = await fetch(
          `http://localhost:5000/api/students/assigned-classes?schoolName=${encodeURIComponent(user.schoolName)}&teacher_id=${encodeURIComponent(teacherId)}`
        );

        const data = await response.json();

        if (response.ok) {
          setAssignedClasses(data.classes || []);
        } else {
          console.error('Failed to fetch assigned classes:', data.message);
        }
      } catch (error) {
        console.error('Error fetching assigned classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchAssignedClasses();
  }, [user]); useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        if (!user?.schoolName || !(user?._id || user?.id)) {
          console.log('Missing schoolName or _id');
          return;
        }

        const teacherId = user._id || user.id;

     const response = await fetch(
  `http://localhost:5000/api/subjects/assigned-classes?schoolName=${user.schoolName}&teacher_id=${user.teacherId}` // full teacherId
);

        const data = await response.json();
        console.log('Data received:', data);
        if (response.ok) {
          setAssignedClasses(data.classes || []);
        } else {
          console.error('Failed to fetch assigned classes:', data.message);
        }
      } catch (error) {
        console.error('Error fetching assigned classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchAssignedClasses();
  }, [user]);
  // Define dashboard items **inside** the component to access state variables
 const dashboardItems = [
  {
    title: 'Assigned Classes',
    value: loadingClasses
      ? 'Loading...'
      : `You teach ${assignedClasses.length} class${assignedClasses.length !== 1 ? 'es' : ''}`,
    icon: <ClassIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    path: '/teacher-classes'
  },
  {
    title: 'Assigned Subjects',
    value: loadingSubjects
      ? 'Loading...'
      : `You have ${assignedSubjects.length} subject${assignedSubjects.length !== 1 ? 's' : ''}`,
    icon: <ClassIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    path: '/teacher-subject'
  },
  {
    title: 'Upcoming Lessons',
    value: 'Next: Physics - 10:30 AM',
    icon: <EventIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
  },
  {
    title: 'Manage Exams',
    value: 'Click to manage exams',
    icon: <FiberSmartRecord sx={{ fontSize: 40, color: '#f57c00' }} />,
    path: '/teacher-exams' 
  },
];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
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
                    primaryTypographyProps={{ sx: { fontWeight: 'bold', color: '#ffffff' } }}
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
              Welcome back{teacherName ? `, ${teacherName}` : ''}!
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
              Teacher Dashboard
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
    textDecoration : 'none',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 6,
      cursor: 'pointer', 
      textDecoration: 'none', 
    },
  }}
  component={Link}  // Make it a Link component
  to={item.path}    // Use the path from the item
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

export default TeacherDashboard;
