import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const WithdrawStudent = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    const schoolName = schoolData.name || '';

    if (!schoolName) {
      console.warn('No school name found in localStorage.');
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/students/students', {
          params: { schoolName }
        });
        const data = response.data;

        if (data.success) {
          const { junior = [], primary = [], senior = [] } = data.students;
          const allStudents = [...junior, ...primary, ...senior];
          setStudents(allStudents);
          setFilteredStudents(allStudents);
        } else {
          console.error('Error fetching students:', data.message);
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

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${studentToDelete.id}`);
      const updatedStudents = students.filter(s => s.id !== studentToDelete.id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setConfirmOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <IconButton onClick={() => navigate(-1)} color="primary">
    <ArrowBack />
  </IconButton>
  <Typography variant="h5" sx={{ ml: 1 }}>Withdraw Student</Typography>
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
                <TableCell>Age</TableCell>
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
                    <TableCell>{student.age}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(student)}
                        aria-label="withdraw student"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Withdraw</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw student{' '}
            <strong>{studentToDelete?.full_name}</strong> from the system? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WithdrawStudent;
