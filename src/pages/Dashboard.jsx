import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { People, School, Assessment, Assignment } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/studentService';
import { Bar } from 'react-chartjs-2';
import ManageStudentsOptions from '../components/students/ManageStudentOptions';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
  const [categoryStats, setCategoryStats] = useState({
    primary: 0, junior: 0, senior: 0,
    primaryMale: 0, primaryFemale: 0,
    juniorMale: 0, juniorFemale: 0,
    seniorMale: 0, seniorFemale: 0,
  });
  const [showManageStudents, setShowManageStudents] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    const fetchTotalStudents = async () => {
      try {
        const allStudents = await getStudents();
        setTotalStudents(allStudents.length);

        const maleCount = allStudents.filter(s => s.gender === 'Male').length;
        const femaleCount = allStudents.filter(s => s.gender === 'Female').length;
        setGenderStats({ male: maleCount, female: femaleCount });

        const stats = {
          primary: 0, junior: 0, senior: 0,
          primaryMale: 0, primaryFemale: 0,
          juniorMale: 0, juniorFemale: 0,
          seniorMale: 0, seniorFemale: 0,
        };

        allStudents.forEach(student => {
          const { section, gender } = student;
          if (section === 'Primary') {
            stats.primary += 1;
            gender === 'Male' ? stats.primaryMale++ : stats.primaryFemale++;
          } else if (section === 'Junior') {
            stats.junior += 1;
            gender === 'Male' ? stats.juniorMale++ : stats.juniorFemale++;
          } else if (section === 'Senior') {
            stats.senior += 1;
            gender === 'Male' ? stats.seniorMale++ : stats.seniorFemale++;
          }
        });

        setCategoryStats(stats);
      } catch (error) {
        console.error('Failed to fetch total students:', error);
      }
    };

    fetchTotalStudents();
  }, [user, navigate]);

const featureCards = [
  { label: 'Manage Students', icon: <People fontSize="large" />, onClick: () => navigate('/admin/manage-student') },
  { label: 'Manage Teachers', icon: <School fontSize="large" />, onClick: () => navigate('/admin/manage-teacher') },
  { label: 'Manage Exams', icon: <Assessment fontSize="large" />, onClick: () => navigate('/admin/manage-exam') },
  { label: 'Manage Subjects', icon: <Assignment fontSize="large" />, onClick: () => navigate('/admin/manage-subject') },
];


  const barData = {
    labels: ['Primary', 'Junior', 'Senior'],
    datasets: [
      {
        label: 'Male Students',
        data: [
          categoryStats.primaryMale,
          categoryStats.juniorMale,
          categoryStats.seniorMale,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Female Students',
        data: [
          categoryStats.primaryFemale,
          categoryStats.juniorFemale,
          categoryStats.seniorFemale,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: {
        title: { display: true, text: 'Section' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Students' },
        ticks: { stepSize: 5 },
      },
    },
  };

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: 4 }}>
      {showManageStudents ? (
        <ManageStudentsOptions goBack={() => setShowManageStudents(false)} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3347B0', textAlign: 'center' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ marginBottom: 4, color: '#555' }}>
            Welcome, {user?.firstName || 'Admin'}! Manage and monitor your system.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', marginBottom: 5 }}>
            {featureCards.map((item, index) => (
              <Paper
                key={index}
                elevation={3}
                onClick={item.onClick}
                sx={{
                  width: { xs: '45%', sm: 180 },
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  backgroundColor: '#f4f7fa',
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ color: '#3347B0', mb: 1 }}>{item.icon}</Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#555', textAlign: 'center' }}>
                  {item.label}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Grid container spacing={4}>
           <Grid item xs={12} md={6}>
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="subtitle1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
      Student Statistics
    </Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Category</TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Count</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow><TableCell>Total Students</TableCell><TableCell>{totalStudents}</TableCell></TableRow>
        <TableRow><TableCell>Males</TableCell><TableCell>{genderStats.male}</TableCell></TableRow>
        <TableRow><TableCell>Females</TableCell><TableCell>{genderStats.female}</TableCell></TableRow>
        <TableRow><TableCell>Primary</TableCell><TableCell>{categoryStats.primary}</TableCell></TableRow>
        <TableRow><TableCell>Junior</TableCell><TableCell>{categoryStats.junior}</TableCell></TableRow>
        <TableRow><TableCell>Senior</TableCell><TableCell>{categoryStats.senior}</TableCell></TableRow>
      </TableBody>
    </Table>
  </Paper>
</Grid>


            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom align="center">Gender Distribution by Category</Typography>
                <Bar data={barData} options={barOptions} />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
