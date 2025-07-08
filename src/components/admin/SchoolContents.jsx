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
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const drawerWidth = 240;

const SchoolContents = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: () => {},
  });
  const [deleteId, setDeleteId] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/school-count');
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      console.error('Failed to fetch schools:', err);
      showAlert('Failed to load schools', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(prev => ({ ...prev, open: false }));
  };

  const showConfirmDialog = (id) => {
    setDeleteId(id);
    setConfirmDialog({
      open: true,
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this school? This action cannot be undone.',
      onConfirm: () => handleDeleteConfirm(id),
    });
  };

  const handleCloseConfirmDialog = () => {
    if (!deleting) {
      setConfirmDialog(prev => ({ ...prev, open: false }));
      setDeleteId(null);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:5000/api/schools/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete school');
      }

      await fetchSchools();
      showAlert(result.message || 'School deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      showAlert(error.message || 'An error occurred while deleting the school.', 'error');
    } finally {
      setDeleting(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
      setDeleteId(null);
    }
  };

  const handleUpdate = (id) => {
    console.log('Update school with id:', id);
    // Implement your update logic here
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f9fafb',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Topbar />
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Registered Schools
            <Typography variant="body1" color="text.secondary">
              View and manage all registered schools
            </Typography>
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell><strong>#</strong></TableCell>
                  <TableCell><strong>School Logo</strong></TableCell>
                  <TableCell><strong>School Name</strong></TableCell>
                  <TableCell><strong>School Email</strong></TableCell>
                  <TableCell><strong>School Phone</strong></TableCell>
                  <TableCell><strong>School Address</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schools.length > 0 ? (
                  schools.map((school, index) => (
                    <TableRow 
                      key={school.school_id || index}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
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
                              e.target.src = '';
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <Avatar 
                            alt={school.school_name}
                            sx={{ 
                              width: isSmallScreen ? 40 : 60, 
                              height: isSmallScreen ? 40 : 60,
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText
                            }}
                          >
                            {school.school_name?.charAt(0)?.toUpperCase() || 'S'}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>{school.name}</TableCell>
                      <TableCell>{school.email}</TableCell>
                      <TableCell>{school.phone}</TableCell>
                      <TableCell>{school.address} {school.state}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleUpdate(school.school_id)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => showConfirmDialog(school.id)}
                          disabled={deleting && deleteId === school.id}
                        >
                          {deleting && deleteId === school.id ? (
                            <CircularProgress size={24} color="error" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No schools found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 6 }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: isSmallScreen ? '80%' : '400px'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseConfirmDialog}
            variant="outlined"
            sx={{ borderRadius: 1 }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDialog.onConfirm}
            color="error"
            variant="contained"
            autoFocus
            sx={{ borderRadius: 1 }}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchoolContents;