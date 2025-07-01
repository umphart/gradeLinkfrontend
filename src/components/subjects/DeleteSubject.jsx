import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const DeleteSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subjects/all', {
          params: { schoolName }
        });
        setSubjects(response.data.subjects || []);
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

  const handleDelete = async () => {
    if (!selectedSubjectId) {
      setMessage('Please select a subject to delete');
      return;
    }

    try {
      const res = await axios.delete(`/api/subjects/delete/${selectedSubjectId}`, {
        params: { schoolName }
      });

      setMessage(res.data.message);
      setSubjects(prev => prev.filter(sub => sub.subject_id !== selectedSubjectId));
      setSelectedSubjectId('');
    } catch (err) {
      console.error('Delete failed:', err);
      setMessage('Failed to delete subject');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Delete Subject
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
              <Select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                label="Select Subject"
              >
                {subjects.map(sub => (
                  <MenuItem key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name} ({sub.subject_code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 3, py: 1.3, fontWeight: 600 }}
              onClick={handleDelete}
              disabled={!selectedSubjectId}
            >
              Delete Subject
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default DeleteSubject;
