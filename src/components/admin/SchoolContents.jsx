import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const drawerWidth = 240;

const SchoolContents = () => {
  const [schools, setSchools] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchSchools = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count');
      const data = await res.json();
      setSchools(data);
  
    } catch (err) {
      console.error('Failed to fetch schools:', err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this school?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/school-count/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        await fetchSchools();
        alert(data.message);
      } else {
        console.error(data.message);
        alert('Failed to delete school.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('An error occurred while deleting the school.');
    }
  };

  const handleUpdate = (id) => {
    console.log('Update school with id:', id);
  };

  return (
    <Box sx={{ display: 'flex' }}>
   
      <Box
             component="main"
             sx={{
               flexGrow: 1,
               bgcolor: '#f9fafb',
               p: 3,
               width: { sm: `calc(100% - ${drawerWidth}px)` },
             }}
           >
    

        
        <Paper elevation={1} sx={{ padding: 1 }}>
          <Typography variant="h6" gutterBottom>
            Registered Schools - View and manage all registered schools.
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>School Logo</strong></TableCell>
                <TableCell><strong>School Name</strong></TableCell>
                <TableCell><strong>School Email</strong></TableCell>
                <TableCell><strong>School Phone</strong></TableCell>
                <TableCell><strong>School Address</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.length > 0 ? (
                schools.map((school, index) => (
                  <TableRow key={school.school_id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {school.logo ? (
                        <Box
                          component="img"
                          src={`http://localhost:5000/uploads/logos/${school.logo}`}
                          alt={`${school.school_name} Logo`}
                          sx={{
                            width: isSmallScreen ? 40 : 60,
                            height: isSmallScreen ? 40 : 60,
                            borderRadius: 2,
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.src = ''; // Clear the broken image
                            e.target.onerror = null; // Prevent infinite loop
                          }}
                        />
                      ) : (
                        <Avatar 
                          alt={school.school_name}
                          sx={{ 
                            width: isSmallScreen ? 40 : 60, 
                            height: isSmallScreen ? 40 : 60,
                            bgcolor: 'primary.main' 
                          }}
                        >
                          {school.school_name?.charAt(0) || 'S'}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.email}</TableCell>
                    <TableCell>{school.phone}</TableCell>
                    <TableCell>{school.address} {school.state}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={() => handleUpdate(school.school_id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => handleDelete(school.school_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No schools found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default SchoolContents;