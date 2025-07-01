import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HomePage = () => {
  const [schoolCount, setSchoolCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/school-count')
      .then((res) => res.json())
      .then((data) => {
        setSchoolCount(data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch school count', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <CircularProgress size={64} thickness={5} sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #1e3c72, #2a5298)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
    <Box sx={{ maxWidth: 1000, width: '100%', mx: 'auto' }}>
  <Paper
    elevation={12}
    sx={{
      p: { xs: 2, md: 3 },  // Reduced padding here
      backdropFilter: 'blur(15px)',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: 8,
      color: 'white',
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      textAlign: 'center',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
      },
    }}
  >
    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ letterSpacing: 1 }}>
      🎓 GradeLink365
    </Typography>

    <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 4, maxWidth: 700, mx: 'auto' }}>
      "Transform your school's management with our all-in-one solution – simplifying
      administration, enhancing collaboration, and delivering academic insights."
    </Typography>

    <Box sx={{ textAlign: 'left', mb: 4, ml: { xs: 1, sm: 4 }, pl: 1 }}>
      {[
        'Register & manage multiple schools',
        'Student & teacher performance analytics',
        'Secure attendance and grading system',
        'Detailed report generation',
        'Mobile and desktop responsive interface',
      ].map((feature, index) => (
        <Typography
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1.2,
            fontSize: '1rem',
          }}
        >
          <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
          {feature}
        </Typography>
      ))}
    </Box>

    <Typography
      variant="h6"
      gutterBottom
      sx={{
        mb: 3,
        fontWeight: 'medium',
        background: 'rgba(255,255,255,0.1)',
        py: 0.8,
        borderRadius: 2,
      }}
    >
      📊 <i>Currently, {schoolCount} schools are registered!</i>
    </Typography>

    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          fullWidth
          sx={{
            py: 1.1,
            fontSize: '1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #43e97b, #38f9d7)',
            color: '#000',
            borderRadius: 3,
            '&:hover': {
              background: 'linear-gradient(to right, #32e37a, #32d8ce)',
            },
          }}
        >
          Register Your School
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          component={Link}
          to="/admin-login"
          variant="outlined"
          color="success"
          fullWidth
          sx={{
            py: 1.1,
            fontWeight: 'bold',
            color: 'white',
            borderColor: '#66bb6a',
             background: 'linear-gradient(to right,rgba(86, 233, 67, 0.09),rgb(14, 245, 202))',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: 'rgba(102, 187, 106, 0.1)',
            },
          }}
        >
          Admin Login
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          component={Link}
          to="/student-login"
          variant="outlined"
          color="info"
          fullWidth
          sx={{
            py: 1.1,
            fontWeight: 'bold',
            color: 'white',
            borderColor: '#29b6f6',
             background: 'linear-gradient(to right,rgb(30, 18, 194),rgb(103, 180, 170))',
            borderRadius: 3,
            '&:hover': {

              backgroundColor: 'rgba(41, 182, 246, 0.1)',
            },
          }}
        >
          Student Login
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          component={Link}
          to="/teacher-login"
          fullWidth
          sx={{
            py: 1.1,
            fontWeight: 'bold',
            borderRadius: 3,
            border: '2px solidrgb(14, 55, 187)',
             background: 'linear-gradient(to right,rgb(92, 67, 233),rgb(249, 56, 201))',
            color: '#FF9800',
            '&:hover': {
              backgroundColor: 'rgba(58, 172, 156, 0.1)',
              color: '#E65100',
            },
          }}
        >
          Teacher Login
        </Button>
      </Grid>
    </Grid>
  </Paper>
</Box>

</Box>
  );
};

export default HomePage;
