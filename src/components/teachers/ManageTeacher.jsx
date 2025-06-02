import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserPlus,
  FaUserEdit,
  FaChalkboardTeacher,
  FaTrashAlt,
  FaListAlt,
  FaUserCheck,
} from 'react-icons/fa';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';

const ManageTeacher = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Assign Class', icon: <FaChalkboardTeacher size={30} />, path: '/admin/assign-class' },
    { label: 'Assign Subject', icon: <FaUserCheck size={30} />, path: '/admin/assign-subject' },
    { label: 'Update Teacher', icon: <FaUserEdit size={30} />, path: '/admin/update-teacher' },
    { label: 'Delete Teacher', icon: <FaTrashAlt size={30} />, path: '/admin/delete-teacher' },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', backgroundColor: '#f9fafb', borderRadius: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16, color: '#3347B0' }}>
        ⬅️
      </IconButton>

      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#3347B0', mb: 1 }}>
        Manage Teacher Records
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#555' }}>
        Add, update, assign class, verify, or delete teacher records easily.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {actions.map((action, index) => (
          <Grid item xs={10} sm={6} md={4} key={index}>
            <Paper
              elevation={4}
              onClick={() => navigate(action.path)}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ color: '#3347B0', mb: 2 }}>{action.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#3347B0' }}>
                {action.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageTeacher;
