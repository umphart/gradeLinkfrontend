import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, Paper, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Basic validation
    if (!email || !email.includes('@') || !password) {
      setError('Please enter a valid email and password.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const response = await axios.post(
        'https://gradelink.onrender.com/api/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data.message === 'Login successful') {
        const { user } = response.data;
        
        // For now, store user data directly (add JWT later)
        localStorage.setItem('admin', JSON.stringify(user));
        login(user); // Update auth context

        // Redirect after slight delay for better UX
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/school4.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: isMobile ? 2 : 0,
    }}>
      <Container maxWidth="xs" sx={{ p: isMobile ? 0 : 2 }}>
        <Paper elevation={isMobile ? 0 : 6} sx={{ 
          p: isMobile ? 3 : 4, 
          width: '100%', 
          maxWidth: 400, 
          borderRadius: isMobile ? 0 : 3,
          backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isMobile ? 'none' : theme.shadows[6],
        }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ 
              m: 1, 
              bgcolor: 'secondary.main',
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56
            }} />
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ mt: 1, fontWeight: 'bold' }}>
              School Admin Login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: isMobile ? '0.8rem' : '1rem' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              required
              sx={{ mb: 2 }}
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              required
              sx={{ mb: 3 }}
              size={isMobile ? 'small' : 'medium'}
            />

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ 
                mb: 2,
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Typography 
              variant="body2" 
              align="center" 
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>⬅️ </Link>  
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Register your school
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;