import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, TextField, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import { PauseCircleFilled } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const FreezeStudent = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToFreeze, setStudentToFreeze] = useState(null);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    const schoolName = schoolData.name || '';

    if (!schoolName) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/students/students', {
          params: { schoolName }
        });
        if (response.data.success) {
          const { junior = [], primary = [], senior = [] } = response.data.students;
          const activeStudents = [...junior, ...primary, ...senior].filter(s => s.status !== 'graduated');
          setStudents(activeStudents);
          setFilteredStudents(activeStudents);

          const allClasses = [...new Set(activeStudents.map(s => s.class_name))];
          setClassList(allClasses);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter((student) =>
      (student.full_name && student.full_name.toLowerCase().includes(query)) ||
      (student.admission_number && student.admission_number.toLowerCase().includes(query)) ||
      (student.class_name && student.class_name.toLowerCase().includes(query))
    );

    setFilteredStudents(filtered);
  };

  const handleFreezeClick = (student) => {
    setStudentToFreeze(student);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setStudentToFreeze(null);
  };

  const handleConfirmFreeze = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/freeze/${studentToFreeze.id}`);
      const updatedStudents = students.filter(s => s.id !== studentToFreeze.id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setConfirmOpen(false);
      setStudentToFreeze(null);
    } catch (error) {
      console.error('Failed to freeze student:', error);
    }
  };

  const handleFreezeClass = async (className) => {
    const studentsInClass = students.filter(s => s.class_name === className);

    try {
      for (const student of studentsInClass) {
        await axios.put(`http://localhost:5000/api/students/freeze/${student.id}`);
      }

      const updatedStudents = students.filter(s => s.class_name !== className);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setSelectedClass('');
      alert(`All students in ${className} have been marked as graduated.`);
    } catch (error) {
      console.error('Failed to freeze class students:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <IconButton onClick={() => navigate(-1)} color="primary">
    <ArrowBack />
  </IconButton>
  <Typography variant="h5" sx={{ ml: 1 }}>Freeze (Graduated) Student</Typography>
</Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          select
          label="Select Class to Freeze"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          SelectProps={{ native: true }}
          fullWidth
        >
          <option value=""></option>
          {classList.map((cls, idx) => (
            <option key={idx} value={cls}>{cls}</option>
          ))}
        </TextField>

<Button 
  variant="contained"
  color="error"
  disabled={!selectedClass}
  onClick={() => handleFreezeClass(selectedClass)}
  sx={{ width: 200 }} // Set width in pixels
>
  Freeze Class
</Button>

      </Box>

      <TextField
        label="Search by Name, Admission No., or Class"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography>Loading students...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
<TableBody>
  {filteredStudents.length > 0 ? (
    filteredStudents.map((student) => (
      <TableRow key={student.id}>
        <TableCell>{student.full_name}</TableCell>
        <TableCell>{student.admission_number}</TableCell>
        <TableCell>{student.class_name}</TableCell>
        <TableCell>{student.section || '-'}</TableCell>
        <TableCell>
          {student.status === 'graduated' ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>🔴 Graduated</span>
          ) : (
            <span style={{ color: 'green', fontWeight: 'bold' }}>🟢 Active</span>
          )}
        </TableCell>
        <TableCell>
          {student.status !== 'graduated' && (
            <IconButton
              color="primary"
              onClick={() => handleFreezeClick(student)}
              aria-label="freeze student"
            >
              <PauseCircleFilled />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">No students found.</TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
      )}

      {/* Confirm Freeze Dialog */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Graduation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark <strong>{studentToFreeze?.full_name}</strong> as graduated? They will lose access to the system but their record will remain.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={handleConfirmFreeze}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FreezeStudent;


