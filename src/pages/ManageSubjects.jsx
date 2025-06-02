import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaEdit, FaTrash, FaList } from 'react-icons/fa';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';

const ManageSubjects = () => {
  const navigate = useNavigate();

  const cards = [
    { label: 'Subjects', icon: <FaList size={32} />, path: '/admin/subject' },
    { label: 'Add Subject', icon: <FaPlusCircle size={32} />, path: '/admin/add-subject' },
    { label: 'Update Subject', icon: <FaEdit size={32} />, path: '/admin/update-subject' },
    { label: 'Delete Subject', icon: <FaTrash size={32} />, path: '/admin/delete-subject' },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', backgroundColor: '#f9fafb', borderRadius: 3 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 16, left: 16, color: '#3347B0' }}>
        ⬅️
      </IconButton>

      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#3347B0', mb: 1 }}>
        Manage Subjects
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#666' }}>
        Add, update, or delete subjects offered in your school.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {cards.map((card, index) => (
          <Grid item xs={10} sm={6} md={3} key={index}>
            <Paper
              elevation={4}
              onClick={() => navigate(card.path)}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ color: '#3347B0', mb: 2 }}>{card.icon}</Box>
              <Typography variant="h6" sx={{ color: '#3347B0', fontWeight: 600 }}>
                {card.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageSubjects;
