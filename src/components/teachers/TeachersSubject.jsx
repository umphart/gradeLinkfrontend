import React, { useEffect, useState } from 'react';
import TeacherLayout from '../layout/TeacherLayout';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (!user?.schoolName || !(user?._id || user?.id)) {
          console.log('Missing schoolName or teacherId');
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/subjects/assigned?schoolName=${user.schoolName}&teacher_id=${user.teacherId}`
        );

        const data = await response.json();

        if (response.ok) {
          setSubjects(data.subjects || []);
        } else {
          console.error('Failed to fetch subjects:', data.message);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  return (
    <TeacherLayout>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Assigned Subjects
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : subjects.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No subjects assigned yet.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell><strong>Subject Code</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Term</strong></TableCell>
                  <TableCell><strong>Session</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell>{subject.subject_name}</TableCell>
                    <TableCell>{subject.subject_code}</TableCell>
                    <TableCell>{subject.classname}</TableCell>
                    <TableCell>{subject.term}</TableCell>
                    <TableCell>{subject.session}</TableCell>
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

export default TeacherSubjects;
