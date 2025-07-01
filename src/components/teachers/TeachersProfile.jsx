import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import TeacherLayout from '../layout/TeacherLayout';

const TeacherProfile = () => {
  const [open, setOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    gender: ''
  });
  const [teacher, setTeacher] = React.useState(null);

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
   // console.log('User data from localStorage:', userData);

    if (userData) {
      setTeacher(userData);
      setFormData({
        fullName: userData.fullName || '',
        teacherId: userData.teacherId || '',
        email: userData.email || '',
        phone: userData.phone || '',
        department: userData.department || '',
        gender: userData.gender || '',
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setIsEditMode(true);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  const handleSave = () => {
    const updated = { ...teacher, ...formData };
    localStorage.setItem('user', JSON.stringify(updated));
    setTeacher(updated);
    setOpen(false);
  };

  if (!teacher) return <Typography>Loading...</Typography>;

  const baseUrl = 'http://localhost:5000';
  const fullPhotoUrl = teacher.photoUrl ? `${baseUrl}${teacher.photoUrl}` : null;

  return (
    <TeacherLayout>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>My Profile</Typography>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 500 }}>
        {fullPhotoUrl ? (
          <Avatar src={fullPhotoUrl} sx={{ width: 100, height: 100 }} />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }}>{teacher.fullName?.charAt(0).toUpperCase()}</Avatar>
        )}
        <Typography variant="h6">{teacher.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">{teacher.email}</Typography>

        <Box sx={{ mt: 2, width: '100%' }}>
          <Box display="flex" py={0.5}>
            <Box width="40%" fontWeight="bold">Phone:</Box>
            <Box>{teacher.phone}</Box>
          </Box>
        <Box display="flex" py={0.5}>
            <Box width="40%" fontWeight="bold">Teacher ID:</Box>
            <Box>{teacher.teacherId}</Box>
          </Box>
          <Box display="flex" py={0.5}>
            <Box width="40%" fontWeight="bold">Department:</Box>
            <Box>{teacher.department}</Box>
          </Box>
          <Box display="flex" py={0.5}>
            <Box width="40%" fontWeight="bold">Gender:</Box>
            <Box>{teacher.gender}</Box>
          </Box>
        </Box>

        <Button variant="contained" onClick={handleOpenModal}>Edit Profile</Button>
      </Paper>

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ pt: 2 }}>
            <TextField label="Name" name="fullName" value={formData.fullName} onChange={handleInputChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth />
            <TextField label="Department" name="department" value={formData.department} onChange={handleInputChange} fullWidth />
            <TextField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </TeacherLayout>
  );
};

export default TeacherProfile;
