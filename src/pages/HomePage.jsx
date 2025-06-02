import { Box, Button, Container, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../App.css";

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

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        py: 4,
        background: 'linear-gradient(to right, #2980b9, #2c3e50)',
        display: 'flex',
        alignItems: 'center',
        fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              textAlign: 'center',
              backgroundColor: 'rgba(133, 194, 212, 0.70)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              padding: { xs: 3, md: 4 },
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                color: '#2c3e50',
                fontWeight: 700,
                fontFamily: '"Montserrat", sans-serif',
                mb: 3,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              Welcome to School Management System
            </Typography>
            
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                color: 'white',
                fontWeight: 500,
                mb: 3,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontStyle: 'italic'
              }}
            >
              <i>"Transform your school's management with our all-in-one solution - simplifying administration, 
              enhancing student-teacher collaboration, and providing real-time insights to drive educational 
              excellence."</i>
            </Typography>

            <Box 
              sx={{ 
                my: 2,
                textAlign: 'left',
                px: { xs: 1, md: 3 },
                '& > *': {
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }
              }}
            >
              <Typography variant="body1">✅ Register & manage multiple schools</Typography>
              <Typography variant="body1">✅ Comprehensive student & teacher management</Typography>
              <Typography variant="body1">✅ Real-time attendance & performance tracking</Typography>
              <Typography variant="body1">✅ Automated report generation</Typography>
              <Typography variant="body1">✅ Secure role-based access control</Typography>
            </Box>

            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                fontWeight: 600, 
                mt: 3,
                mb: 2,
                fontSize: { xs: '1.1rem', md: '1.2rem' }
              }}
            ><i>
              {loading ? 'Fetching data...' : `Currently, there are ${schoolCount} schools registered!`}
            </i></Typography>

            <Box 
              sx={{ 
                mt: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                gap: 2,
                '& > *': {
                  flex: { xs: 'none', sm: 1 },
                  textDecoration: 'none !important',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  },
                  transition: 'transform 0.3s ease'
                }
              }}
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(41, 128, 185, 0.4)',
                  background: 'linear-gradient(45deg, #2980b9, #2c3e50)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(41, 128, 185, 0.6)',
                    background: 'linear-gradient(45deg, #2c3e50, #2980b9)'
                  }
                }}
              >
                Register Your School
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/admin-login"
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderWidth: '2px',
                  borderColor: '#2980b9',
                  color: '#2980b9',
                  '&:hover': { 
                    backgroundColor: 'rgba(41, 128, 185, 0.1)',
                    borderWidth: '2px',
                    borderColor: '#2980b9'
                  },
                }}
              >
                Admin Login
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/student-login"
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderWidth: '2px',
                  borderColor: '#27ae60',
                  color: '#27ae60',
                  '&:hover': { 
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: '2px',
                    borderColor: '#27ae60'
                  },
                }}
              >
                Student Login
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
