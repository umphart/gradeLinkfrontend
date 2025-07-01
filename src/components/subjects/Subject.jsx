import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField
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

  const [id, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState({
    id: null,
    subject_name: '',
    subject_code: '',
    description: ''
  });

  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subjects/all', {
          params: { schoolName },
        });
        setSubjects(response.data.subjects);
      } catch (err) {
        setError('Failed to fetch subjects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (schoolName) {
      fetchSubjects();
    } else {
      setError('No school found in localStorage');
      setLoading(false);
    }
  }, [schoolName]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/subjects/delete/${id}`, {
        params: { schoolName },
      });
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete subject:', err);
      alert('Delete failed. Check the console for details.');
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (subject) => {
    setSubjectToEdit(subject);
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
      await axios.put(`http://localhost:5000/api/subjects/update/${subjectToEdit.id}`, {
        ...subjectToEdit,
        schoolName,
      });

      setSubjects(subjects.map(s =>
        s.id === subjectToEdit.subject_id ? subjectToEdit : s
      ));
      setEditOpen(false);
    } catch (err) {
      console.error('Failed to update subject:', err);
      alert('Update failed. Check console for details.');
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
                  <TableCell>{subject.description}</TableCell>
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
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            name="subject_name"
            label="Subject Name"
            value={subjectToEdit.subject_name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="subject_code"
            label="Subject Code"
            value={subjectToEdit.subject_code}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            value={subjectToEdit.description}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subject;
