// TransferStudent.jsx (list page)

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
} from '@mui/material';
import { TransferWithinAStation } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const TransferStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      student.firstName.toLowerCase().includes(query) ||
      student.admissionNumber.toLowerCase().includes(query) ||
      student.className.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };
console.log('Filtered Students:', filteredStudents);
  const handleTransferClick = (admissionNumber) => {
    console.log('Transferring student with admission number:', admissionNumber);
    navigate(`/admin/transfer-student/${encodeURIComponent(admissionNumber)}`);
  };

  return (
    <Box sx={{ p: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
  <IconButton onClick={() => navigate(-1)} color="primary">
    <ArrowBack />
  </IconButton>
  <Typography variant="h5" sx={{ ml: 1 }}>Transfer Student</Typography>
</Box>


      <TextField
        label="Search by Name, Admission No., or Class"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Admission Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
    <TableCell>{student.full_name}</TableCell>
                       <TableCell>{student.admission_number}</TableCell>
                       <TableCell>{student.class_name}</TableCell>
                       <TableCell>{student.section || '-'}</TableCell>
                       <TableCell>{student.age}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleTransferClick(student.admission_number)}
                  >
                    <TransferWithinAStation />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransferStudent;
