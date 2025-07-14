import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  Button,
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const TeacherRow = ({ teacher, onSave }) => {
  // ✅ Always call hooks at the top level
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    gender: '',
  });

  // ✅ Use effect to sync form data when teacher prop changes
  React.useEffect(() => {
    if (teacher) {
      setFormData({
        full_name: teacher.full_name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        department: teacher.department || '',
        gender: teacher.gender || '',
      });
    }
  }, [teacher]);

  if (!teacher) return null;

  const { id, teacher_id, full_name, email, phone, department, gender, photo_url } = teacher;

  const handleOpenModal = (editMode = false) => {
    setIsEditMode(editMode);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(id, formData);
    setOpen(false);
  };

  const baseUrl = 'http://localhost:5000'; 
  const fullPhotoUrl = photo_url ? `${baseUrl}${photo_url}` : null;

  return (
    <>
      <TableRow>
        <TableCell>{teacher_id || 'N/A'}</TableCell>
        <TableCell>{full_name}</TableCell>
        <TableCell>{email || 'N/A'}</TableCell>
        <TableCell>{phone || 'N/A'}</TableCell>
        <TableCell>{department || 'N/A'}</TableCell>
        <TableCell>{gender || 'N/A'}</TableCell>
        <TableCell>
          <Button size="small" onClick={() => handleOpenModal(false)} startIcon={<VisibilityIcon />} />
          <Button size="small" onClick={() => handleOpenModal(true)} startIcon={<EditIcon />} />
        </TableCell>
      </TableRow>

      <Dialog open={open} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Teacher Details' : 'Teacher Details'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ pt: 2 }}>
            {photo_url ? (
              <Avatar src={fullPhotoUrl} sx={{ width: 80, height: 80 }} />
            ) : (
              <Avatar sx={{ width: 80, height: 80 }}>
                {full_name ? full_name.charAt(0).toUpperCase() : 'T'}
              </Avatar>
            )}

            {isEditMode ? (
              <>
                <TextField label="Name" name="full_name" value={formData.full_name} onChange={handleInputChange} fullWidth />
                <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
                <TextField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} fullWidth />
                <TextField label="Department" name="department" value={formData.department} onChange={handleInputChange} fullWidth />
                <TextField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} fullWidth />
              </>
            ) : (
              <Box width="100%" sx={{ fontSize: '0.875rem' }}>
                <Box display="flex" py={0.5}><Box width="40%" fontWeight="bold">Name:</Box><Box width="60%">{formData.full_name}</Box></Box>
                <Box display="flex" py={0.5}><Box width="40%" fontWeight="bold">Email:</Box><Box width="60%">{formData.email}</Box></Box>
                <Box display="flex" py={0.5}><Box width="40%" fontWeight="bold">Phone:</Box><Box width="60%">{formData.phone}</Box></Box>
                <Box display="flex" py={0.5}><Box width="40%" fontWeight="bold">Department:</Box><Box width="60%">{formData.department}</Box></Box>
                <Box display="flex" py={0.5}><Box width="40%" fontWeight="bold">Gender:</Box><Box width="60%">{formData.gender}</Box></Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" size="small">Cancel</Button>
          {isEditMode && (
            <Button onClick={handleSave} color="primary" size="small">Save</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeacherRow;
