import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Avatar, InputAdornment, CircularProgress,
  IconButton, Snackbar, Alert, Backdrop
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { getStudents, addStudent } from '../services/studentService';
import StudentRow from '../components/students/StudentRow';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    className: '',
    gender: '',
    age: '',
    guidanceName: '',
    guidanceContact: '',
    photo: null,
    section: '',
    disabilityStatus: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const sections = ['Primary', 'Junior', 'Senior'];
  const primaryClasses = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5'];
  const juniorClasses = ['JSS 1', 'JSS 2', 'JSS 3'];
  const seniorClasses = ['SS 1', 'SS 2', 'SS 3'];
  const genders = ['Male', 'Female', 'Other'];

  const getClassesForSection = (section) => {
    switch (section) {
      case 'Primary': return primaryClasses;
      case 'Junior': return juniorClasses;
      case 'Senior': return seniorClasses;
      default: return [];
    }
  };

  const availableClasses = getClassesForSection(newStudent.section);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAutocompleteChange = (name, value) => {
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'section') {
      setNewStudent(prev => ({ ...prev, className: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewStudent(prev => ({ ...prev, photo: file }));
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setNewStudent({
      fullName: '',
      className: '',
      section: '',
      gender: '',
      age: '',
      guidanceName: '',
      guidanceContact: '',
      photo: null,
      disabilityStatus: '',
    });
  };

  const handleAddStudent = async () => {
    const schoolData = JSON.parse(localStorage.getItem('school'));
    const schoolName = schoolData?.name || '';

    if (!newStudent.fullName || !newStudent.className || !newStudent.gender || !newStudent.section) {
      setSnackbarMessage('Please fill all required fields: Full Name, Class, Gender, and Section');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const form = new FormData();
    form.append('schoolName', schoolName);
    form.append('section', newStudent.section);
    form.append('student', JSON.stringify({
      full_name: newStudent.fullName,
      class_name: newStudent.className,
      gender: newStudent.gender,
      age: newStudent.age,
      guidance_name: newStudent.guidanceName,
      guidance_contact: newStudent.guidanceContact,
      disability_status: newStudent.disabilityStatus,
    }));

    if (newStudent.photo) {
      form.append('photo', newStudent.photo);
    }

    setRegistering(true);
    try {
      const response = await addStudent(form);
      setSnackbarMessage(`Student added successfully! Admission Number: ${response.data.admissionNumber}`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleModalClose();
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to add student:', err);
      let errorMessage = 'Failed to add student';
      if (err.response) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      }
      setSnackbarMessage(`Error: ${errorMessage}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setRegistering(false);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to right, #ece9e6, #ffffff)',
        }}
      >
        <CircularProgress size={60} thickness={5} color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Backdrop Loader for Registering */}
      <Backdrop
        open={registering}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
      >
        <CircularProgress color="inherit" size={60} thickness={5} />
      </Backdrop>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Student Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
          Add Student
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name or admission number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Admission No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Disability Status</TableCell>
                <TableCell>Guidance Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentRow key={student.id} student={student} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {searchTerm ? 'No matching students found' : 'No students available'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Add New Student
          <IconButton onClick={handleModalClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#f9f9f9', borderRadius: 1, p: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              src={newStudent.photo ? URL.createObjectURL(newStudent.photo) : ''}
              sx={{ width: 80, height: 80, mb: 1 }}
            >
              {newStudent.fullName ? newStudent.fullName.charAt(0).toUpperCase() : 'S'}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
            >
              Upload Photo
              <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
            </Button>
            {newStudent.photo && (
              <Typography variant="caption" sx={{ mb: 2 }}>
                {newStudent.photo.name}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {[ 
              { label: 'Full Name', name: 'fullName' },
              { label: 'Guardian Name', name: 'guidanceName' },
              { label: 'Age', name: 'age', type: 'number' },
              { label: 'Guardian Contact', name: 'guidanceContact', type: 'tel' },
              { label: 'Disability Status', name: 'disabilityStatus' }
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  size="small"
                  label={field.label}
                  name={field.name}
                  value={newStudent[field.name]}
                  onChange={handleInputChange}
                  type={field.type || 'text'}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={sections}
                value={newStudent.section}
                onChange={(e, value) => handleAutocompleteChange('section', value)}
                renderInput={(params) => (
                  <TextField {...params} label="Section" size="small" required />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={availableClasses}
                value={newStudent.className}
                onChange={(e, value) => handleAutocompleteChange('className', value)}
                renderInput={(params) => (
                  <TextField {...params} label="Class" size="small" required />
                )}
                disabled={!newStudent.section}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={genders}
                value={newStudent.gender}
                onChange={(e, value) => handleAutocompleteChange('gender', value)}
                renderInput={(params) => (
                  <TextField {...params} label="Gender" size="small" required />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
          <Button onClick={handleModalClose} variant="outlined" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button onClick={handleAddStudent} variant="contained" sx={{ minWidth: 100 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;
