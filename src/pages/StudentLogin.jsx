import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Paper,
  Avatar,
  LockOutlined
} from '@mui/material';
import axios from 'axios';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ admissionNumber: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const { admissionNumber, password } = formData;

  if (!admissionNumber || !password) {
    setError('Please enter a valid admission number and password.');
    return;
  }

  try {
    setError(null);
    setLoading(true);

    const response = await axios.post('http://localhost:5000/api/studentsLogin', {
      admissionNumber,
      password,
    });

    if (response.status === 200) {
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      // Refresh page to fetch all related records
      window.location.href = '/student-dashboard';
    }
  } catch (err) {
    console.error('Login error:', err);
    setError(err.response?.data?.message || 'Login failed. Please try again.');
    setLoading(false);
  }
};


  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url(/images/school5.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 400, 
          borderRadius: 3,
         backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ 
              m: 1, 
              bgcolor: 'secondary.main',
              width: 56,
              height: 56
            }}>
          
            </Avatar>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
              Student Login
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Admission Number"
              name="admissionNumber"
              type="text"
              value={formData.admissionNumber}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              required
              sx={{ mb: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
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
              sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            />

      <Button 
  type="submit" 
  fullWidth 
  variant="contained" 
  sx={{ mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
  disabled={loading}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
</Button>


            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <Link to="/"  style={{ textDecoration: 'none', color: '#1976d2' }}>    ⬅️ </Link> 
              <Link 
                to="/admin-login" 
                style={{ 
                  textDecoration: 'none',
                  color: '#1976d2',
                  fontWeight: '500',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Login as Admin
              </Link>
              
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentLogin;