import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField,

} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DeleteTeacher = () => {
   const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
      const schoolName = schoolData.name || '';
      if (!schoolName) return;

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/teachers', {
          params: { schoolName }
        });
        if (Array.isArray(response.data)) {
          setTeachers(response.data);
          setFilteredTeachers(response.data);
        } else {
          throw new Error('Unexpected response');
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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = teachers.filter((teacher) =>
      (teacher.teacher_name && teacher.teacher_name.toLowerCase().includes(query)) ||
      (teacher.email && teacher.email.toLowerCase().includes(query)) ||
      (teacher.phone && teacher.phone.toLowerCase().includes(query))
    );

    setFilteredTeachers(filtered);
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${teacherToDelete.id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
      setFilteredTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
      setSnackbar({
        open: true,
        message: 'Teacher deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete teacher',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
    setTeacherToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 0 }}>
              <IconButton onClick={() => navigate(-1)} >
  <ArrowBack />
</IconButton>
      <Typography variant="h4">Delete Teacher</Typography>

      <TextField
        label="Search by Name, Email or Phone"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography>Loading teachers...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.teacher_name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteClick(teacher)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No teachers found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{teacherToDelete?.teacher_name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete} variant="contained">
            Delete
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

export default DeleteTeacher;
