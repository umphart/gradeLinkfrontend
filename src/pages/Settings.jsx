import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { getSchoolDetails, updateSchool } from '../services/schoolService';
import { uploadStudentsFromExcel, uploadTeachersFromExcel, uploadExamsFromExcel, uploadSubjectsFromExcel } from '../services/importService';
import PrintIcon from '@mui/icons-material/Print';

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // School profile form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Import states
  const [studentFile, setStudentFile] = useState(null);
  const [examFile, setExamFile] = useState(null);
  const [teacherFile, setTeacherFile] = useState(null);
  const [subjectFile, setSubjectFile] = useState(null);
  const [importingStudents, setImportingStudents] = useState(false);
  const [importingExams, setImportingExams] = useState(false);
  const [importingTeachers, setImportingTeachers] = useState(false);
  const [importingSubjects, setImportingSubjects] = useState(false);
  const [studentImportResult, setStudentImportResult] = useState(null);
  const [examImportResult, setExamImportResult] = useState(null);
  const [teacherImportResult, setTeacherImportResult] = useState(null);
  const [subjectImportResult, setSubjectImportResult] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        if (!user?.schoolId) {
          console.warn('No schoolId found in user object');
          setLoading(false);
          return;
        }

        const data = await getSchoolDetails(user.schoolId);
        setSchool(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (error) {
        console.error('Error fetching school data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [user]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSchool(user.schoolId, formData);
      setStudentImportResult({
        success: true,
        message: 'School profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating school:', error);
      setStudentImportResult({
        success: false,
        message: 'Failed to update school profile'
      });
    }
  };

  const handleFileChange = (type, file) => {
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (validTypes.includes(file.type)) {
      switch (type) {
        case 'students':
          setStudentFile(file);
          setStudentImportResult(null);
          break;
        case 'exams':
          setExamFile(file);
          setExamImportResult(null);
          break;
        case 'teachers':
          setTeacherFile(file);
          setTeacherImportResult(null);
          break;
        case 'subjects':
          setSubjectFile(file);
          setSubjectImportResult(null);
          break;
        default:
          break;
      }
    } else {
      const error = { success: false, message: 'Invalid file type. Please upload a CSV or Excel file.' };
      switch (type) {
        case 'students':
          setStudentImportResult(error);
          break;
        case 'exams':
          setExamImportResult(error);
          break;
        case 'teachers':
          setTeacherImportResult(error);
          break;
        case 'subjects':
          setSubjectImportResult(error);
          break;
        default:
          break;
      }
    }
  };

  const handleImport = async (type) => {
    let file, setLoading, setResult, requiredFields = {};
    
    switch (type) {
      case 'students':
        file = studentFile;
        setLoading = setImportingStudents;
        setResult = setStudentImportResult;
        break;
      case 'exams':
        file = examFile;
        setLoading = setImportingExams;
        setResult = setExamImportResult;
        requiredFields = {
          term: selectedTerm,
          session: selectedSession,
          class: selectedClass
        };
        break;
      case 'teachers':
        file = teacherFile;
        setLoading = setImportingTeachers;
        setResult = setTeacherImportResult;
        break;
      case 'subjects':
        file = subjectFile;
        setLoading = setImportingSubjects;
        setResult = setSubjectImportResult;
        break;
      default:
        return;
    }

    // Validate file exists
    if (!file) {
      setResult({
        success: false,
        message: 'Please select a file first'
      });
      return;
    }

    // Validate required fields for exams
    if (type === 'exams') {
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        setResult({
          success: false,
          message: `Please select: ${missingFields.join(', ')}`
        });
        return;
      }
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Use correct field name based on type
      if (type === 'subjects') {
        formData.append('subjectsFile', file);
      } else {
        formData.append('file', file);
      }
      
      formData.append('schoolName', user.schoolName);

      // Add exam-specific fields
      if (type === 'exams') {
        formData.append('termName', selectedTerm);
        formData.append('sessionName', selectedSession);
        formData.append('className', selectedClass);
      }

      let result;
      switch (type) {
        case 'students':
          result = await uploadStudentsFromExcel(formData);
          break;
        case 'exams':
          result = await uploadExamsFromExcel(formData);
          break;
        case 'teachers':
          result = await uploadTeachersFromExcel(formData);
          break;
        case 'subjects':
          result = await uploadSubjectsFromExcel(formData);
          break;
        default:
          break;
      }
setResult({
  success: result.success,
  message: result.message,
  imported: type === 'subjects' ? result.subjects : result.imported, // Handle subjects differently
  errors: result.errors,
  count: result.count, // Add count for all types
  ...(type === 'exams' && {
    metadata: {
      term: selectedTerm,
      session: selectedSession,
      class: selectedClass
    }
  })
});
    } catch (error) {
      console.error(`${type} import error:`, error);
      
      let errorMessage = error.message || `Failed to import ${type}`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setResult({
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors || [],
        ...(type === 'exams' && {
          submittedData: {
            term: selectedTerm,
            session: selectedSession,
            class: selectedClass
          }
        })
      });
    } finally {
      setLoading(false);
    }
  };

  const renderImportSection = (type) => {
    const config = {
      students: {
        file: studentFile,
        loading: importingStudents,
        result: studentImportResult,
        title: 'Import Students',
        description: 'Upload student data with required columns: full_name, class_name, gender, section'
      },
      exams: {
        file: examFile,
        loading: importingExams,
        result: examImportResult,
        title: 'Import Exams',
        description: 'Upload exam results with required columns: admission_number, subject, exam_mark, ca',
        renderExtraFields: (
          <Box 
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <FormControl sx={{ flex: 1, minWidth: 120 }}>
              <InputLabel>Term</InputLabel>
              <Select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                label="Term"
              >
                <MenuItem value="First Term">First Term</MenuItem>
                <MenuItem value="Second Term">Second Term</MenuItem>
                <MenuItem value="Third Term">Third Term</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1, minWidth: 120 }}>
              <InputLabel>Session</InputLabel>
              <Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                label="Session"
              >
                <MenuItem value="2021/2022">2021/2022</MenuItem>
                <MenuItem value="2022/2023">2022/2023</MenuItem>
                <MenuItem value="2023/2024">2023/2024</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1, minWidth: 120 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Class"
              >
                <MenuItem value="Primary 1">Primary 1</MenuItem>
                <MenuItem value="Primary 2">Primary 2</MenuItem>
                <MenuItem value="Primary 3">Primary 3</MenuItem>
                <MenuItem value="Primary 4">Primary 4</MenuItem>
                <MenuItem value="Primary 5">Primary 5</MenuItem>
                <MenuItem value="JSS 1">JSS 1</MenuItem>
                <MenuItem value="JSS 2">JSS 2</MenuItem>
                <MenuItem value="JSS 3">JSS 3</MenuItem>
                <MenuItem value="SS 1">SS 1</MenuItem>
                <MenuItem value="SS 2">SS 2</MenuItem>
                <MenuItem value="SS 3">SS 3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )
      },
      teachers: {
        file: teacherFile,
        loading: importingTeachers,
        result: teacherImportResult,
        title: 'Import Teachers',
        description: 'Upload teacher data with required columns: full_name, email, phone, gender, department'
      },
      subjects: {
        file: subjectFile,
        loading: importingSubjects,
        result: subjectImportResult,
        title: 'Import Subjects',
        description: 'Upload subject data with required columns: subject_name, classname, subject_code, description'
      }
    }[type];

    const handlePrint = () => {
      const isStudent = type === 'students';
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${isStudent ? 'Student' : 'Teacher'} Credentials</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1976d2; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th { background-color: #f5f5f5; text-align: left; padding: 8px; }
              td { padding: 8px; border-bottom: 1px solid #ddd; }
              .monospace { font-family: monospace; }
              .password { font-weight: bold; color: #2e7d32; }
              .note { margin-top: 30px; font-size: 0.9em; color: #666; }
              @page { size: auto; margin: 10mm; }
            </style>
          </head>
          <body>
            <h1>Imported ${isStudent ? 'Student' : 'Teacher'} Credentials</h1>
            <p>School: ${school?.name || 'N/A'}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  ${isStudent ? '<th>Class</th><th>Section</th>' : '<th>Department</th>'}
                  <th>${isStudent ? 'Student' : 'Teacher'} ID</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                ${config.result.imported.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    ${isStudent ? 
                      `<td>${item.class || 'N/A'}</td>
                       <td>${item.section || 'N/A'}</td>` : 
                      `<td>${item.department || 'N/A'}</td>`
                    }
                    <td class="monospace">${isStudent ? item.admissionNumber : item.teacherId}</td>
                    <td class="monospace password">${item.password}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="note">
              <p><strong>Note:</strong> Please securely share these credentials and advise them to change their password immediately after first login.</p>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 200);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {config.title}
          {config.renderExtraFields}
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Select File
              <input
                type="file"
                hidden
                accept=".xlsx,.xls,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                onChange={(e) => handleFileChange(type, e.target.files[0])}
              />
            </Button>
            
            {config.file && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon color="primary" />
                <Typography variant="body2">
                  {config.file.name}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">File Requirements:</Typography>
              <Typography variant="body2" color="text.secondary">
                • CSV or Excel format<br />
                • {config.description}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleImport(type)}
              disabled={!config.file || config.loading}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
              startIcon={config.loading ? <CircularProgress size={20} /> : null}
            >
              {config.loading ? 'Importing...' : `Import ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </Button>

            {config.result && (
              <Alert 
                severity={config.result.success ? 'success' : 'error'} 
                sx={{ mt: 2 }}
              >
                {config.result.message}
                
                {(type === 'students' || type === 'teachers') && config.result.imported && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Imported {type === 'students' ? 'Student' : 'Teacher'} Credentials:
                    </Typography>
                    
                    <Paper sx={{ overflow: 'hidden', mb: 2 }}>
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: type === 'students' ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        fontWeight: 'bold',
                        p: 1,
                        bgcolor: 'action.hover'
                      }}>
                        <Typography>Name</Typography>
                        {type === 'students' && (
                          <>
                            <Typography>Class</Typography>
                            <Typography>Section</Typography>
                          </>
                        )}
                        {type === 'teachers' && <Typography>Department</Typography>}
                        <Typography>{type === 'students' ? 'Student ID' : 'Teacher ID'}</Typography>
                        <Typography>Password</Typography>
                      </Box>
                      
                      <Box sx={{ 
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}>
                        {config.result.imported.map((item, index) => (
                          <Box 
                            key={index}
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: type === 'students' ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
                              p: 1,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              '&:nth-of-type(odd)': {
                                bgcolor: 'background.default'
                              }
                            }}
                          >
                            <Typography>{item.name}</Typography>
                            {type === 'students' ? (
                              <>
                                <Typography>{item.class || 'N/A'}</Typography>
                                <Typography>{item.section || 'N/A'}</Typography>
                              </>
                            ) : (
                              <Typography>{item.department}</Typography>
                            )}
                            <Typography sx={{ fontFamily: 'monospace' }}>
                              {type === 'students' ? item.admissionNumber : item.teacherId}
                            </Typography>
                            <Typography sx={{ 
                              fontFamily: 'monospace',
                              color: 'success.main',
                              fontWeight: 'bold'
                            }}>
                              {item.password}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => {
                          const headers = type === 'students' 
                            ? ['Name', 'Class', 'Section', 'Student ID', 'Password']
                            : ['Name', 'Department', 'Teacher ID', 'Password'];
                          
                          const data = config.result.imported.map(item => 
                            type === 'students'
                              ? [item.name, item.class_name, item.section, item.studentId, item.password]
                              : [item.name, item.department, item.teacherId, item.password]
                          );
                          
                          const csvContent = [headers, ...data]
                            .map(row => row.join(','))
                            .join('\n');
                          
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `${type}_credentials_${new Date().toISOString().slice(0,10)}.csv`;
                          link.click();
                        }}
                      >
                        Download as CSV
                      </Button>

                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={handlePrint}
                        startIcon={<PrintIcon />}
                      >
                        Print Credentials
                      </Button>
                      
                      <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                        {config.result.imported.length} {type} imported
                      </Typography>
                    </Box>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Please securely share these credentials and advise them to change their password immediately after first login.
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </Alert>
            )}
        </Box>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleChangeTab} 
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="School Profile" />
        <Tab label="Import Students" />
        <Tab label="Import Exams" />
        <Tab label="Import Teachers" />
        <Tab label="Import Subjects" />
        <Tab label="Account Settings" />
        <Tab label="System Updates" />
      </Tabs>

      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 3 }}
              src={`http://localhost:5000/uploads/logos/${user.logo}`}
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = '/defaultLogo.png'; 
              }}
            >
              {school?.name?.charAt(0)}
            </Avatar>

            <Button variant="contained" component="label">
              Upload Logo
              <input type="file" hidden />
            </Button>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
            
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {tabValue === 5 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography>
            Email: {user?.email}
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Change Password
          </Button>
        </Paper>
      )}

      {tabValue === 6 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Updates & Maintenance
          </Typography>
          
          <Typography paragraph>
            <strong>Why System Updates Matter:</strong> Regular updates ensure your school management system remains secure, stable, and equipped with the latest features to support your educational operations.
          </Typography>

          <Typography paragraph>
            <strong>Current Version:</strong> GradeLink365 v2.3.1 (Under Construction)
          </Typography>

          <Typography paragraph>
            <strong>Recent Improvements:</strong>
            <ul>
              <li>Enhanced data import/export functionality</li>
              <li>Improved gradebook performance</li>
              <li>New student attendance tracking features</li>
            </ul>
          </Typography>

          <Typography paragraph>
            <strong>Upcoming Features:</strong>
            <ul>
              <li>Mobile app for parent notifications</li>
              <li>Attendance and performance of both student and teachers</li>
              <li>Integration with national education databases</li>
            </ul>
          </Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Check for Updates
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: System updates are automatically installed during maintenance windows (Sundays 2-4 AM).
          </Typography>
        </Paper>
      )}

      {tabValue === 1 && renderImportSection('students')}
      {tabValue === 2 && renderImportSection('exams')}
      {tabValue === 3 && renderImportSection('teachers')}
      {tabValue === 4 && renderImportSection('subjects')}
    </Box>
  );
};

export default Settings; 