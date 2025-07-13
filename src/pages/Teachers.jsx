import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Avatar,
  IconButton,
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Autocomplete,
  Snackbar,
  Alert,CircularProgress,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon
} from '@mui/icons-material';

import TeacherRow from '../components/teachers/TeacherRow';
import { getTeachers } from '../services/teacherService';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    department: '',
    photo: null,
  });

  // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

 useEffect(() => {
  const fetchTeachers = async () => {
    try {
      // Log school name before fetching
      const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
      console.log('Fetching teachers for school:', schoolData.schoolName);
      
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchTeachers();
}, []);

  const filteredTeachers = teachers.filter((teacher) =>
    (teacher.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => setOpenAddModal(true);

  const handleCloseModal = () => {
    setOpenAddModal(false);
    setNewTeacher({
      full_name: '',
      email: '',
      phone: '',
      gender: '',
      department: '',
      photo: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

const handleAddTeacher = async () => {
  // 1. Enhanced school data retrieval
  const getSchoolInfo = () => {
    try {
      // Check multiple possible storage locations
      const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
      const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
      
      // Return whichever contains school information
      return adminData.school || adminData.schoolName || schoolData.school || schoolData.schoolName 
        ? { ...adminData, ...schoolData }
        : null;
    } catch (err) {
      console.error('Error parsing school data:', err);
      return null;
    }
  };

  // 2. Get school information with fallbacks
  const schoolInfo = getSchoolInfo();
  console.log('School information:', schoolInfo);
  
  if (!schoolInfo) {
    setSnackbarMessage('School information not found. Please login again.');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }

  const schoolName = schoolInfo.schoolName || schoolInfo.school || 'Unknown School';
  const schoolId = schoolInfo.id || schoolInfo.schoolId;
  console.log(`Adding teacher to: ${schoolName} (ID: ${schoolId || 'N/A'})`);

  // 3. Validate required fields
  if (!newTeacher.full_name || !newTeacher.department) {
    setSnackbarMessage('Please fill all required fields (Name and Department)');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }

  // 4. Prepare form data with school information
  const form = new FormData();
  form.append('schoolName', schoolName);
  if (schoolId) form.append('schoolId', schoolId);
  form.append('full_name', newTeacher.full_name.trim());
  form.append('email', newTeacher.email?.trim() || '');
  form.append('phone', newTeacher.phone?.trim() || '');
  form.append('gender', newTeacher.gender || '');
  form.append('department', newTeacher.department.trim());

  if (newTeacher.photo) {
    if (newTeacher.photo.size > 2 * 1024 * 1024) { // 2MB limit
      setSnackbarMessage('Photo size must be less than 2MB');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    form.append('photo', newTeacher.photo);
  }

  // 5. Enhanced FormData logging
  console.log('Submitting teacher data:');
  const formDataObj = {};
  for (let [key, value] of form.entries()) {
    if (key === 'photo') {
      console.log(`photo: ${value.name} (${value.size} bytes)`);
      formDataObj[key] = `${value.name} (${value.size} bytes)`;
    } else {
      console.log(`${key}: ${value}`);
      formDataObj[key] = value;
    }
  }
  console.log('Complete form data:', formDataObj);

  // 6. Submit with enhanced error handling
  try {
    setLoading(true);
    const response = await axios.post('https://gradelink.onrender.com/api/teachers/add-teacher', form, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using auth
      },
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status < 500
    });

    if (response.status === 201) {
      setSnackbarMessage(
        `Teacher added to ${schoolName} successfully! ID: ${response.data.teacher_id}. Temporary password: ${response.data.password}`
      );
      setSnackbarSeverity('success');
      
      // Refresh teacher list with loading state
      const data = await getTeachers();
      setTeachers(data);
    } else {
      setSnackbarMessage(response.data.message || 'Unexpected response from server');
      setSnackbarSeverity('warning');
    }
  } catch (err) {
    let errorMessage = 'Failed to add teacher';
    if (err.response) {
      errorMessage = err.response.data?.error || err.response.data?.message || JSON.stringify(err.response.data);
      console.error('Server error:', {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      });
    } else if (err.request) {
      errorMessage = 'No response from server';
      console.error('No response:', err.request);
    } else {
      errorMessage = err.message;
      console.error('Request error:', err.message);
    }
    
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity('error');
  } finally {
    setLoading(false);
    setOpenSnackbar(true);
    handleCloseModal();
  }
};


if (loading) {
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={40} color="primary" />
        <Typography
          variant="h6"
          sx={{ mt: 2 }}
          color="text.secondary"
        >
          Loading teachers...
        </Typography>
      </Box>
    </Fade>
  );
}



  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Teachers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Add Teacher
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teachers ID</TableCell>
              <TableCell>Teacher Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TeacherRow key={teacher.id} teacher={teacher} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAddModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Add New Teacher
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              src={newTeacher.photo ? URL.createObjectURL(newTeacher.photo) : ''}
              sx={{ width: 80, height: 80, mb: 1 }}
            >
              {newTeacher.full_name ? newTeacher.full_name.charAt(0).toUpperCase() : 'T'}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
            >
              Upload Photo
              <input type="file" hidden accept="image/*" name="photo" onChange={handleInputChange} />
            </Button>
            {newTeacher.photo && (
              <Typography variant="caption" sx={{ mb: 2 }}>
                {newTeacher.photo.name}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Full Name"
                name="full_name"
                value={newTeacher.full_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                name="email"
                value={newTeacher.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Phone"
                name="phone"
                type="tel"
                value={newTeacher.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Department"
                name="department"
                value={newTeacher.department}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={['Male', 'Female', 'Other']}
                value={newTeacher.gender}
                onChange={(e, value) =>
                  setNewTeacher((prev) => ({ ...prev, gender: value }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Gender" size="small" required />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button onClick={handleAddTeacher} variant="contained" sx={{ minWidth: 100 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Teachers;
