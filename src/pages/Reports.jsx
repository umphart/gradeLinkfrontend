import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { Print as PrintIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { getClasses, getTerms } from '../services/schoolService';
import { getStudentsByClass } from '../services/studentService';

const Reports = () => {
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState({
    classes: true,
    terms: true,
    students: false
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesData, termsData] = await Promise.all([
          getClasses(),
          getTerms()
        ]);
        setClasses(classesData);
        setTerms(termsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(prev => ({ ...prev, classes: false, terms: false }));
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        try {
          setLoading(prev => ({ ...prev, students: true }));
          const studentsData = await getStudentsByClass(selectedClass);
          setStudents(studentsData);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(prev => ({ ...prev, students: false }));
        }
      };

      fetchStudents();
    } else {
      setStudents([]);
      setSelectedStudent('');
    }
  }, [selectedClass]);

  const handleGenerateReport = () => {
    // Logic to generate report
    console.log('Generating report for:', {
      class: selectedClass,
      term: selectedTerm,
      student: selectedStudent
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generate Student Report
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Classuu</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Class"
                disabled={loading.classes}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Term</InputLabel>
              <Select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                label="Term"
                disabled={loading.terms}
              >
                {terms.map((term) => (
                  <MenuItem key={term.id} value={term.id}>
                    {term.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Student</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                label="Student"
                disabled={loading.students || !selectedClass}
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {`${student.firstName} ${student.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleGenerateReport}
            disabled={!selectedClass || !selectedTerm || !selectedStudent}
          >
            Generate Report
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Reports
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              sx={{ mr: 2, mb: 2 }}
            >
              Class Performance
            </Button>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              sx={{ mr: 2, mb: 2 }}
            >
              Subject Analysis
            </Button>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              sx={{ mr: 2, mb: 2 }}
            >
              Attendance Summary
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Reports
            </Typography>
            <Typography color="textSecondary">
              No recent reports generated
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;