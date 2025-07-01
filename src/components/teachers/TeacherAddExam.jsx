import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarWeek, FaClipboardCheck, FaDatabase, FaHSquare, FaRegListAlt } from 'react-icons/fa';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import TeacherLayout from '../layout/TeacherLayout';
const TeacherAddExams = () => {
  const navigate = useNavigate();

  const cards = [
    { label: 'First Term', icon: <FaRegListAlt size={32} />, path: '/teacher-first' },
    { label: 'Second Term', icon: <FaCalendarWeek size={32} />, path: '/teacher-second' },
    { label: 'Third Term', icon: <FaDatabase size={32} />, path: '/teacher-third' },
  ];

  return (
    <TeacherLayout>
    <Box sx={{ p: 0, maxWidth: 1000, mx: 'auto', backgroundColor: 'white', borderRadius: 3 }}>
    <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
  <ArrowBack />
</IconButton>

      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#3347B0', mb: 1 }}>
        Add Exams
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
    </TeacherLayout>
  );
};

export default TeacherAddExams;
