import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

const Subject = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Define showSnackbar at the top level of the component
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const [id, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState({
    id: null,
    subject_name: '',
    subject_code: '',
    classname: '',
    description: ''
  });

  const schoolData = JSON.parse(localStorage.getItem('admin') || JSON.parse(localStorage.getItem('school')));
  const schoolName = schoolData?.schoolName || '';

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('https://gradelink.onrender.com/api/subjects/all', {
        params: { schoolName },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubjects(response.data.subjects);
    } catch (err) {
      setError('Failed to fetch subjects');
      console.error(err);
      showSnackbar('Failed to fetch subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schoolName) {
      fetchSubjects();
    } else {
      setError('No school found in localStorage');
      setLoading(false);
      showSnackbar('No school information found', 'error');
    }
  }, [schoolName]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`https://gradelink.onrender.com/api/subjects/delete/${id}`, {
        params: { schoolName },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubjects(subjects.filter((s) => s.id !== id));
      showSnackbar('Subject deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete subject:', err);
      showSnackbar('Delete failed. Please try again.', 'error');
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (subject) => {
    setSubjectToEdit({
      id: subject.id,
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      classname: subject.classname,
      description: subject.description
    });
    setEditOpen(true);
  };

  const handleChange = (e) => {
    setSubjectToEdit({
      ...subjectToEdit,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://gradelink.onrender.com/api/subjects/update/${subjectToEdit.id}`,
        {
          ...subjectToEdit,
          schoolName,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSubjects(subjects.map(s =>
        s.id === subjectToEdit.id ? response.data.subject : s
      ));
      setEditOpen(false);
      showSnackbar('Subject updated successfully', 'success');
    } catch (err) {
      console.error('Failed to update subject:', err);
      showSnackbar('Update failed. Please try again.', 'error');
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 0 }}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" sx={{ mb: 2 }}>Subject List</Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : subjects.length === 0 ? (
        <Typography>No subjects found.</Typography>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject Name</TableCell>
                <TableCell>Subject Code</TableCell>
                <TableCell>Class Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.subject_name}</TableCell>
                  <TableCell>{subject.subject_code}</TableCell>
                  <TableCell>{subject.classname}</TableCell>
                  <TableCell>{subject.description || '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(subject)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(subject.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subject?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            name="subject_name"
            label="Subject Name"
            value={subjectToEdit.subject_name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="subject_code"
            label="Subject Code"
            value={subjectToEdit.subject_code}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="classname"
            label="Class Name"
            value={subjectToEdit.classname}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Description"
            value={subjectToEdit.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
    <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Subject;