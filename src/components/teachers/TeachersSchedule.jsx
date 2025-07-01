import React, { useEffect, useState } from 'react';
import { Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import TeacherLayout from '../layout/TeacherLayout';

const TeachersSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Example static schedule data (can be fetched from an API/localStorage later)
    const sampleSchedule = [
      { id: 1, day: 'Monday', time: '9:00 AM - 10:30 AM', subject: 'Mathematics', room: 'Room 101' },
      { id: 2, day: 'Tuesday', time: '11:00 AM - 12:30 PM', subject: 'Physics', room: 'Room 204' },
      { id: 3, day: 'Wednesday', time: '9:00 AM - 10:30 AM', subject: 'Mathematics', room: 'Room 101' },
      { id: 4, day: 'Friday', time: '2:00 PM - 3:30 PM', subject: 'Chemistry', room: 'Room 303' },
    ];

    setSchedule(sampleSchedule);
  }, []);

  return (
    <TeacherLayout>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>My Schedule</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {schedule.length === 0 ? (
          <Typography>No schedule found.</Typography>
        ) : (
          <List>
            {schedule.map((item) => (
              <ListItem key={item.id} sx={{ mb: 1, borderBottom: '1px solid #eee' }}>
                <ListItemText
                  primary={`${item.day} - ${item.time}`}
                  secondary={`${item.subject} in ${item.room}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </TeacherLayout>
  );
};

export default TeachersSchedule;
