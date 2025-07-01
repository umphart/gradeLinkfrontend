import React, { useEffect, useState } from 'react'; 
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import TeacherLayout from '../layout/TeacherLayout';
import { useAuth } from '../../contexts/AuthContext';

const TeachersClasses = () => {
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

useEffect(() => {
  const fetchAssignedClasses = async () => {
    const teacherId = user?.teacher_id || user?.teacherId || user?._id;
    if (!user?.schoolName || !teacherId) {
      console.log('Missing schoolName or teacherId');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching assigned classes for teacher:', teacherId, 'at school:', user.schoolName);
      const response = await fetch(
        `http://localhost:5000/api/subjects/assigned-classes?schoolName=${encodeURIComponent(user.schoolName)}&teacher_id=${encodeURIComponent(teacherId)}`
      );

      console.log('Response status:', response.status);

      const data = await response.json();

      console.log('Data received:', data);

      if (response.ok) {
        setAssignedClasses(data.classes || []);
      } else {
        console.error('Failed to fetch assigned classes:', data.message);
        setAssignedClasses([]);
      }
    } catch (error) {
      console.error('Error fetching assigned classes:', error);
      setAssignedClasses([]);
    } finally {
      setLoading(false);
    }
  };

  fetchAssignedClasses();
}, [user]);



  return (
    <TeacherLayout>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Assigned Classes
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : assignedClasses.length === 0 ? (
        <Typography>No classes assigned yet.</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Section</strong></TableCell>
                  <TableCell><strong>Assigned At</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedClasses.map((cls, index) => (
                  <TableRow key={index}>
                    <TableCell>{cls.class_name}</TableCell>
                    <TableCell>{cls.section}</TableCell>
                    <TableCell>{new Date(cls.assigned_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </TeacherLayout>
  );
};

export default TeachersClasses;
