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
  const [students, setStudents] = useState([]);
  const [studentsPerSchool, setStudentsPerSchool] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const [loading, setLoading] = useState({
    schools: true,
    admins: true,
    students: true,
    studentsPerSchool: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({...prev, schools: true, admins: true, students: true, studentsPerSchool: true}));
        setError(null);
        
        await Promise.all([
          fetchSchools(),
          fetchAdmins(),
          fetchAllStudents(),
          fetchStudentsPerSchool()
        ]);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(prev => ({...prev, schools: false, admins: false, students: false, studentsPerSchool: false}));
      }
    };

    fetchData();
  }, []);

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
    { name: 'Students', value: totalStudents } // Using totalStudents instead of students.length
  ];
  
  const pieColors = ['#2196f3', '#f06292', '#9c27b0'];

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
  minHeight: '100vh'
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
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e3f2fd', height: '100%', width: '200px' }}>
            <CardContent>
              <Typography variant="subtitle2">Total Schools</Typography>
              <Typography variant="h5" fontWeight="bold">
                {loading.schools ? '...' : schools.length}
              </Typography>
              <SchoolIcon sx={{ color: '#2196f3', mt: 3 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fce4ec', height: '100%' , width: '200px'}}>
            <CardContent>
              <Typography variant="subtitle2">Total Admins</Typography>
              <Typography variant="h5" fontWeight="bold">
                {loading.admins ? '...' : admins.length}
              </Typography>
              <AdminPanelSettingsIcon sx={{ color: '#e91e63', mt: 3 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e8f5e9', height: '100%', width: '200px' }}>
            <CardContent>
              <Typography variant="subtitle2">Registered Students</Typography>
              <Typography variant="h5" fontWeight="bold">
                {loading.students ? '...' : students.length}
              </Typography>
              <PeopleIcon sx={{ color: '#4caf50', mt: 1 }} />
              <LinearProgress 
                variant="determinate" 
                value={registrationProgress} 
                sx={{ mt: 1 }} 
              />
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

     {/* Charts in one row */}
<Grid container spacing={3} sx={{ mt: 2 }}>
 <Grid item xs={12} md={6}>
  <Card sx={{ height: 400, width: '400px' }}>
    <CardContent sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Students per School
      </Typography>

      {studentsPerSchool.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={studentsPerSchool}
            layout="vertical"
            margin={{ top: 5, right: 0, left:0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="school_name"
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="student_count"
              name="Students"
              fill="#8884d8"
              radius={[0, 4, 4, 0]}
            >
              {studentsPerSchool.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 ? '#8884d8' : '#9c27b0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>
            {loading.studentsPerSchool
              ? 'Loading data...'
              : 'No school data available'}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
</Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', width: '200px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>System Statistics</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

         <Grid item xs={12} md={6}>
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Students per School</Typography>
        {studentsPerSchool.length > 0 ? (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>School Name</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>Student Count</th>
                </tr>
              </thead>
              <tbody>
                {studentsPerSchool.map((school, index) => (
                  <tr key={index}>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{school.school_name}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px', textAlign: 'right' }}>{school.student_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Typography>
            {loading.studentsPerSchool ? 'Loading data...' : 'No school data available'}
          </Typography>
        )}
      </CardContent>
    </Card>
  </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardContent;