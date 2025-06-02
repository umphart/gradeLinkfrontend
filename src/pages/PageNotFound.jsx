import { Box, Grid, Paper, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
   
    <div style={{ padding: '24px', backgroundColor: '#f4f6f8' }}>    <h1 style={{ fontWeight: 'bold', color: '#333' }}>
      page not fund</h1>
      </div>
 
  );
};

export default Dashboard;