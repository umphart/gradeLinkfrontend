import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  IconButton,
  Alert
} from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const AssignSubject = () => {
   const navigate = useNavigate();
  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // or 'error'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, subjectRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/teachers?schoolName=${schoolName}`),
          axios.get(`http://localhost:5000/api/subjects/all?schoolName=${schoolName}`)
        ]);
        setTeachers(teacherRes.data);
        setSubjects(subjectRes.data.subjects);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [schoolName]);

  const handleAssign = async () => {
    setLoading(true);
    setMsg('');

    const selectedTeacherObj = teachers.find(t => t.teacher_id === selectedTeacher);
    const selectedSubjectObj = subjects.find(s => s.id === selectedSubject);
   

    try {
      const res = await axios.post('http://localhost:5000/api/subjects/assign-subject', {
        schoolName,
        teacher_id: selectedTeacher,
        subject_id: selectedSubject,
        teacher_name: selectedTeacherObj?.teacher_name,
        subject_name: selectedSubjectObj?.subject_name,
        subject_code: selectedSubjectObj?.subject_code,
        classname: selectedSubjectObj?.classname
      });

      setMsg(res.data.message);
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Assignment failed');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  return (
    <Box sx={{ p: 0 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 0 }}>
  <ArrowBack />
</IconButton>
      <Typography variant="h4" gutterBottom>Assign Subject to Teacher</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Select Teacher"
          value={selectedTeacher}
          onChange={e => setSelectedTeacher(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {teachers.map(t => (
            <MenuItem key={t.teacher_id} value={t.teacher_id}>
              {t.teacher_name} ({t.teacher_id})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Subject"
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {subjects.map(s => (
            <MenuItem key={s.id} value={s.id}>
              {s.subject_name} ({s.subject_code})
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={loading}
          sx={{ height: '56px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Assign'}
        </Button>
      </Box>

      {/* Snackbar Alert */}
      <Snackbar open={alertOpen} onClose={handleCloseAlert} autoHideDuration={2000}>
        <Alert severity={alertSeverity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignSubject;
