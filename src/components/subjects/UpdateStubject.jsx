import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ArrowBack } from '@mui/icons-material';
const UpdateSubject = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  // Fetch subjects
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

  const handleSelectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    const subject = subjects.find(sub => sub.subject_id === subjectId);
    if (subject) {
      setSubjectName(subject.subject_name);
      setSubjectCode(subject.subject_code);
      setDescription(subject.description || '');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put('/api/subjects/update', {
        schoolName,
        subject_id: selectedSubject,
        subject_name: subjectName,
        subject_code: subjectCode,
        description,
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Failed to update subject');
    }
  };

  return (
    <Box sx={{ p: 0 }}>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mb: 0 }}>
  <ArrowBack />
</IconButton>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Update Subject
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Subject</InputLabel>
              <Select value={selectedSubject} onChange={handleSelectChange} label="Select Subject">
                {subjects.map(sub => (
                  <MenuItem key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name} ({sub.subject_code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject Name"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject Code"
                  value={subjectCode}
                  onChange={e => setSubjectCode(e.target.value)}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleUpdate}
              sx={{ mt: 3, py: 1.3, fontWeight: 600 }}
              disabled={!selectedSubject}
            >
              Update Subject
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateSubject;
