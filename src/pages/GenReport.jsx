import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, FormControl, InputLabel, Select,
  MenuItem, Snackbar, Alert, TextField, IconButton, Button, CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

const availableTerms = ['First Term', 'Second Term', 'Third Term'];

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

const GenReport = () => {
  const navigate = useNavigate();
  const [examRecords, setExamRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('First Term');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ open: false, severity: 'info', message: '' });
  const [school, setSchool] = useState({ name: '', logo: '' });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school')) || {};
    setSchool({
      name: schoolData.name || 'GradeLink365  🎓',
      logo: schoolData.logo ? `http://localhost:5000/uploads/logos/${schoolData.logo}` : ''
    });
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!school.name || !selectedClass || !selectedSession || !selectedTerm) return;

      setLoading(true); // Start loading
      try {
        const res = await axios.get(`http://localhost:5000/api/students/get-exam-records`, {
          params: {
            schoolName: school.name,
            className: selectedClass,
            sessionName: selectedSession,
            termName: selectedTerm,
          },
        });

        setExamRecords(res.data.examRecords || []);
        
        // Extract unique subjects
        const subjectSet = new Set();
        res.data.examRecords?.forEach(record => {
          subjectSet.add(record.subject);
        });
        setSubjects(Array.from(subjectSet).sort());

        if ((res.data.examRecords || []).length === 0) {
          setAlert({ open: true, severity: 'info', message: 'No exam records found' });
        }
      } catch (err) {
        console.error('Error fetching exam scores:', err);
        setAlert({ open: true, severity: 'error', message: 'Failed to fetch exam scores' });
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };

    fetchRecords();
  }, [school.name, selectedClass, selectedSession, selectedTerm]);

  // Process exam records
  const studentMap = {};
  examRecords.forEach(record => {
    const key = record.admission_number;
    if (!studentMap[key]) {
      studentMap[key] = {
        admission_number: record.admission_number,
        student_name: record.student_name,
        class_name: record.class_name,
        student_photo: record.student_photo,
        grades: {},
        scores: {},
        remarks: {}
      };
    }

    const totalScore = record.ca + record.exam_mark;
    const { grade } = getGradeAndRemark(totalScore);
    
    studentMap[key].grades[record.subject] = grade;
    studentMap[key].scores[record.subject] = totalScore;
    studentMap[key].remarks[record.subject] = getGradeAndRemark(totalScore).remark;
  });

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

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredStudents.map(student => {
      const studentData = {
        'Admission Number': student.admission_number,
        'Student Name': student.student_name,
        'Class': student.class_name,
        'Total': student.total,
        'Average': student.average.toFixed(2),
        'Overall Grade': student.overallGrade,
        'Position': getOrdinalSuffix(student.position)
      };
      
      // Add subject grades
      subjects.forEach(subject => {
        studentData[subject] = student.grades[subject] || '-';
      });
      
      return studentData;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, `results_${selectedClass}_${selectedTerm}.xlsx`);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set Times New Roman font
    doc.addFont('Times-Roman', 'Times', 'normal');
    doc.setFont('Times');

    // Add watermark background with adjusted opacity
    if (school.logo) {
      try {
        const img = new Image();
        img.src = school.logo;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.1}));
        
        const imgWidth = pageWidth * 0.8;
        const imgHeight = (img.height * imgWidth) / img.width;
        const xPos = (pageWidth - imgWidth) / 2;
        const yPos = (pageHeight - imgHeight) / 2;
        
        doc.addImage(img, 'JPEG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
        doc.restoreGraphicsState();
      } catch (error) {
        console.error('Error loading logo for watermark:', error);
      }
    }

    // Function to add header to each page
    const addHeader = () => {
      // Add title (centered and bold)
      doc.setFontSize(16);
      doc.setFont('Times', 'bold');
      const title = `${school.name} - Results`;
      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(title, (pageWidth - titleWidth) / 2, 20);

      // Add subtitle (centered)
      doc.setFontSize(12);
      doc.setFont('Times', 'normal');
      const subtitle = `Class: ${selectedClass} - ${selectedTerm} ${selectedSession}`;
      const subtitleWidth = doc.getStringUnitWidth(subtitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 28);

      // Add small logo
      if (school.logo) {
        try {
          const img = new Image();
          img.src = school.logo;
          doc.addImage(img, 'JPEG', pageWidth - 25, 10, 15, 15, undefined, 'FAST');
        } catch (error) {
          console.error('Error loading logo for header:', error);
        }
      }
    };

    // Function to add footer to each page
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Signature line
        doc.setFontSize(10);
        doc.text('Exam Officer: ___________________________', 20, pageHeight - 30);
        doc.text('Date: ___________', pageWidth - 50, pageHeight - 30);
        
        // Page number
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    };

    // Prepare table data
    const headers = [
      'S/N',
      'Admission No',
      'Student Name',
      ...subjects,
      'Total',
      'Average',
      'Grade',
      'Position'
    ];

    const body = filteredStudents.map((student, index) => [
      index + 1,
      student.admission_number,
      student.student_name,
      ...subjects.map(subject => student.grades[subject] || '-'),
      student.total,
      student.average.toFixed(2),
      student.overallGrade,
      getOrdinalSuffix(student.position)
    ]);

    // Add table with page breaks
    autoTable(doc, {
      startY: 35,
      head: [headers],
      body: body,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        font: 'Times',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        font: 'Times'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' }
      },
      margin: { top: 40 },
      didDrawPage: function(data) {
        // Add header to each page
        addHeader();
      }
    });

    // Add footer to all pages
    addFooter();

    doc.save(`results_${selectedClass}_${selectedTerm}.pdf`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
      <Typography variant="h5" gutterBottom>View Results</Typography>

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

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Term</InputLabel>
          <Select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
            {availableTerms.map(term => <MenuItem key={term} value={term}>{term}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          label="Search by Name or Admission No"
          variant="outlined"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        
        <Button
          variant="contained"
          color="success"
          onClick={handleExportExcel}
          startIcon={<FileDownloadIcon />}
          disabled={loading || filteredStudents.length === 0}
        sx={{height: '50px'}}
        >
          Excel
        </Button>
        
        <Button
          variant="contained"
          color="error"
          onClick={handleExportPDF}
          startIcon={<FileDownloadIcon />}
          disabled={loading || filteredStudents.length === 0}
          sx={{height: '50px'}}
        >
          PDF
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading exam records...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S/N</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Admission No</TableCell>
                {subjects.map(subject => (
                  <TableCell key={subject} align="center">{subject}</TableCell>
                ))}
                <TableCell>Total</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student.admission_number}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.admission_number}</TableCell>
                  {subjects.map(subject => (
                    <TableCell key={subject} align="center">
                      {student.grades[subject] || '-'}
                    </TableCell>
                  ))}
                  <TableCell>{student.total}</TableCell>
                  <TableCell>{student.average.toFixed(2)}</TableCell>
                  <TableCell>{student.overallGrade}</TableCell>
                  <TableCell>{getOrdinalSuffix(student.position)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

export default GenReport;