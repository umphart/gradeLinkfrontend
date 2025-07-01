import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, FormControl, InputLabel, Select,
  MenuItem, Snackbar, Alert, TextField, IconButton
} from '@mui/material';
import { PictureAsPdf as PdfIcon, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const generateSessions = () => {
  const currentYear = new Date().getFullYear();
  const sessions = [];
  for (let i = currentYear - 3; i <= currentYear + 2; i++) {
    sessions.push(`${i}/${i + 1}`);
  }
  return sessions;
};

const availableClasses = [
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SS 1', 'SS 2', 'SS 3'
];

const getOrdinalSuffix = (num) => {
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

const ViewSecondTerm = () => {
  const navigate = useNavigate();
  const [examRecords, setExamRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });
  const [currentStudent, setCurrentStudent] = useState(null);
  const [school, setSchool] = useState({ name: '', logo: '' });
  const printRef = useRef();

  const term = 'Second Term';

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school')) || {};
    setSchool({
      name: schoolData.name || 'MUHAMMAD BELLO COLLAGE',
      logo: schoolData.logo ? `http://localhost:5000/uploads/logos/${schoolData.logo}` : ''
    });
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!school.name || !selectedClass || !selectedSession) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/students/get-exam-records`, {
          params: {
            schoolName: school.name,
            className: selectedClass,
            sessionName: selectedSession,
            termName: term,
          },
        });

        setExamRecords(res.data.examRecords || []);
        if ((res.data.examRecords || []).length === 0) {
          setAlert({ open: true, severity: 'info', message: 'No exam records found' });
        }
      } catch (err) {
        console.error('Error fetching exam scores:', err);
        setAlert({ open: true, severity: 'error', message: 'Failed to fetch exam scores' });
      }
    };

    fetchRecords();
  }, [school.name, selectedClass, selectedSession]);

  // Process exam records
  const studentMap = {};
  const subjectSet = new Set();

  examRecords.forEach(record => {
    const key = record.admission_number;
    subjectSet.add(record.subject);

    if (!studentMap[key]) {
      studentMap[key] = {
        admission_number: record.admission_number,
        student_name: record.student_name,
        class_name: record.class_name,
        student_photo: record.student_photo, 
        scores: {},
        grades: {},
        remarks: {}
      };
    }

    const totalScore = record.ca + record.exam_mark;
    const { grade, remark } = getGradeAndRemark(totalScore);
    
    studentMap[key].scores[record.subject] = totalScore;
    studentMap[key].grades[record.subject] = grade;
    studentMap[key].remarks[record.subject] = remark;
  });

  const subjects = Array.from(subjectSet).sort();

  // Calculate totals and averages
  const students = Object.values(studentMap).map(student => {
    const scores = subjects.map(sub => student.scores[sub] || 0);
    const total = scores.reduce((sum, val) => sum + val, 0);
    const average = scores.length ? total / scores.length : 0;
    const { grade: overallGrade } = getGradeAndRemark(average);

    return {
      ...student,
      total,
      average: parseFloat(average.toFixed(2)),
      overallGrade
    };
  });

  // Sort and assign positions
  students.sort((a, b) => b.average - a.average);
  let position = 1;
  students.forEach((student, index) => {
    if (index > 0 && student.average === students[index - 1].average) {
      student.position = students[index - 1].position;
    } else {
      student.position = position;
    }
    position++;
  });

  // Filter students
  const filteredStudents = students.filter(
    student =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PDF handler
  const handleDownloadPDF = async (student) => {
    try {
      // Construct the full photo URL
      const photoUrl = student.student_photo 
        ? `http://localhost:5000${student.student_photo}`
        : null;

      // Preload the image
      if (photoUrl) {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => resolve();
          img.onerror = (e) => {
            console.error('Failed to load student photo', e);
            resolve();
          };
          img.src = photoUrl;
        });
      }

      setCurrentStudent({
        ...student,
        student_photo: photoUrl
      });

      await new Promise(resolve => setTimeout(resolve, 300));
      
      const input = printRef.current;
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: null
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${student.student_name}_${term}_Result.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setAlert({
        open: true,
        severity: 'error',
        message: `Failed to generate PDF: ${error.message}`
      });
    }
  };

  const PrintableResult = React.forwardRef(({ student, subjects, school, className, session, term }, ref) => (
    <div ref={ref} style={{ 
      padding: '10px', 
      fontFamily: 'Arial',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* School Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        position: 'relative',
        zIndex: 1
      }}>
        {school.logo && ( 
          <img 
            src={school.logo} 
            alt="School Logo" 
            style={{ 
              maxWidth: '100px', 
              maxHeight: '100px',
              borderRadius:'10px'
            }} 
          />
        )}
        <h2 style={{ margin: '5px 0', textTransform: 'uppercase' }}>{school.name}</h2>
        <h3 style={{ margin: '5px 0' }}>{term} Examination Result - {session}</h3>
      </div>

      {/* Student Info with Photo */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '0px', 
        padding: '5px', 
        border: '1px solid #ddd',
        position: 'relative',
        zIndex: 1,
        height: '70px',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <p style={{ margin: '2px 0' }}><strong>Name:</strong> {student.student_name}</p>
          <p style={{ margin: '2px 0' }}><strong>Admission No:</strong> {student.admission_number}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '2px 0' }}><strong>Class:</strong> {className}</p>
          <p style={{ margin: '2px 0' }}><strong>Position:</strong> {getOrdinalSuffix(student.position)}</p>
        </div>
        {student.student_photo && (
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '1px solid #ddd',
            borderRadius: '5px',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
            marginLeft: '10px'
          }}>
            <img 
              src={student.student_photo} 
              alt="Student" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
                e.target.parentNode.style.backgroundColor = '#f0f0f0';
              }}
            />
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        background: '#f5f5f5', 
        padding: '3px', 
        marginBottom: '0px',
        borderRadius: '5px',
        position: 'relative',
        zIndex: 1
      }}>
        <p style={{ margin: '5px 0' }}><strong>Total Marks:</strong> {student.total}</p>
        <p style={{ margin: '5px 0' }}><strong>Average:</strong> {student.average.toFixed(2)}</p>
        <p style={{ margin: '5px 0' }}><strong>Overall Grade:</strong> 
          <span style={{ 
            fontWeight: 'bold',
            marginLeft: '5px'
          }}>
            {student.overallGrade}
          </span>
        </p>
      </div>

      {/* Results Table */}
      <div style={{
        position: 'relative',
        marginBottom: '10px',
        zIndex: 0
      }}>
        {school.logo && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.2,
            zIndex: -1,
            width: '80%',
            textAlign: 'center',
            borderRadius: '100%'
          }}>
            <img 
              src={school.logo} 
              alt="School Logo" 
              style={{ 
                width: '100%',
                maxWidth: '400px',
                objectFit: 'contain',
                borderRadius: '100%'
              }} 
            />
          </div>
        )}

        <table border="1" cellPadding="8" style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          position: 'relative',
          zIndex: 1
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '5px', textAlign: 'center', width: '40px' }}>S.No</th>
              <th style={{ padding: '5px', textAlign: 'left' }}>Subject</th>
              <th style={{ padding: '5px', textAlign: 'center' }}>Score</th>
              <th style={{ padding: '5px', textAlign: 'center' }}>Grade</th>
              <th style={{ padding: '5px', textAlign: 'center' }}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => (
              <tr key={i}>
                <td style={{ 
                  padding: '4px', 
                  border: '1px solid #ddd',
                  textAlign: 'center'
                }}>{i + 1}</td>
                <td style={{ padding: '4px', border: '1px solid #ddd' }}>{subject}</td>
                <td style={{ padding: '4px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {student.scores[subject] || '-'}
                </td>
                <td style={{ 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {student.grades[subject] || '-'}
                </td>
                <td style={{ padding: '4px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {student.remarks[subject] || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', width: '45%' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>Class Teacher's Sign & Date:</p>
          <p style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '30px' }}>
            _________________________________
          </p>
        </div>
        <div style={{ textAlign: 'center', width: '45%' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>Principal's Sign & Date:</p>
          <p style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '30px' }}>
            _________________________________
          </p>
        </div>
      </div>
    </div>
  ));

  return (
    <Box sx={{ p: 2 }}>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {currentStudent && (
          <PrintableResult
            ref={printRef}
            student={currentStudent}
            subjects={subjects}
            school={school}
            className={selectedClass}
            session={selectedSession}
            term={term}
          />
        )}
      </div>

      <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
      <Typography variant="h5" gutterBottom>View Second Term Results</Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Class</InputLabel>
          <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            {availableClasses.map(cls => <MenuItem key={cls} value={cls}>{cls}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Session</InputLabel>
          <Select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
            {generateSessions().map(session => <MenuItem key={session} value={session}>{session}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          label="Search by Name or Admission No"
          variant="outlined"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Admission No</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Average</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.admission_number}>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>{student.admission_number}</TableCell>
                <TableCell>{student.total}</TableCell>
                <TableCell>{student.average.toFixed(2)}</TableCell>
                <TableCell>{student.overallGrade}</TableCell>
                <TableCell>{getOrdinalSuffix(student.position)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDownloadPDF(student)}>
                    <PdfIcon color="secondary"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewSecondTerm;