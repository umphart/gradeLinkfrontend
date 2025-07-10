import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Grid,
  Paper,
  Avatar,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchool } from '../services/schoolService';
import { CircularProgress } from '@mui/material';

const steps = ['School Information', 'Admin Details', 'Upload Logo', 'Review & Submit'];

const SchoolRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    schoolLogo: null,
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      // Validate file before setting
      if (files[0].size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(files[0].type)) {
        setError('Only JPEG and PNG images are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const validateStep = (step) => {
    const errors = [];
    
    if (step === 0) {
      if (!formData.schoolName.trim()) errors.push('School name is required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Valid email is required');
      if (!formData.address.trim()) errors.push('Address is required');
    } 
    else if (step === 1) {
      if (!formData.adminFirstName.trim()) errors.push('First name is required');
      if (!formData.adminLastName.trim()) errors.push('Last name is required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) errors.push('Valid admin email is required');
      if (formData.adminPassword.length < 8) errors.push('Password must be at least 8 characters');
      if (formData.adminPassword !== formData.confirmPassword) errors.push('Passwords do not match');
    }
    else if (step === 2) {
      if (!formData.schoolLogo) errors.push('School logo is required');
    }
    else if (step === 3) {
      if (!formData.termsAccepted) errors.push('You must accept the terms');
    }

    if (errors.length > 0) {
      setError(errors.join('. '));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const form = new FormData();
    
    // School Information
    form.append('name', formData.schoolName);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('address', formData.address);
    form.append('city', formData.city);
    form.append('state', formData.state);
    
    // Admin Information
    form.append('adminFirstName', formData.adminFirstName);
    form.append('adminLastName', formData.adminLastName);
    form.append('adminEmail', formData.adminEmail);
    form.append('adminPhone', formData.adminPhone);
    form.append('adminPassword', formData.adminPassword);
    
    // File upload - field name must match backend ('logo')
    // In your form submission handler:
   if (formData.schoolLogo) {
      form.append('schoolLogo', formData.schoolLogo);
    }

    const response = await fetch('/api/schools/register', {
      method: 'POST',
      body: form
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    setSuccess(true);
    setTimeout(() => navigate('/admin-login'), 3000);
    
  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message || 'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ 
        mt: 10, 
        display: 'flex', 
        justifyContent: 'center',
        minHeight: '80vh',
        alignItems: 'center'
      }}>
        <Paper elevation={4} sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          width: '100%',
          maxWidth: 500
        }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Creating Your School Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This may take a few moments. Please don't close this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ 
        mt: 10, 
        display: 'flex', 
        justifyContent: 'center',
        minHeight: '80vh',
        alignItems: 'center'
      }}>
        <Paper elevation={4} sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          width: '100%',
          maxWidth: 500
        }}>
          <CheckCircleIcon sx={{ 
            fontSize: 60, 
            color: 'success.main', 
            mb: 3,
            animation: 'pulse 1.5s infinite'
          }} />
          <Typography variant="h4" gutterBottom>
            Registration Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your school account has been created. Redirecting to login...
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/admin-login')}
            sx={{ mt: 2 }}
          >
            Go to Login Now
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 4,
        backgroundColor: 'background.paper'
      }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <SchoolIcon sx={{ 
            fontSize: 60, 
            color: 'primary.main', 
            mb: 2 
          }} />
          <Typography variant="h4" gutterBottom>
            Register Your School
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete the following steps to register your school
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School Name *"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="School Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address *"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name *"
                name="adminFirstName"
                value={formData.adminFirstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name *"
                name="adminLastName"
                value={formData.adminLastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                name="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="adminPhone"
                type="tel"
                value={formData.adminPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password *"
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                helperText="Minimum 8 characters"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password *"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            py: 4
          }}>
            <Avatar
              src={logoPreview || ''}
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                fontSize: 60,
                bgcolor: 'primary.main'
              }}
            >
              {formData.schoolName ? formData.schoolName.charAt(0).toUpperCase() : 'S'}
            </Avatar>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload School Logo *
              <input
                type="file"
                hidden
                accept="image/*"
                name="schoolLogo"
                onChange={handleChange}
              />
            </Button>
            {formData.schoolLogo && (
              <Typography variant="body2">
                Selected: {formData.schoolLogo.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Recommended size: 500x500px, Max 5MB
            </Typography>
          </Box>
        )}

        {activeStep === 3 && (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Review Your Information
            </Typography>

            <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}>
                <SchoolIcon sx={{ mr: 1 }} /> School Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Name:</strong> {formData.schoolName}</Typography>
                  <Typography><strong>Email:</strong> {formData.email}</Typography>
                  <Typography><strong>Phone:</strong> {formData.phone || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Address:</strong></Typography>
                  <Typography>
                    {formData.address}, {formData.city}, {formData.state}
                  </Typography>
                </Grid>
                {logoPreview && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mt: 2,
                      gap: 2
                    }}>
                      <Typography><strong>Logo:</strong></Typography>
                      <Avatar
                        src={logoPreview}
                        alt="School Logo Preview"
                        sx={{ width: 60, height: 60 }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 3, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}>
                <PersonIcon sx={{ mr: 1 }} /> Admin Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Name:</strong> {formData.adminFirstName} {formData.adminLastName}</Typography>
                  <Typography><strong>Email:</strong> {formData.adminEmail}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Phone:</strong> {formData.adminPhone || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  name="termsAccepted"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 4,
              gap: 2
            }}>
              <Button 
                onClick={handleBack} 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ flex: 1 }}
                disabled={!formData.termsAccepted}
              >
                Submit Registration
              </Button>
            </Box>
          </Box>
        )}

        {activeStep < 3 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 4,
            gap: 2
          }}>
            <Button 
              onClick={handleBack} 
              disabled={activeStep === 0} 
              variant="outlined"
              sx={{ flex: 1 }}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              variant="contained"
              sx={{ flex: 1 }}
            >
              {activeStep === steps.length - 2 ? 'Review' : 'Next'}
            </Button>
          </Box>
        )}

        <Box sx={{ 
          mt: 4, 
          textAlign: 'center',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/admin-login" style={{ fontWeight: 500 }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SchoolRegistration;