import { useState, useEffect } from 'react';
import {
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { Autocomplete } from '@mui/material';

import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import TeacherRow from '../components/teachers/TeacherRow';
import { getTeachers } from '../services/teacherService';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    photo: null,
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => setOpenAddModal(true);
  const handleCloseModal = () => {
    setOpenAddModal(false);
    setNewTeacher({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      photo: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddTeacher = async () => {
    try {
      console.log('Submitting teacher:', newTeacher);

      // Example: prepare FormData if sending file
      const formData = new FormData();
      Object.entries(newTeacher).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // e.g. await addTeacher(formData);

      handleCloseModal();
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  if (loading) return <Typography>Loading teachers...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Teachers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Add Teacher
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Classes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TeacherRow key={teacher.id} teacher={teacher} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

<Dialog open={openAddModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      backgroundColor: 'primary.main',
      color: 'white',
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    Add New Teacher
    <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

 <DialogContent>
  <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
    <Avatar
      src={newTeacher.photo ? URL.createObjectURL(newTeacher.photo) : ''}
      sx={{ width: 80, height: 80, mb: 1 }}
    >
      {newTeacher.firstName ? newTeacher.firstName.charAt(0).toUpperCase() : 'T'}
    </Avatar>
    <Button
      variant="outlined"
      component="label"
      startIcon={<CloudUploadIcon />}
      sx={{ mb: 1 }}
    >
      Upload Photo
      <input type="file" hidden accept="image/*" name="photo" onChange={handleInputChange} />
    </Button>
    {newTeacher.photo && (
      <Typography variant="caption" sx={{ mb: 2 }}>
        {newTeacher.photo.name}
      </Typography>
    )}
  </Box>

  <Box width="100%" display="flex" justifyContent="center">
    <Grid container spacing={2} maxWidth="sm">
      {[
        { label: 'First Name', name: 'firstName' },
        { label: 'Last Name', name: 'lastName' },
        { label: 'Email', name: 'email' },
        { label: 'Phone', name: 'phone', type: 'tel' }
      ].map((field) => (
        <Grid item xs={12} sm={6} key={field.name}>
          <TextField
            fullWidth
            size="small"
            label={field.label}
            name={field.name}
            value={newTeacher[field.name]}
            onChange={handleInputChange}
            type={field.type || 'text'}
          />
        </Grid>
      ))}

      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={['Male', 'Female', 'Other']}
          value={newTeacher.gender}
          onChange={(e, value) =>
            setNewTeacher((prev) => ({ ...prev, gender: value }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Gender" size="small" required />
          )}
        />
      </Grid>
    </Grid>
  </Box>
</DialogContent>


  <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
    <Button onClick={handleCloseModal} variant="outlined" sx={{ minWidth: 100 }}>
      Cancel
    </Button>
    <Button onClick={handleAddTeacher} variant="contained" sx={{ minWidth: 100 }}>
      Save
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Teachers;
