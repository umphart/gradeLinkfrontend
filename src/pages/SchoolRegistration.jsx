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
  Avatar
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchool } from '../services/schoolService';
import { CircularProgress } from '@mui/material';

const steps = ['School Information', 'Admin Details', 'Upload Bardge', 'Complete'];

const SchoolRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleNext = () => {
    const requiredFieldsStep0 = ['schoolName', 'email', 'address'];
    const requiredFieldsStep1 = ['adminFirstName', 'adminLastName', 'adminEmail', 'adminPassword', 'confirmPassword'];

    const fieldsToCheck =
      activeStep === 0 ? requiredFieldsStep0 :
      activeStep === 1 ? requiredFieldsStep1 :
      [];

    const hasErrors = fieldsToCheck.some(field => !formData[field] || (field === 'email' && !formData[field].includes('@')));

    if (hasErrors) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    setError(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.adminPassword !== formData.confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const payload = {
      school: {
        name: formData.schoolName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state
        }
      },
      admin: {
        firstName: formData.adminFirstName,
        lastName: formData.adminLastName,
        email: formData.adminEmail,
        phone: formData.adminPhone,
        password: formData.adminPassword
      }
    };

    const form = new FormData();
    form.append('data', JSON.stringify(payload));
    if (formData.schoolLogo) {
      form.append('schoolLogo', formData.schoolLogo);
    }

    await registerSchool(form);
    setSuccess(true);
    setTimeout(() => navigate('/admin-login'), 3000);
  } catch (err) {
    console.error(err);
    setLoading(false); // Stop loading if there's an error
    setError(err.response?.data?.message || 'Registration failed. Please try again.');
  }
};


 if (loading) {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h5" gutterBottom><h1>Submitting your registration....</h1></Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    </Container>
  );
}

if (success) {
  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
        <Typography variant="h4" gutterBottom>Registration Successful!</Typography>
        <Typography variant="body1" sx={{ mb: 3,  color:'wheat'}}>You’ll be redirected to the login page shortly.</Typography>
        <Typography variant="body2" color="text.secondary">
          Didn’t get redirected? <Link to="/login">Click here to login</Link>
        </Typography>
      </Box>
    </Container>
  );
}


  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 ,backgroundColor: 'rgba(255, 255, 255, 0.80)'}}>
        <Box sx={{ mb: 4, textAlign: 'center'}}>
          <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Register Your School</Typography>
          <Typography variant="body1" color="text.secondary">Complete the following steps to register your school</Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="School Email" name="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="School Phone" name="phone" value={formData.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="First Name" name="adminFirstName" value={formData.adminFirstName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Last Name" name="adminLastName" value={formData.adminLastName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" name="adminPhone" value={formData.adminPhone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Password" type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              src={formData.schoolLogo ? URL.createObjectURL(formData.schoolLogo) : ''}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {formData.schoolName ? formData.schoolName.charAt(0).toUpperCase() : 'S'}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload School Logo
              <input
                type="file"
                hidden
                accept="image/*"
                name="schoolLogo"
                onChange={handleChange}
              />
            </Button>
            {formData.schoolLogo && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                {formData.schoolLogo.name}
              </Typography>
            )}
          </Box>
        )}

        {activeStep === 3 && (
          <form onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Review and Submit</Typography>

             <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #eee' }}>
  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
    {/* Left side: School Info */}
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        <SchoolIcon sx={{ mr: 1 }} /> School Info
      </Typography>
      <Typography><strong>Name:</strong> {formData.schoolName}</Typography>
      <Typography><strong>Email:</strong> {formData.email}</Typography>
      <Typography><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}</Typography>
    </Box>

    {/* Right side: School Logo */}
    {formData.schoolLogo && (
      <Box display="flex" flexDirection="column" alignItems="center" ml={4}>
        <Typography variant="body2" sx={{ mb: 1 }}><strong>School Logo:</strong></Typography>
        <Avatar
          src={URL.createObjectURL(formData.schoolLogo)}
          alt="School Logo"
          sx={{ width: 100, height: 100 }}
        />
      </Box>
    )}
  </Box>
</Paper>



              <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #eee' }}>
                <Typography variant="subtitle1" gutterBottom>
                  <PersonIcon sx={{ mr: 1 }} /> Admin Info
                </Typography>
                <Typography><strong>Name:</strong> {formData.adminFirstName} {formData.adminLastName}</Typography>
                <Typography><strong>Email:</strong> {formData.adminEmail}</Typography>
              </Paper>

              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">
                  By submitting this form, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button onClick={handleBack} variant="outlined">Back</Button>
                <Button type="submit" variant="contained">Submit Registration</Button>
              </Box>
            </Box>
          </form>
        )}

        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined">Back</Button>
            <Button variant="contained" onClick={handleNext}>Next</Button>
          </Box>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
     <Link to="/"  style={{ textDecoration: 'none', color: '#1976d2' }}>⬅️ </Link> Already have an account? <Link to="/admin-login"  style={{ textDecoration: 'none', color: '#1976d2' }}>login</Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default SchoolRegistration;
