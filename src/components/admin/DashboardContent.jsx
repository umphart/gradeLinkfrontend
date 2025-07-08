import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useEffect, useState } from 'react';

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const DashboardContent = () => {
  const [schools, setSchools] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherPerSchool, setTeacherPerSchool] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsPerSchool, setStudentsPerSchool] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [combinedSchoolData, setCombinedSchoolData] = useState([]);

  const [loading, setLoading] = useState({
    schools: true,
    admins: true,
    teachers: true,
    teacherPerSchool: true,
    students: true,
    studentsPerSchool: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({...prev, schools: true, admins: true, students: true, studentsPerSchool: true, teacherPerSchool: true}));
        setError(null);
        
        await Promise.all([
          fetchSchools(),
          fetchAdmins(),
          fetchTeachers(),
          fetchTeacherPerSchool(),
          fetchAllStudents(),
          fetchStudentsPerSchool()
        ]);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(prev => ({...prev, schools: false, admins: false, students: false, studentsPerSchool: false, teacherPerSchool: false}));
      }
    };

    fetchData();
  }, []);

  // Combine school data when both student and teacher data is loaded
  useEffect(() => {
    if (studentsPerSchool.length > 0 && teacherPerSchool.length > 0) {
      const combined = studentsPerSchool.map(studentSchool => {
        const teacherSchool = teacherPerSchool.find(t => t.school_id === studentSchool.school_id);
        return {
          school_id: studentSchool.school_id,
          school_name: studentSchool.school_name,
          student_count: studentSchool.student_count,
          teacher_count: teacherSchool ? teacherSchool.teacher_count : 0
        };
      });
      setCombinedSchoolData(combined);
    }
  }, [studentsPerSchool, teacherPerSchool]);

  // Fetch all schools
  const fetchSchools = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count');
      if (!res.ok) throw new Error('Failed to fetch schools');
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
      setSchools([]);
    }
  };

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/admins');
      if (!res.ok) throw new Error('Failed to fetch admins');
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setAdmins([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/getTeachers');
      if (!res.ok) throw new Error('Failed to fetch teachers');
      const data = await res.json();

      console.log('Fetched Teachers:', data.teachers);
      console.log('Total Teachers:', data.total);

      setTeachers(data.teachers);
      setTotalTeachers(data.total);

      setLoading(prev => ({ ...prev, teachers: false }));
    } catch (err) {
      console.error('Failed to fetch teacher:', err);
      setTeachers([]);
      setTotalTeachers(0);
      setLoading(prev => ({ ...prev, teachers: false }));
    }
  };

  const fetchTeacherPerSchool = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/teachers-per-school');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setTeacherPerSchool(data);
      
      // Calculate total teachers for dashboard display
      const total = data.reduce((sum, school) => sum + school.teacher_count, 0);
      setTotalTeachers(total);
    } catch (err) {
      console.error('Failed to fetch teachers per school:', err);
      setTeacherPerSchool([]);
      setTotalTeachers(0);
    }
  };

  // Fetch all students
  const fetchAllStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudents([]);
    }
  };

  const fetchStudentsPerSchool = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/students-per-school');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setStudentsPerSchool(data);
      
      // Calculate total students for dashboard display
      const total = data.reduce((sum, school) => sum + school.student_count, 0);
      setTotalStudents(total);
    } catch (err) {
      console.error('Failed to fetch students per school:', err);
      setStudentsPerSchool([]);
      setTotalStudents(0);
    }
  };

  const pieData = [
    { name: 'Schools', value: schools.length },
    { name: 'Admins', value: admins.length },
    { name: 'Teachers', value: totalTeachers }, 
    { name: 'Students', value: totalStudents } 
  ];
  
  const pieColors = ['#2196f3', '#f06292', '#9c27b0', '#4caf50'];

  const adminCountsBySchool = admins.reduce((acc, admin) => {
    const schoolName = admin.school?.name || admin.schoolName || 'Unknown School';
    acc[schoolName] = (acc[schoolName] || 0) + 1;
    return acc;
  }, {});

  const adminChartData = Object.entries(adminCountsBySchool).map(([school, count]) => ({
    school,
    admins: count,
  }));

  // Calculate registration completion percentage
  const registrationProgress = students.length > 0 
    ? Math.min(100, Math.round((students.length / totalStudents) * 100))
    : 0;

  return (
    <Box sx={{ 
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Welcome to the 🎓 GradeLink365 School Management System
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={5} md={2}>
          <Card sx={{ backgroundColor: '#e3f2fd', height: '90%', width: '200px' }}>
            <CardContent>
               <SchoolIcon sx={{ color: '#2196f3', mt: 1 }} />
              <Typography variant="subtitle2">Total Schools</Typography>
              <Typography variant="h6" fontWeight="bold">
                {loading.schools ? '...' : schools.length}
              </Typography>
             
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fce4ec', height: '90%', width: '200px'}}>
            <CardContent> 
               <AdminPanelSettingsIcon sx={{ color: '#e91e63', mt: 1 }} />
              <Typography variant="subtitle2">Total Admins</Typography>
              <Typography variant="h6" fontWeight="bold">
                {loading.admins ? '...' : admins.length}
              </Typography>
            
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f3e5f5', height: '90%', width: '200px' }}>
            <CardContent>
              <PeopleIcon sx={{ color: '#9c27b0', mt: 1 }} />
              <Typography variant="subtitle2">Total Teachers</Typography>
              <Typography variant="h6" fontWeight="bold">
                {loading.teachers ? '...' : totalTeachers}
              </Typography>
              
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e8f5e9', height: '90%', width: '200px' }}>
            <CardContent>
               <PeopleIcon sx={{ color: '#4caf50', mt: 1 }} />
              <Typography variant="subtitle2">Registered Students</Typography>
              <Typography variant="h6" fontWeight="bold">
                {loading.students ? '...' : students.length}
              </Typography>
             
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Table in one row */}
<Grid container spacing={2} sx={{ mt: -1 }}>
  {/* Bar Chart - Reduced width */}
  <Grid item xs={12} md={4}>
    <Card sx={{ height: 350 }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Students/Teachers per School
        </Typography>
        {combinedSchoolData.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={combinedSchoolData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="school_name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="student_count" name="Students" fill="#8884d8" />
              <Bar dataKey="teacher_count" name="Teachers" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>
              {loading.studentsPerSchool || loading.teacherPerSchool
                ? 'Loading data...'
                : 'No school data available'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </Grid>

  {/* Pie Chart - Reduced width */}
  <Grid item xs={12} md={3}>
    <Card sx={{ height: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>System Statistics</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </Grid>

  {/* Table - Reduced width */}
  <Grid item xs={12} md={5}>
    <Card sx={{ height: 350 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>School Details</Typography>
        {combinedSchoolData.length > 0 ? (
          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '6px', textAlign: 'left', position: 'sticky', top: 0, background: 'white' }}>School</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '6px', textAlign: 'right', position: 'sticky', top: 0, background: 'white' }}>Students</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '6px', textAlign: 'right', position: 'sticky', top: 0, background: 'white' }}>Teachers</th>
                </tr>
              </thead>
              <tbody>
                {combinedSchoolData.map((school, index) => (
                  <tr key={index}>
                    <td style={{ borderBottom: '1px solid #eee', padding: '6px' }}>{school.school_name}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '6px', textAlign: 'right' }}>{school.student_count}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '6px', textAlign: 'right' }}>{school.teacher_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>
              {loading.studentsPerSchool || loading.teacherPerSchool ? 'Loading data...' : 'No school data available'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </Grid>
</Grid>
    </Box>
  );
};

export default DashboardContent;