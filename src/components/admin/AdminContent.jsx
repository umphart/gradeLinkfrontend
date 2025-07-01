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
  Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



const drawerWidth = 240;

const AdminContent = () => {
const [admins, setAdmins] = useState([]);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/admins');
      if (!res.ok) throw new Error('Failed to fetch admins');
      const data = await res.json();
      setAdmins(data);
     
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);



  const handleUpdate = (id) => {
    // Future implementation
  };

  return (
    <Box sx={{ display: 'flex' }}>
     
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f9fafb',
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
       


        <Paper elevation={2} sx={{ padding: 4 }}>
          <Typography variant="h6" gutterBottom>
            Registered Schools Admin   
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Admin Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
               
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.length > 0 ? (
                admins.map((admins, index) => (
                  <TableRow key={admins.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{admins.first_name}{" "}{admins.last_name}</TableCell>
                    <TableCell>{admins.email}</TableCell>
                    <TableCell>{admins.phone}</TableCell>
                    

                    <TableCell>
                      <IconButton color="primary" size="small" >
                        <EditIcon />

                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No Admin found.
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

export default AdminContent;
