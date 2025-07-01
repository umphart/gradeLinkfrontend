import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarWeek, FaClipboardCheck, FaDatabase, FaEye, FaHSquare, FaPlus, FaPlusCircle, FaRegListAlt, FaSearchPlus } from 'react-icons/fa';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ManageExams = () => {
  const navigate = useNavigate();

  const cards = [
    { label: 'Add Exam Record', icon: <FaPlus size={32} />, path: '/admin/add-exam' },
    { label: 'View Exam Record', icon: <FaEye size={32} />, path: '/admin/view-exam' },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', backgroundColor: '#f9fafb', borderRadius: 3 }}>
         <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
  <ArrowBack />
</IconButton>

      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#3347B0', mb: 1 }}>
        Manage Exams
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#666' }}>
        Handle exam records for all terms.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {cards.map((card, index) => (
          <Grid item xs={10} sm={6} md={4} key={index}>
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

export default ManageExams;
