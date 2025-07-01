import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
const AddSubject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject_name: '',
    description: '',
    subject_code: '',
    classname: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/subjects/add', {
        schoolName,
        subject_name: form.subject_name,
        description: form.description,
        subject_code: form.subject_code,
        classname: form.classname,
      });

      setForm({
        subject_name: '',
        description: '',
        subject_code: '',
        classname: '',
      });

      setSnackbarMsg(response.data.message || 'Subject added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error adding subject:', err);
      setSnackbarMsg(err.response?.data?.message || 'Failed to add subject');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 0, maxWidth: 1300, mx: 'auto' }}>
          
  <IconButton onClick={() => navigate(-1)} sx={{ mb: 0 }}>
  <ArrowBack />
</IconButton>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add Subject
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Subject Name"
                name="subject_name"
                value={form.subject_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Subject Code"
                name="subject_code"
                value={form.subject_code}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Class Name"
                name="classname"
                value={form.classname}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={1}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={1.8}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSubject;
