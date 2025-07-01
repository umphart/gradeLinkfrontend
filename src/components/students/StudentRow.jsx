import React, { useState } from 'react'; 
import { TableRow, TableCell, Button, Avatar, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
const StudentRow = ({ student, onSave }) => {

  
  const { id, full_name, admission_number, class_name, gender, section, age, guidance_name, guidance_contact, disability_status, photo_url } = student;

  // Modal visibility state
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Editable field states
  const [formData, setFormData] = useState({
    full_name: full_name || '',
    admission_number: admission_number || '',
    class_name: class_name || '',
    gender: gender || '',
    section: section || '',
    age: age || '',
    guidance_name: guidance_name || '',
    guidance_contact: guidance_contact || '',
    disability_status: disability_status || '',
  });

  const handleOpenModal = (editMode = false) => {
    setIsEditMode(editMode); // Determines if the modal should be in edit mode or view mode
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  // Update the state of form fields (for edit mode)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Call the onSave function passed via props to save the updated data
    onSave(id, formData); // Example: update student data
    setOpen(false); // Close the modal after saving
  };

  // Base URL for image path (adjust based on your server configuration)
  const baseUrl = 'http://localhost:5000';  // Adjust according to your backend's URL

  // Full URL for photo (if exists)
  const fullPhotoUrl = photo_url ? `${baseUrl}${photo_url}` : null;

  return (
    <>
      <TableRow>
        <TableCell>{admission_number}</TableCell>
        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            {full_name}
          </Box>
        </TableCell>
         <TableCell>{section || 'N/A'}</TableCell>
        <TableCell>{class_name || 'N/A'}</TableCell>
        <TableCell>{gender}</TableCell>
        <TableCell>{disability_status}</TableCell>
        <TableCell>{guidance_contact || 'N/A'}</TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() => handleOpenModal(false)} // Open the view modal on click
            startIcon={<VisibilityIcon />}
          >
            
          </Button>
          <Button
            size="small"
            onClick={() => handleOpenModal(true)} // Open the edit modal on click
            startIcon={<EditIcon />}
          >
         
          </Button>
        </TableCell>
      </TableRow>

      {/* Modal: View or Edit Student Details */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Student Details' : 'Student Details'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={1} sx={{ pt: 2 }}>
             {/* Display student photo */}
             {photo_url ? (
              <Avatar src={fullPhotoUrl} sx={{ width: 80, height: 80, mb: 2 }} />
            ) : (
              <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                {full_name ? full_name.charAt(0).toUpperCase() : 'S'}
              </Avatar>
            )}


            {/* Form fields (conditionally rendered based on mode) */}
            {isEditMode ? (
            <>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Admission Number"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="admission_number"
                  value={formData.admission_number}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Class"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Section"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Gender"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                />
    
                <TextField
                  label="Age"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Guardian Name"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="guidance_name"
                  value={formData.guidance_name}
                  onChange={handleInputChange}
                />
                <TextField
                  label="disability_status"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="disability_status"
                  value={formData.disability_status}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Guardian Contact"
                  variant="outlined"
                  sx={{ width: '80%' }} // Reduced width
                  name="guidance_contact"
                  value={formData.guidance_contact}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                
                 <Box
              width="100%"
              sx={{
                fontSize: '0.875rem',
                maxHeight: 300, // Set maximum height for the table
                overflowY: 'auto', // Allow scrolling if content exceeds height
              }}
            >
              <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Full Name:</Box>
                  <Box width="60%">{formData.full_name}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Admission Number:</Box>
                  <Box width="60%">{formData.admission_number}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Class:</Box>
                  <Box width="60%">{formData.class_name}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Section:</Box>
                  <Box width="60%">{formData.section}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Gender:</Box>
                  <Box width="60%">{formData.gender}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Age:</Box>
                  <Box width="60%">{formData.age}</Box>
                </Box>
                                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Disability Status:</Box>
                  <Box width="60%">{formData.disability_status}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5} sx={{ borderBottom: '1px solid #eee' }}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Guardian Name:</Box>
                  <Box width="60%">{formData.guidance_name}</Box>
                </Box>
                <Box display="flex" width="100%" py={0.5}>
                  <Box width="40%" sx={{ fontWeight: 'bold' }}>Guardian Contact:</Box>
                  <Box width="60%">{formData.guidance_contact}</Box>
                </Box>
              </Box>
                
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" size="small">
            Cancel
          </Button>
          {isEditMode && (
            <Button onClick={handleSave} color="primary" size="small">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentRow;


