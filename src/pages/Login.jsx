import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert, Paper, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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

    // Correct endpoint and data structure
    const response = await axios.post('https://gradelink.onrender.com/api/login', { 
      email, 
      password 
    });

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
    }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 400, 
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ 
              m: 1, 
              bgcolor: 'secondary.main',
              width: 56,
              height: 56
            }} />
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
              School Admin Login
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
            />

<Button 
  type="submit" 
  fullWidth 
  variant="contained" 
  sx={{ mb: 2 }}
  disabled={loading}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
</Button>


            <Typography variant="body2" align="center">
            <Link to="/"  style={{ textDecoration: 'none', color: '#1976d2' }}>⬅️ </Link>  Don't have an account? <Link to="/register"  style={{ textDecoration: 'none', color: '#1976d2' }}>Register your school</Link>
            </Typography>

            
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
