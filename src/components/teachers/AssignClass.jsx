import React, { useEffect, useState} from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AssignClass = () => {
  const navigate = useNavigate();
  const schoolData = JSON.parse(localStorage.getItem('school'));
  const schoolName = schoolData?.name || '';

  const [teacher, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');

  const sections = ['Primary', 'Junior', 'Senior'];
  const classOptions = {
    Primary: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5'],
    Junior: ['JSS 1', 'JSS 2', 'JSS 3'],
    Senior: ['SS 1', 'SS 2', 'SS 3'],
  };

   useEffect(() => {
     const fetchData = async () => {
      
       try {
         const [teacherRes] = await Promise.all([
           axios.get(`http://localhost:5000/api/teachers?schoolName=${schoolName}`),
         ]);
         setTeachers(teacherRes.data);
         console.log("Fetching teachers for school:", teacherRes.data);
    
       } catch (err) {
         console.error(err);
       }
     };
     fetchData();
   }, [schoolName]);

 const handleAssignClass = async () => {
  if (!selectedTeacher || !selectedSection || !selectedClass) {
    setMsg('Please fill all fields.');
    setAlertSeverity('error');
    setAlertOpen(true);
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post('http://localhost:5000/api/teachers/assign-class', {
      teacher_id: selectedTeacher,
      className: selectedClass,
      section: selectedSection,
      schoolName,
    });

    setMsg('Class assigned successfully!');
    setAlertSeverity('success');
    setSelectedClass('');
    setSelectedSection('');
    setSelectedTeacher('');
  } catch (error) {
    console.error("Error assigning class:", error.response?.data || error.message);
    setMsg(error.response?.data?.message || 'Failed to assign class.');
    setAlertSeverity('error');
  } finally {
    setLoading(false);
    setAlertOpen(true);
  }
};
  const handleCloseAlert = () => setAlertOpen(false);

  return (
    <Box sx={{ p: 0 }}>
  <IconButton onClick={() => navigate(-1)} sx={{ mb: 0 }}>
  <ArrowBack />
</IconButton>
      <Typography variant="h4" sx={{ mb: 0 }}>Assign Class to Teacher</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Select Teacher"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          {teacher.map((s) => (
            <MenuItem key={s.teacher_id} value={s.teacher_id}>
              {s.teacher_name} ({s.teacher_id})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Section"
          value={selectedSection}
          onChange={(e) => {
            setSelectedSection(e.target.value);
            setSelectedClass('');
          }}
          sx={{ minWidth: 150 }}
        >
          {sections.map((section) => (
            <MenuItem key={section} value={section}>
              {section}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Class"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          disabled={!selectedSection}
          sx={{ minWidth: 150 }}
        >
          {(classOptions[selectedSection] || []).map((cls) => (
            <MenuItem key={cls} value={cls}>
              {cls}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={handleAssignClass}
          disabled={loading}
          sx={{ height: '56px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Assign'}
        </Button>
      </Box>

      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert severity={alertSeverity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignClass;
