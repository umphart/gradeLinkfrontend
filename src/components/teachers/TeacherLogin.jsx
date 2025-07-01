import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Avatar,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({ teacherId: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { teacherId, password } = formData;

  if (!teacherId || !password) {
    setError('Please enter your ID and password.');
    return;
  }

  try {
    setError(null);
    setLoading(true);
    const response = await axios.post('http://localhost:5000/api/teachersLogin', {
      teacherId,
      password,
    });

    if (response.status === 200) {
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      // Force full page reload to ensure related records are freshly fetched
      window.location.href = '/teacher-dashboard';
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
          maxWidth: 400,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
              Teacher Login
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Teacher ID"
              name="teacherId"
              type="text"
              value={formData.teacherId}
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

            <Typography variant="body2" align="center">
              <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>⬅️ Home</Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default TeacherLogin;
