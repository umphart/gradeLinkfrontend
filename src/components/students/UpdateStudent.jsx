import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Input,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const UpdateStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    const schoolName = schoolData.name || '';

    if (!schoolName) {
      console.warn('No school name found in localStorage.');
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/students/students', {
          params: { schoolName }
        });
        const data = response.data;

        if (data.success) {
          const { junior = [], primary = [], senior = [] } = data.students;
          const allStudents = [...junior, ...primary, ...senior];
          setStudents(allStudents);
          setFilteredStudents(allStudents);
        } else {
          console.error('Error fetching students:', data.message);
          setSnackbar({
            open: true,
            message: 'Failed to fetch students',
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch students',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      (student.full_name && student.full_name.toLowerCase().includes(query)) ||
      (student.admission_number && student.admission_number.toLowerCase().includes(query)) ||
      (student.class_name && student.class_name.toLowerCase().includes(query))
    );

    setFilteredStudents(filtered);
  };

  const handleUpdateClick = (student) => {
    setSelectedStudent({
      full_name: student.full_name || '',
      admission_number: student.admission_number || '',
      class_name: student.class_name || '',
      gender: student.gender || '',
      section: student.section || '',
      age: student.age || '',
      guidance_name: student.guidance_name || '',
      guidance_contact: student.guidance_contact || '',
      disability_status: student.disability_status || '',
      id: student.id,
      photo_url: student.photo_url || '',
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setUploadingPhoto(true);
      const response = await axios.post(
        `http://localhost:5000/api/students/upload-photo/${selectedStudent.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const updatedPhotoUrl = response.data.photoUrl;
        setSelectedStudent(prev => ({
          ...prev,
          photo_url: updatedPhotoUrl
        }));
        
        setSnackbar({
          open: true,
          message: 'Photo updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setSnackbar({
        open: true,
        message: 'Failed to upload photo',
        severity: 'error'
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/students/${selectedStudent.id}`,
        selectedStudent
      );
      
      const updatedList = students.map((stu) =>
        stu.id === selectedStudent.id ? selectedStudent : stu
      );
      
      setStudents(updatedList);
      setFilteredStudents(updatedList);
      setModalOpen(false);
      
      setSnackbar({
        open: true,
        message: 'Student updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to update student:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update student',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <IconButton onClick={() => navigate(-1)} color="primary">
    <ArrowBack />
  </IconButton>
  <Typography variant="h5" sx={{ ml: 1 }}>Update Student</Typography>
</Box>
  
      <TextField
        label="Search by Name, Admission No., or Class"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {loading && !modalOpen ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography>Loading students...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.photo_url ? (
                        <Box
                          component="img"
                          src={`http://localhost:5000${student.photo_url}`}
                          alt="Student"
                          sx={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#eee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="caption">No Photo</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{student.full_name}</TableCell>
                    <TableCell>{student.admission_number}</TableCell>
                    <TableCell>{student.class_name}</TableCell>
                    <TableCell>{student.section || '-'}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleUpdateClick(student)}
                        disabled={loading}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Student Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Photo Section */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box>
                  {selectedStudent?.photo_url ? (
                    <Box
                      component="img"
                      src={`http://localhost:5000${selectedStudent.photo_url}`}
                      alt="Student"
                      sx={{
                        width: '100px',
                        height: '100px',
                        borderRadius: 2,
                        border: '1px solid #ccc',
                        boxShadow: 1,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100px',
                        height: '100px',
                        borderRadius: 2,
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        No photo
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Box>
                  <Button
                    variant="contained"
                    component="label"
                    disabled={uploadingPhoto}
                    sx={{ mb: 1 }}
                  >
                    {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    <Input
                      type="file"
                      onChange={handlePhotoUpload}
                      inputProps={{ accept: 'image/*' }}
                      sx={{ display: 'none' }}
                    />
                  </Button>
                  <Typography variant="caption" display="block">
                    JPG, PNG (max 2MB)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Student Details */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                name="full_name"
                value={selectedStudent?.full_name || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Admission Number"
                name="admission_number"
                value={selectedStudent?.admission_number || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Class"
                name="class_name"
                value={selectedStudent?.class_name || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Gender"
                name="gender"
                value={selectedStudent?.gender || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Section"
                name="section"
                value={selectedStudent?.section || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Age"
                name="age"
                value={selectedStudent?.age || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
                type="number"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Guardian Name"
                name="guidance_name"
                value={selectedStudent?.guidance_name || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Guardian Contact"
                name="guidance_contact"
                value={selectedStudent?.guidance_contact || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Disability Status"
                name="disability_status"
                value={selectedStudent?.disability_status || ''}
                onChange={handleFieldChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateStudent;