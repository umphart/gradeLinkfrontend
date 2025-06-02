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
  Paper
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UpdateStudent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school') || '{}');
    const schoolName = schoolData.name || '';

    console.log('School Name:', schoolName);

    // Fetch students if schoolName exists in localStorage
    const fetchStudents = async () => {
      try {
        if (!schoolName) {
          console.warn('No school name found in localStorage.');
          return;
        }

        const response = await fetch(`/students?schoolName=${encodeURIComponent(schoolName)}`);
        const data = await response.json();

        if (data.success) {
          setStudents(data.students); // Set the students in the state
          setFilteredStudents(data.students); // Initialize filtered students as all students
        } else {
          console.error('Error fetching students:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    if (schoolName) {
      fetchStudents();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter students based on the search query
    const filtered = students.filter((student) =>
      (student.full_name && student.full_name.toLowerCase().includes(query)) ||
      (student.admission_number && student.admission_number.toLowerCase().includes(query)) ||
      (student.class_name && student.class_name.toLowerCase().includes(query))
    );

    setFilteredStudents(filtered);
  };

  // Handle update click (navigate to the update student page)
  const handleUpdateClick = (studentId) => {
    navigate(`/admin/update-student/${studentId}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Update Student</Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Search and select a student to update their record.
      </Typography>

      {/* Search input field */}
      <TextField
        label="Search by Name, Admission No., or Class"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Student table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Admission Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render filtered students */}
            {filteredStudents.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.admission_number}</TableCell>
                <TableCell>{student.class_name}</TableCell>
                <TableCell>{student.section || '-'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleUpdateClick(student.id)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* No students found message */}
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

export default UpdateStudent;
