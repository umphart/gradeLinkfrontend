import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Modal,
  CircularProgress,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon, Print as PrintIcon } from '@mui/icons-material';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const normalizeClassName = (className) => {
  if (!className) return '';
  if (className.match(/^(jss|ss)\d$/i)) {
    return className
      .replace(/([a-z]+)(\d)/i, '$1 $2')
      .toUpperCase();
  }
  return className
    .replace(/([a-z])(\d)/i, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const getOrdinalSuffix = (num) => {
  if (!num) return 'N/A';
  const j = num % 10, k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
};

const getGradeAndRemark = (score) => {
  if (score >= 75) return { grade: 'A', remark: 'Excellent' };
  if (score >= 65) return { grade: 'B', remark: 'Very Good' };
  if (score >= 55) return { grade: 'C', remark: 'Good' };
  if (score >= 45) return { grade: 'D', remark: 'Credit' };
  if (score >= 40) return { grade: 'E', remark: 'Pass' };
  return { grade: 'F', remark: 'Fail' };
};

const Exams = () => {
  const [studentsWithExams, setStudentsWithExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [examLoading, setExamLoading] = useState(false);
  const [schoolLogo, setSchoolLogo] = useState('');
  const [examSummary, setExamSummary] = useState({ position: '', average: '', totalMark: '', grade: '' });
  const printRef = useRef();

  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');
  const [availableSessions, setAvailableSessions] = useState(['2023/2024', '2024/2025', '2025/2026']);

  const schoolName = useMemo(() => {
    try {
      const schoolData = JSON.parse(localStorage.getItem('school'));
      const userData = JSON.parse(localStorage.getItem('user'));
      if (schoolData?.name) {
        setSchoolLogo(schoolData.logo || '');
        return schoolData.name;
      } else if (userData?.schoolName) {
        setSchoolLogo(userData.logo || '');
        return userData.schoolName;
      }
      return '';
    } catch (error) {
      console.error('Error parsing school data:', error);
      return '';
    }
  }, []);


  useEffect(() => {
    const fetchStudentsWithExams = async () => {
      if (!schoolName) {
        setLoading(false);
        setError('School name not found');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/all-exam-records?schoolName=${encodeURIComponent(schoolName)}`
        );

        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Failed to fetch exam records');
        }

        const uniqueStudentsMap = {};
        const allExamRecords = response.data.data.flatMap(classData =>
          classData.records.map(record => ({
            ...record,
            class_name: classData.className,
            search_name: record.student_name?.toLowerCase() || ''
          }))
        );

        allExamRecords.forEach(examRecord => {
          const studentKey = examRecord.admission_number;
          if (!uniqueStudentsMap[studentKey]) {
            uniqueStudentsMap[studentKey] = {
              admission_number: examRecord.admission_number,
              full_name: examRecord.student_name,
              class_name: examRecord.class_name,
              section: examRecord.section || 'N/A',
              gender: examRecord.gender || 'N/A',
              age: examRecord.age || 'N/A',
              search_name: examRecord.search_name
            };
          }
        });

        setStudentsWithExams(Object.values(uniqueStudentsMap));
      } catch (err) {
        console.error('Error fetching students with exams:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load student exam data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsWithExams();
  }, [schoolName]);

  const fetchExamResults = async (student) => {
    if (!student || !selectedTerm || !selectedSession) {
      setError('Please select both term and session');
      return;
    }

    const normalizedClassName = normalizeClassName(student.class_name);

    setExamLoading(true);
    setError(null);

    try {
      const params = {
        schoolName: schoolName,
        className: normalizedClassName,
        admissionNumber: student.admission_number,
        termName: selectedTerm,
        sessionName: selectedSession
      };

      const res = await axios.get(
        `http://localhost:5000/api/students/get-exam-records`,
        { params }
      );

      const examRecords = res.data.examRecords || res.data.data?.examRecords || [];
      
      const processedExamData = examRecords.map(exam => {
        const examMark = Number(exam.exam_mark) || 0;
        const ca = Number(exam.ca) || 0;
        const total = examMark + ca;
        const { grade, remark } = getGradeAndRemark(total);
        return { 
          ...exam, 
          exam_mark: examMark,
          ca: ca,
          total: total,
          grade: grade,
          remark: remark 
        };
      });

      if (processedExamData.length > 0) {
        const totalMark = processedExamData.reduce((sum, exam) => sum + exam.total, 0);
        const average = totalMark / processedExamData.length;
        const { grade: overallGrade } = getGradeAndRemark(average);

        setExamSummary({
          position: res.data.position || '',
          average: average.toFixed(2),
          totalMark: totalMark.toFixed(2),
          grade: overallGrade
        });
      }

      setExamResults(processedExamData);
    } catch (err) {
      console.error('Error fetching exam results:', {
        error: err,
        response: err.response?.data
      });
      setError(err.response?.data?.message || 
        `Failed to fetch results. Please ensure records exist for ${student.full_name} in ${normalizedClassName} for ${selectedTerm} ${selectedSession}.`);
    } finally {
      setExamLoading(false);
    }
  };
const [printReady, setPrintReady] = useState(false);

const handlePrint = useReactToPrint({
  content: () => printRef.current,
  documentTitle: `${selectedStudent?.full_name || 'Student'}-Result`,
  onBeforeGetContent: () => {
    setPrintReady(false);
    return new Promise((resolve) => {
      setTimeout(() => {
        setPrintReady(true);
        resolve();
      }, 300);
    });
  },
  onAfterPrint: () => setPrintReady(false)
});

  const handleOpenModal = async (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
    await fetchExamResults(student);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setExamResults([]);
    setError(null);
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return studentsWithExams;
    const term = searchTerm.toLowerCase();
    return studentsWithExams.filter(student =>
      student.search_name.includes(term) ||
      student.admission_number.toLowerCase().includes(term)
    );
  }, [studentsWithExams, searchTerm]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading students with exam records...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h6" mb={1} sx={{ fontWeight: 'bold' }}>
        Students with Exam Records 
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="term-label">Select Term</InputLabel>
              <Select
                labelId="term-label"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                label="Select Term"
              >
                <MenuItem value="First Term">First Term</MenuItem>
                <MenuItem value="Second Term">Second Term</MenuItem>
                <MenuItem value="Third Term">Third Term</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id="session-label">Select Session</InputLabel>
              <Select
                labelId="session-label"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                label="Select Session"
              >
                {availableSessions.map(session => (
                  <MenuItem key={session} value={session}>{session}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by student name or admission number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Admission Number</TableCell>
              <TableCell>Class</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {studentsWithExams.length === 0
                    ? 'No students with exam records found'
                    : 'No students match your search'}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map(student => (
                <TableRow key={student.admission_number} hover>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.admission_number}</TableCell>
                  <TableCell>{student.class_name}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenModal(student)}
                      disabled={examLoading}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
      
        <Box
          ref={printRef}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500, md: 600 },
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 3 },
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            {schoolLogo && (
              <Box
                component="img"
                src={`http://localhost:5000/uploads/logos/${schoolLogo}`}
                alt="School Logo"
                sx={{ width: 50, height: 50, borderRadius: 1, border: '1px solid #ccc' }}
              />
            )}
            <Typography variant="h6" fontWeight="bold" textAlign="center" fontSize={{ xs: '1rem', sm: '1.1rem' }}>
              {schoolName}
            </Typography>
            <Typography variant="subtitle1" textAlign="center" fontSize={{ xs: '0.85rem', sm: '1rem' }}>
              {selectedTerm} - {selectedSession}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" textAlign="center" fontSize="0.85rem">
              Student: {selectedStudent?.full_name} | Admission No: {selectedStudent?.admission_number}
            </Typography>
            <Typography variant="body2" textAlign="center" fontSize="0.85rem">
              Class: {selectedStudent?.class_name}
            </Typography>

            {examResults.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={2} mt={1} justifyContent="center">
                <Typography variant="body2" fontSize="0.85rem">
                  Position: <strong>{getOrdinalSuffix(examSummary.position)}</strong>
                </Typography>
                <Typography variant="body2" fontSize="0.85rem">
                  Average: <strong>{examSummary.average}</strong>
                </Typography>
                <Typography variant="body2" fontSize="0.85rem">
                  Total Mark: <strong>{examSummary.totalMark}</strong>
                </Typography>
                <Typography variant="body2" fontSize="0.85rem">
                  Grade: <strong>{examSummary.grade}</strong>
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ position: 'relative', mt: 2 }}>
            {schoolLogo && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.07,
                  zIndex: 0,
                  pointerEvents: 'none',
                  width: '60%',
                  maxWidth: 250,
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/logos/${schoolLogo}`}
                  alt="Watermark"
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
            )}

            <TableContainer component={Paper} sx={{ position: 'relative', zIndex: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>S/N</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>Subject</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>Exam Mark</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>CA</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>Grade</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem' }}>Remark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examResults.map((exam, idx) => (
                    <TableRow key={`${exam.subject}-${idx}`}>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{idx + 1}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{exam.subject}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{exam.exam_mark}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{exam.ca}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{exam.total}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{exam.grade}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.8rem' }}>{exam.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ minWidth: 100, fontSize: '0.8rem' }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrint}
              disabled={!modalOpen || examLoading}
              sx={{ minWidth: 100, fontSize: '0.8rem' }}
            >
              Print
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Exams;