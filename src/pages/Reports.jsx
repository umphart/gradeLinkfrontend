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
  Alert,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

const Reports = () => {
  const [studentsByClass, setStudentsByClass] = useState({});
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [examForm, setExamForm] = useState({
    subject: '',
    exam_mark: '',
    ca: '',
    term: '',
    session: ''
  });
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [classNames, setClassNames] = useState([]);
  const [availableSessions, setAvailableSessions] = useState(['2023/2024', '2024/2025', '2025/2026']);
  const [examLoading, setExamLoading] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [recentExams, setRecentExams] = useState([]); // New state for recently added/updated exams

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
        const res = await axios.get(`https://gradelink.onrender.com/api/students?schoolName=${encodeURIComponent(schoolName)}`);
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

  const fetchExamRecords = async (term, session) => {
    if (!selectedStudent) return;
    
    setExamLoading(true);
    try {
      const res = await axios.get(
        `https://gradelink.onrender.com/api/students/get-exam-records?schoolName=${encodeURIComponent(schoolName)}&className=${encodeURIComponent(selectedStudent.class_name)}&admissionNumber=${encodeURIComponent(selectedStudent.admission_number)}&sessionName=${encodeURIComponent(session)}&termName=${encodeURIComponent(term)}`
      );
      setExamResults(res.data.examRecords || []);
    } catch (err) {
      console.error('Error fetching exam records:', err);
      showAlert('error', 'Failed to fetch exam records');
    } finally {
      setExamLoading(false);
    }
  };

  const handleAddExam = async (student) => {
    setSelectedStudent(student);
    setExamForm(prev => ({ ...prev, subject: '', exam_mark: '', ca: '' }));
    setExamResults([]);
    setEditingExam(null);
    setRecentExams([]); // Clear recent exams when opening modal for new student
    setModalOpen(true);

    try {
      const [subjectRes] = await Promise.all([
        axios.get(`https://gradelink.onrender.com//subjects/all?schoolName=${encodeURIComponent(schoolName)}`),
        fetchExamRecords(examForm.term, examForm.session)
      ]);
      setSubjects(subjectRes.data.subjects || []);
    } catch (err) {
      console.error('Error fetching exam data:', err);
      showAlert('error', 'Failed to fetch exam/subject data');
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setExamResults([]);
    setEditingExam(null);
    setRecentExams([]); // Clear recent exams when closing modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamForm(prev => ({ ...prev, [name]: value }));
    
    if ((name === 'term' || name === 'session') && selectedStudent) {
      const newTerm = name === 'term' ? value : examForm.term;
      const newSession = name === 'session' ? value : examForm.session;
      fetchExamRecords(newTerm, newSession);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!examForm.subject || !examForm.exam_mark || !examForm.ca || !examForm.term || !examForm.session) {
      showAlert('warning', 'Please fill all fields');
      return;
    }

    const examData = {
      student_name: selectedStudent.full_name,
      admission_number: selectedStudent.admission_number,
      subject: examForm.subject,
      exam_mark: Number(examForm.exam_mark),
      ca: Number(examForm.ca),
      total: Number(examForm.exam_mark) + Number(examForm.ca),
      term: examForm.term,
      session: examForm.session,
      date: new Date().toLocaleString()
    };

    setSaving(true);
    try {
      if (editingExam) {
        // Update existing exam record
        await axios.put('https://gradelink.onrender.com/api/students/update-exam-score', {
          schoolName,
          className: selectedStudent.class_name,
          admissionNumber: selectedStudent.admission_number,
          subject: examForm.subject,
          exam_mark: Number(examForm.exam_mark),
          ca: Number(examForm.ca),
          sessionName: examForm.session,
          termName: examForm.term,
          examId: editingExam._id
        });
        showAlert('success', 'Exam score updated successfully');
        
        // Add to recent exams list
        setRecentExams(prev => [
          { ...examData, action: 'updated', id: editingExam._id },
          ...prev
        ]);
      } else {
        // Add new exam record
        const res = await axios.post('https://gradelink.onrender.com/api/students/add-exam-score', {
          schoolName,
          className: selectedStudent.class_name,
          examData: [examData],
          sessionName: examForm.session,
          termName: examForm.term
        });
        showAlert('success', 'Exam score added successfully');
        
        // Add to recent exams list with the returned ID
        const newExamId = res.data.examRecords?.[0]?._id;
        setRecentExams(prev => [
          { ...examData, action: 'added', id: newExamId },
          ...prev
        ]);
      }
      
      await fetchExamRecords(examForm.term, examForm.session);
      setExamForm(prev => ({ ...prev, subject: '', exam_mark: '', ca: '' }));
      setEditingExam(null);
    } catch (err) {
      console.error('Error adding/updating exam score:', err);
      showAlert('error', 'Failed to save exam score');
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteExam = (examToDelete) => {
  // You can confirm before deleting
  const confirmed = window.confirm(`Are you sure you want to delete ${examToDelete.subject}?`);
  if (!confirmed) return;

  setExamResults(prev => prev.filter(exam => 
    !(exam.subject === examToDelete.subject && exam.exam_mark === examToDelete.exam_mark)
  ));

  // Optional: Call API to delete from backend
  // axios.delete(`/api/delete-exam`, { data: { ...examToDelete } });
};


  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setExamForm({
      subject: exam.subject,
      exam_mark: exam.exam_mark,
      ca: exam.ca,
      term: examForm.term,
      session: examForm.session
    });
  };

  const handleCancelEdit = () => {
    setEditingExam(null);
    setExamForm(prev => ({ ...prev, subject: '', exam_mark: '', ca: '' }));
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
    <Box p={0}>
      <Typography  
        variant="h4"
        fontWeight="bold"
        color="#1976d2"
        sx={{ fontSize: '1.25rem', mb: 0 }}
      >
        Add Exam to Students
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
                          <TableCell align="center"><strong>Actions</strong></TableCell>
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
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => handleAddExam(student)}
                              >
                                Add Exam
                              </Button>
                            </TableCell>
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
  <Box sx={{ 
    ...style, 
    display: 'flex', 
    gap: 0,
    width: 'auto', // Remove fixed width if present
    maxWidth: '120vw' // Set maximum width to viewport width
  }}>
    {/* LEFT: Add exam form */}
    <Box
      flex={1}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        pr: 2,
        minWidth: 350 // Set minimum width for form
      }}
      component="form"
      onSubmit={handleSubmit}
    >
            <Typography variant="h6" mb={1}>
              {editingExam ? 'Edit Exam Score' : 'Add Exam Score'} for {selectedStudent?.full_name || ''}
            </Typography>

            {/* Term and Session in same row */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth required sx={{ minWidth: 150 }}>
                  <InputLabel id="term-label">Select Term</InputLabel>
                  <Select
                    labelId="term-label"
                    name="term"
                    value={examForm.term}
                    onChange={handleInputChange}
                    label="Term"
                  >
                    <MenuItem value="First Term">First Term</MenuItem>
                    <MenuItem value="Second Term">Second Term</MenuItem>
                    <MenuItem value="Third Term">Third Term</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth required sx={{ minWidth: 150 }}>
                  <InputLabel id="session-label">Session</InputLabel>
                  <Select
                    labelId="session-label"
                    name="session"
                    value={examForm.session}
                    onChange={handleInputChange}
                    label="Session"
                  >
                    {availableSessions.map(session => (
                      <MenuItem key={session} value={session}>{session}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ width: 315 }}> 
              <FormControl fullWidth required sx={{ minWidth: 200 }}>
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
            </Box>
            
            <Box sx={{ width: 315 }}> 
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
            </Box>
            
            <Box sx={{ width: 315 }}> 
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
            </Box>

            <Box>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? 'Saving...' : (editingExam ? 'Update Exam' : 'Add Exam')}
              </Button>
              {editingExam && (
                <Button onClick={handleCancelEdit} sx={{ ml: 2 }}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleClose} sx={{ ml: 2 }}>
                Done
              </Button>
            </Box>

            {/* Recently Added/Updated Exams List */}
            {recentExams.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Recent Changes
                </Typography>
                <List dense sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto',
                  border: '1px solid #eee',
                  borderRadius: 1,
                  p: 0
                }}>
                  {recentExams.map((exam, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <CheckCircleIcon 
                          color="success" 
                          sx={{ mr: 1, fontSize: '1rem' }} 
                        />
                        <ListItemText
                          primary={`${exam.subject} (Exam: ${exam.exam_mark}, CA: ${exam.ca})`}
                          secondary={`${exam.action === 'added' ? 'Added' : 'Updated'} at ${exam.date}`}
                        />
                      </ListItem>
                      {index < recentExams.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </Box>

       {/* RIGHT: Existing exam results */}
    <Box 
      flex={1} 
      sx={{
        overflow: 'auto',
        maxHeight: '70vh',
        pl: 2,
        borderLeft: '1px solid #ccc',
        minWidth: 450 // Set minimum width for table
      }}
    >
      <Typography variant="h6" mb={1}>
        Exam Results {" "} {examForm.term} - {examForm.session}
      </Typography>
      {examLoading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress size={24} />
          <Typography>Loading exam results...</Typography>
        </Box>
      ) : examResults.length === 0 ? (
        <Typography>No exam results found for selected term and session.</Typography>
      ) : (
        <Table size="small" sx={{ '& .MuiTableCell-root': { padding: '6px' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}><strong>S.No</strong></TableCell>
              <TableCell sx={{ width: '30%' }}><strong>Subject</strong></TableCell>
              <TableCell sx={{ width: '15%' }}><strong>Exam</strong></TableCell>
              <TableCell sx={{ width: '15%' }}><strong>CA</strong></TableCell>
              <TableCell sx={{ width: '15%' }}><strong>Total</strong></TableCell>
              <TableCell sx={{ width: '20%' }}><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examResults.map((exam, index) => (
              <TableRow key={index} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {exam.subject}
                </TableCell>
                <TableCell>{exam.exam_mark}</TableCell>
                <TableCell>{exam.ca}</TableCell>
                <TableCell>{exam.total}</TableCell>
               <TableCell>
  <IconButton 
    size="small" 
    onClick={() => handleEditExam(exam)}
    color="primary"
    
  >
    <EditIcon fontSize="small" />
  </IconButton>
  <IconButton 
    size="small" 
    onClick={() => handleDeleteExam(exam)}
    color="error"
  
  >
    <DeleteIcon fontSize="small" />
  </IconButton>
</TableCell>

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

export default Reports;