import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const generateSessions = () => {
  const currentYear = new Date().getFullYear();
  const sessions = [];
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    sessions.push(`${i}/${i + 1}`);
  }
  return sessions;
};

const SecondTerm = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    student: '',
    subject: '',
    ca: '',
    exam_mark: '',
    term: 'Second Term',
    session: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
  });
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const schoolName = JSON.parse(localStorage.getItem('school'))?.name || '';

  useEffect(() => {
    if (!schoolName) return;

    const fetchData = async () => {
      try {
        const studentRes = await axios.get(`http://localhost:5000/api/students/students?schoolName=${schoolName}`);
        const subjectRes = await axios.get(`http://localhost:5000/api/subjects/all?schoolName=${schoolName}`);
        const allStudents = Object.values(studentRes.data.students).flat();

        setStudents(allStudents);
        setSubjects(subjectRes.data.subjects || []);
      } catch (err) {
        console.error('Fetch error:', err);
        showAlert('error', 'Failed to load students or subjects');
      }
    };

    fetchData();
  }, [schoolName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedStudent = students.find(s => s.admission_number === form.student);
    if (!selectedStudent || !form.subject || !form.ca || !form.exam_mark) {
      showAlert('warning', 'Please fill all fields');
      return;
    }

    const examData = [{
      student_name: selectedStudent.full_name.trim(),
      admission_number: selectedStudent.admission_number.trim(),
      subject: form.subject.trim(),
      ca: parseInt(form.ca),
      exam_mark: parseInt(form.exam_mark),
      term: form.term.trim(),
      session: form.session.trim(),
    }];

    const payload = {
      schoolName,
      className: selectedStudent.class_name,
      examData,
      sessionName: form.session,
      termName: form.term
    };

    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/students/add-exam-score', payload);
      showAlert('success', 'Second term exam score added successfully');
      setForm({
        student: '',
        subject: '',
        ca: '',
        exam_mark: '',
        term: 'Second Term',
        session: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      showAlert('error', err.response?.data?.message || 'Failed to add exam score');
    } finally {
      setSaving(false);
    }
  };

  return (
        <Box sx={{ p: 0, backgroundColor: 'white', minHeight: '600vh', position: 'relative', maxWidth: 500, mx: 'auto' ,borderRadius: 2, boxShadow: 3}}>
             <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
  <ArrowBack />
</IconButton>
      <Typography variant="h5" sx={{ mb: 3 }} color="primary">
        Add Second Term Exam
      </Typography>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormControl fullWidth required>
          <InputLabel>Student</InputLabel>
          <Select name="student" value={form.student} label="Student" onChange={handleChange}>
            {students.map((s) => (
              <MenuItem key={s.admission_number} value={s.admission_number}>
                {s.full_name} - {s.class_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Subject</InputLabel>
          <Select name="subject" value={form.subject} label="Subject" onChange={handleChange}>
            {subjects.map((subj) => (
              <MenuItem key={subj.subject_id} value={subj.subject_name}>
                {subj.subject_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="CA"
          name="ca"
          type="number"
          value={form.ca}
          onChange={handleChange}
          inputProps={{ min: 0, max: 40 }}
          required
          fullWidth
        />

        <TextField
          label="Exam Mark"
          name="exam_mark"
          type="number"
          value={form.exam_mark}
          onChange={handleChange}
          inputProps={{ min: 0, max: 60 }}
          required
          fullWidth
        />

        <Box display="flex" justifyContent="space-between">
          <TextField label="Term" value={form.term} disabled sx={{ flex: 1, mr: 1 }} />
          <FormControl sx={{ flex: 1, ml: 1 }} required>
            <InputLabel>Session</InputLabel>
            <Select name="session" value={form.session} label="Session" onChange={handleChange}>
              {generateSessions().map(sess => (
                <MenuItem key={sess} value={sess}>{sess}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button type="submit" variant="contained" color="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Add Exam'}
        </Button>
      </form>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SecondTerm;
