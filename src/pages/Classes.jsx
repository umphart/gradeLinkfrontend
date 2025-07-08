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
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import { ArrowBack, FileDownload } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AllStudents = () => {
  const [studentsByClass, setStudentsByClass] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [classNames, setClassNames] = useState([]);
  const [school, setSchool] = useState({ name: '', logo: '' });
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: ''
  });
  const navigate = useNavigate();

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  useEffect(() => {
    const schoolData = JSON.parse(localStorage.getItem('school')) || {};
    setSchool({
      name: schoolData.name || 'GradeLink365  🎓',
      logo: schoolData.logo ? `http://localhost:5000/uploads/logos/${schoolData.logo}` : ''
    });
  }, []);

  useEffect(() => {
    if (!school.name) {
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/students/students?schoolName=${encodeURIComponent(school.name)}`);
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
  }, [school.name]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExportExcel = () => {
    const sortedClassNames = [...classNames].sort((a, b) => {
      const aStartsWithP = a.toLowerCase().startsWith('p');
      const bStartsWithP = b.toLowerCase().startsWith('p');
      if (aStartsWithP && !bStartsWithP) return -1;
      if (!aStartsWithP && bStartsWithP) return 1;
      return a.localeCompare(b);
    });
    
    const currentClassName = sortedClassNames[currentTab];
    const students = studentsByClass[currentClassName] || [];
    
    const exportData = students.map((student, index) => ({
      'S/N': index + 1,
      'Full Name': student.full_name,
      'Admission Number': student.admission_number,
      'Class': student.class_name,
      'Section': student.section,
      'Gender': student.gender,
      'Age': student.age || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `${school.name.replace(/\s+/g, '_')}_${currentClassName.replace(/\s+/g, '_')}_students.xlsx`);
  };

  const handleExportPDF = async () => {
    const sortedClassNames = [...classNames].sort((a, b) => {
      const aStartsWithP = a.toLowerCase().startsWith('p');
      const bStartsWithP = b.toLowerCase().startsWith('p');
      if (aStartsWithP && !bStartsWithP) return -1;
      if (!aStartsWithP && bStartsWithP) return 1;
      return a.localeCompare(b);
    });
    
    const currentClassName = sortedClassNames[currentTab];
    const students = studentsByClass[currentClassName] || [];
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.addFont('Times-Roman', 'Times', 'normal');
    doc.setFont('Times');

    if (school.logo) {
      try {
        const img = new Image();
        img.src = school.logo;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.1 }));

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

    const addHeader = () => {
      doc.setFontSize(16);
      doc.setFont('Times', 'bold');
      const title = `${school.name}`;
      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(title, (pageWidth - titleWidth) / 2, 20);

      doc.setFontSize(12);
      doc.setFont('Times', 'normal');
      const subtitle = `Class: ${currentClassName}- students`;
      const subtitleWidth = doc.getStringUnitWidth(subtitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 28);

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

    const headers = [
      'S/N',
      'Full Name',
      'Admission No',
      'Class',
      'Section',
      'Gender',
      'Age'
    ];

    const body = students.map((student, index) => [
      index + 1,
      student.full_name,
      student.admission_number,
      student.class_name,
      student.section,
      student.gender,
      student.age || 'N/A'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [headers],
      body: body,
      styles: {
        fontSize: 8,
        font: 'Times',
        cellPadding: 2,
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
      didDrawPage: function (data) {
        addHeader();
        doc.setFontSize(10);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, pageHeight - 10);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      }
    });

    doc.save(`${school.name.replace(/\s+/g, '_')}_${currentClassName.replace(/\s+/g, '_')}_students.pdf`);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading students...</Typography>
      </Box>
    );
  }

  if (!school.name) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">No school name found in localStorage.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="#1976d2" sx={{ fontSize: '1.25rem' }}>
          Students
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="success"
            onClick={handleExportExcel}
            startIcon={<FileDownload />}
            sx={{ mr: 2 }}
            disabled={loading || classNames.length === 0}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleExportPDF}
            startIcon={<FileDownload />}
            disabled={loading || classNames.length === 0}
          >
            PDF
          </Button>
        </Box>
      </Box>

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
              <div key={className} hidden={currentTab !== idx}>
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