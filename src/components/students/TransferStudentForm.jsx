import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  IconButton,

} from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';

const TransferStudentForm = () => {
  const { admissionNumber } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // Note: Fix the API endpoint: /api/students/student/:admissionNumber
        const res = await axios.get(`http://localhost:5000/api/students/student/${encodeURIComponent(admissionNumber)}`);
        setStudent(res.data.student);
      } catch (err) {
        setError('Failed to load student data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (admissionNumber) {
      fetchStudent();
    }
  }, [admissionNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');

    try {
      // Fix API endpoint for PUT
      await axios.put(`http://localhost:5000/api/students/student/${encodeURIComponent(admissionNumber)}`, student);
      navigate('/admin/transfer-student'); // navigate back to transfer-student list or wherever appropriate
    } catch (err) {
      setError('Failed to transfer student');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading student info...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!student) {
    // Just in case student is null but loading is false and no error
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No student data available.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <IconButton onClick={() => navigate(-1)} color="primary">
    <ArrowBack />
  </IconButton>
  <Typography variant="h5" sx={{ ml: 1 }}>Transfer Student</Typography>
</Box>


      <TextField
        label="First Name"
        name="firstName"
        value={student.full_name || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />

      <TextField
        label="Admission Number"
        name="admissionNumber"
        value={student.admission_number || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />

      <TextField
        label="Current Class"
        name="className"
        value={student.class_name || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />

      {/* Transfer to new class */}
      <TextField
        label="Transfer To Class"
        name="transferClass"
        value={student.transferClass || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Enter new class"
      />

      {/* Transfer to new school */}
      <TextField
        label="Transfer To School"
        name="transferSchool"
        value={student.transferSchool || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Enter new school"
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => navigate('/admin/transfer-student')}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !student.transferClass}
        >
          {saving ? 'Transferring...' : 'Transfer'}
        </Button>
      </Box>
    </Box>
  );
};

export default TransferStudentForm;
