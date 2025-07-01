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
  Alert,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const UpdateTeacher = () => {
   const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    const schoolName = schoolData.name || '';
    console.log('School Name:', schoolName);

    if (!schoolName) return;

    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/teachers/teachers', {
          params: { schoolName }
        });

        if (response.data.success) {
          setTeachers(response.data.teachers);
          setFilteredTeachers(response.data.teachers);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch teachers',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTeachers(
      teachers.filter((t) =>
        (t.name && t.name.toLowerCase().includes(query)) ||
        (t.subject && t.subject.toLowerCase().includes(query)) ||
        (t.staff_id && t.staff_id.toLowerCase().includes(query))
      )
    );
  };

  const handleUpdateClick = (teacher) => {
    setSelectedTeacher({ ...teacher });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTeacher) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setUploadingPhoto(true);
      const response = await axios.post(
        `http://localhost:5000/api/teachers/upload-photo/${selectedTeacher.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.success) {
        setSelectedTeacher((prev) => ({
          ...prev,
          photo_url: response.data.photoUrl
        }));
        setSnackbar({
          open: true,
          message: 'Photo uploaded successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
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
        `http://localhost:5000/api/teachers/${selectedTeacher.id}`,
        selectedTeacher
      );

      const updatedList = teachers.map((t) =>
        t.id === selectedTeacher.id ? selectedTeacher : t
      );
      setTeachers(updatedList);
      setFilteredTeachers(updatedList);
      setModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Teacher updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Update failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update teacher',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 0 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 0 }}>
  <ArrowBack />
</IconButton>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Update Teacher
      </Typography>

      <TextField
        label="Search by Name, Subject, or Staff ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography>Loading teachers...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Teacher ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      {teacher.photo_url ? (
                        <Box
                          component="img"
                          src={`http://localhost:5000${teacher.photo_url}`}
                          alt="Teacher"
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Typography variant="caption">No Photo</Typography>
                      )}
                    </TableCell>
                    <TableCell>{teacher.teacher_name}</TableCell>
                    <TableCell>{teacher.teacher_id}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleUpdateClick(teacher)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No teachers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Teacher</DialogTitle>
  <DialogContent>
  <Grid container spacing={2}>
    <Grid item xs={12}>
      {selectedTeacher?.photo_url ? (
        <Box
          component="img"
          src={`http://localhost:5000${selectedTeacher.photo_url}`}
          alt="Teacher"
          sx={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #ccc'
          }}
        />
      ) : (
        <Typography>No Photo</Typography>
      )}
      <Button
        variant="contained"
        component="label"
        sx={{ mt: 1 }}
        disabled={uploadingPhoto}
      >
        {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
        <Input type="file" onChange={handlePhotoUpload} sx={{ display: 'none' }} />
      </Button>
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Full Name"
        name="teacher_name"
        value={selectedTeacher?.teacher_name || ''}
        onChange={handleFieldChange}
        fullWidth
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Teacher ID"
        name="teacher_id"
        value={selectedTeacher?.teacher_id || ''}
        onChange={handleFieldChange}
        fullWidth
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Email"
        name="email"
        value={selectedTeacher?.email || ''}
        onChange={handleFieldChange}
        fullWidth
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Phone"
        name="phone"
        value={selectedTeacher?.phone || ''}
        onChange={handleFieldChange}
        fullWidth
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Department"
        name="department"
        value={selectedTeacher?.department || ''}
        onChange={handleFieldChange}
        fullWidth
      />
    </Grid>
  </Grid>
</DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateTeacher;
