import React, { useEffect, useState } from 'react';
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

const TransferStudent = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const navigate = useNavigate();

  // Fetch students (replace with actual API endpoint)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://api.example.com/students'); // <-- Replace with actual API
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by name, admission number, or class
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

  // Navigate to transfer student form with selected ID
  const handleTransferClick = (studentId) => {
    navigate(`/admin/transfer-student/${studentId}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Transfer Student
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Search and select a student to transfer to another class or school.
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Name, Admission No., or Class"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Student Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Admission Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.admissionNumber}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleTransferClick(student.id)}
                  >
                    <TransferWithinAStation />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransferStudent;
