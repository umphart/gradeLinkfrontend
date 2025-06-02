import React from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { 
  Edit, 
  TransferWithinAStation, 
  PersonRemove, 
  School, 
  ArrowBack, 
} from '@mui/icons-material'; 
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';

const ManageStudentsOptions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      label: 'Update Student', 
      icon: <Edit fontSize="large" />, 
      path: '/admin/update-student',
      color: '#6c63ff', // Purple
      hoverColor: '#4e38cc', // Darker Purple
    },
    { 
      label: 'Transfer Student', 
      icon: <TransferWithinAStation fontSize="large" />, 
      path: '/admin/transfer-student',
      color: '#ff6f61', // Coral
      hoverColor: '#d75751', // Darker Coral
    },
    { 
      label: 'Withdraw Student', 
      icon: <PersonRemove fontSize="large" />, 
      path: '/admin/withdraw-student',
      color: '#ffb74d', // Amber
      hoverColor: '#e6892f', // Darker Amber
    },
    { 
      label: 'Freeze Student', 
      icon: <School fontSize="large" />, 
      path: '/admin/freeze-student',
      color: '#4caf50', // Green
      hoverColor: '#388e3c', // Darker Green
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', backgroundColor: '#f9fafb', borderRadius: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16, color: '#3347B0' }}>
        <ArrowBack />
      </IconButton>

      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#3347B0', mb: 1 }}>
        Manage Student Records
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#555' }}>
        Update, transfer, withdraw, or Freeze students easily.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {actions.map((action, index) => (
          <Grid item xs={10} sm={6} md={3} key={index}>
            <Paper
              elevation={4}
              onClick={() => navigate(action.path)}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s, color 0.3s',
                '&:hover': {
                  backgroundColor: action.hoverColor,
                  transform: 'translateY(-6px)',
                  boxShadow: `0 8px 20px rgba(0, 0, 0, 0.2)`,
                  color: '#ffffff', // Ensure text and icons turn white on hover
                },
              }}
            >
              <Box sx={{
                color: action.color,
                mb: 2,
                transition: 'color 0.3s',
                '&:hover': {
                  color: '#ffffff', // Icons will turn white on hover
                },
              }}>
                {action.icon}
              </Box>
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: action.color,
                transition: 'color 0.3s',
                '&:hover': {
                  color: '#ffffff', // Text will turn white on hover
                },
              }}>
                {action.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageStudentsOptions;
