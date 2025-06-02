import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const SuperAdminDashboard = () => {
 const [schools, setSchools] = useState([]);

const fetchSchools = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/school-count/all');
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
      await fetchSchools(); // 🔄 refresh the list from backend
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
  };

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#3347B0', textAlign: 'center' }}
      >
        Super Admin Dashboard
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ marginBottom: 4, color: '#555' }}
      >
        View and manage all registered schools.
      </Typography>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Registered Schools
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>School Name</strong></TableCell>
               <TableCell><strong>School Email</strong></TableCell>
              <TableCell><strong>School Phone</strong></TableCell>
              <TableCell><strong>School Address</strong></TableCell>
              <TableCell><strong>Admin Name</strong></TableCell>
               <TableCell><strong>Admin Email</strong></TableCell>
              <TableCell><strong>Admin Phone</strong></TableCell>
             
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.length > 0 ? (
              schools.map((school, index) => (
                <TableRow key={school.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{school.school_name}</TableCell>
                  <TableCell>{school.school_email}</TableCell>
                  <TableCell>{school.school_phone}</TableCell>
                  <TableCell>{school.address} {school.state}</TableCell>
                   <TableCell>{school.first_name} </TableCell>
                  <TableCell>{school.admin_email}</TableCell>
                   <TableCell>{school.admin_phone}</TableCell>

                  <TableCell>
<IconButton
  color="primary"
  size="small"
  onClick={() => handleUpdate()}
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
                <TableCell colSpan={6} align="center">
                  No schools found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default SuperAdminDashboard;
