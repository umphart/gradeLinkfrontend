import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  p: 2,
  borderRadius: 2,
  overflowY: 'auto',
};

const AllStudents = () => {
  const [studentsByClass, setStudentsByClass] = useState({});
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [examForm, setExamForm] = useState({
    subject: '',
    exam_mark: '',
    ca: ''
  });
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [classNames, setClassNames] = useState([]);

  // Snackbar Alert
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const schoolName = (() => {
    try {
      const schoolData = localStorage.getItem('school');
      if (schoolData) return JSON.parse(schoolData).name || '';
      const userData = localStorage.getItem('user');
      if (userData) return JSON.parse(userData).schoolName || '';
    } catch {
      return '';
    }
    return '';
  })();

  useEffect(() => {
    if (!schoolName) {
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/students?schoolName=${encodeURIComponent(schoolName)}`);
        const data = res.data.students;

        const grouped = {};
        Object.keys(data).forEach(section => {
          data[section].forEach(student => {
            const cls = student.class_name;
            if (!grouped[cls]) grouped[cls] = [];
            grouped[cls].push(student);
          });
        });

        setStudentsByClass(grouped);
        setClassNames(Object.keys(grouped).sort());
        if (Object.keys(grouped).length > 0) {
          setCurrentTab(0);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        showAlert('error', 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [schoolName]);

  const handleAddExam = async (student) => {
    setSelectedStudent(student);
    setExamForm({ subject: '', exam_mark: '', ca: '' });
    setExamResults([]);
    setModalOpen(true);

    try {
      const subjectRes = await axios.get(`http://localhost:5000/api/subjects/all?schoolName=${encodeURIComponent(schoolName)}`);
      setSubjects(subjectRes.data.subjects || []);

      const examRes = await axios.get(`http://localhost:5000/api/students/exams?schoolName=${encodeURIComponent(schoolName)}&className=${encodeURIComponent(student.class_name)}&admission_number=${encodeURIComponent(student.admission_number)}`);
      setExamResults(examRes.data.examResults || []);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      showAlert('error', 'Failed to fetch exam/subject data');
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setExamResults([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examForm.subject || !examForm.exam_mark || !examForm.ca) {
      showAlert('warning', 'Please fill all fields');
      return;
    }

    const examData = [{
      student_name: selectedStudent.full_name,
      admission_number: selectedStudent.admission_number,
      subject: examForm.subject,
      exam_mark: Number(examForm.exam_mark),
      ca: Number(examForm.ca),
    }];

    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/students/add-exam-score', {
        schoolName,
        className: selectedStudent.class_name,
        examData,
      });

      showAlert('success', 'Exam score added successfully');

      const res = await axios.get(`http://localhost:5000/api/students/exams?schoolName=${encodeURIComponent(schoolName)}&className=${encodeURIComponent(selectedStudent.class_name)}&admission_number=${encodeURIComponent(selectedStudent.admission_number)}`);
      setExamResults(res.data.examResults || []);
      setExamForm({ subject: '', exam_mark: '', ca: '' });
    } catch (err) {
      console.error('Error adding exam score:', err);
      showAlert('error', 'Failed to add exam score');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading students...</Typography>
      </Box>
    );
  }

  if (!schoolName) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">No school name found in localStorage.</Typography>
      </Box>
    );
  }


 return (
  <Box p={3}>
    <Typography  
      variant="h4"
      fontWeight="bold"
      color="#1976d2"
      sx={{ fontSize: '1.25rem', mb: 3 }}
    >
      Students
    </Typography>

    {classNames.length > 0 ? (
      <>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {classNames
            .slice()
            .sort((a, b) => {
              const aStartsWithP = a.toLowerCase().startsWith('p');
              const bStartsWithP = b.toLowerCase().startsWith('p');
              if (aStartsWithP && !bStartsWithP) return -1;
              if (!aStartsWithP && bStartsWithP) return 1;
              return a.localeCompare(b);
            })
            .map((className, idx) => (
              <Tab
                key={className}
                label={className.replace(/_/g, ' ').toUpperCase()}
                sx={{ textTransform: 'none' }}
                id={`class-tab-${idx}`}
                aria-controls={`class-tabpanel-${idx}`}
              />
            ))}
        </Tabs>

        {classNames
          .slice()
          .sort((a, b) => {
            const aStartsWithP = a.toLowerCase().startsWith('p');
            const bStartsWithP = b.toLowerCase().startsWith('p');
            if (aStartsWithP && !bStartsWithP) return -1;
            if (!aStartsWithP && bStartsWithP) return 1;
            return a.localeCompare(b);
          })
          .map((className, idx) => (
            <div
              role="tabpanel"
              hidden={currentTab !== idx}
              id={`class-tabpanel-${idx}`}
              aria-labelledby={`class-tab-${idx}`}
              key={className}
            >
              {currentTab === idx && (
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>SN</strong></TableCell>
                        <TableCell><strong>Full Name</strong></TableCell>
                        <TableCell><strong>Admission Number</strong></TableCell>
                        <TableCell><strong>Class</strong></TableCell>
                        <TableCell><strong>Section</strong></TableCell>
                        <TableCell><strong>Gender</strong></TableCell>
                        <TableCell><strong>Age</strong></TableCell>
                      
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentsByClass[className]?.map((student, index) => (
                        <TableRow key={student.admission_number}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{student.full_name}</TableCell>
                          <TableCell>{student.admission_number}</TableCell>
                          <TableCell>{student.class_name}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.age || 'N/A'}</TableCell>
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          ))}
      </>
    ) : (
      <Typography variant="h6" textAlign="center" mt={4}>
        No students found.
      </Typography>
    )}

      {/* Modal for Add Exam */}
      <Modal open={modalOpen} onClose={handleClose} aria-labelledby="add-exam-modal">
        <Box sx={{ ...style, display: 'flex', gap: 3 }}>
          {/* LEFT: Add exam form */}
          <Box flex={1} pr={2} component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" mb={1}>
              Add Exam Score
            </Typography>

            <FormControl fullWidth required>
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                name="subject"
                value={examForm.subject}
                onChange={handleInputChange}
                label="Subject"
              >
                {subjects.map((subj) => (
                  <MenuItem key={subj.subject_id} value={subj.subject_name}>
                    {subj.subject_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Exam Mark"
              name="exam_mark"
              type="number"
              value={examForm.exam_mark}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <TextField
              label="CA"
              name="ca"
              type="number"
              value={examForm.ca}
              onChange={handleInputChange}
              required
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <Box>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Add Exam Score'}
              </Button>
              <Button onClick={handleClose} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>

          {/* RIGHT: Existing exam results */}
          <Box flex={1} overflow="auto" maxHeight="70vh" pl={2} borderLeft="1px solid #ccc">
            <Typography variant="h6" mb={2}>
              Exam Results for {selectedStudent?.full_name || ''}
            </Typography>

            {examResults.length === 0 ? (
              <Typography>No exam results found.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Exam</strong></TableCell>
                    <TableCell><strong>CA</strong></TableCell>
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell><strong>Remark</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examResults.map((exam, index) => (
                    <TableRow key={index}>
                      <TableCell>{exam.subject}</TableCell>
                      <TableCell>{exam.exam_mark}</TableCell>
                      <TableCell>{exam.ca}</TableCell>
                      <TableCell>{exam.total}</TableCell>
                      <TableCell>{exam.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllStudents;