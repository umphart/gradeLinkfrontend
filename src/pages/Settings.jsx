import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Tabs, Tab, Paper, TextField, Button, Avatar, Grid } from '@mui/material';
import { getSchoolDetails, updateSchool } from '../services/schoolService';

const Settings = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const data = await getSchoolDetails(user.schoolId);
        setSchool(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || ''
        });
      } catch (error) {
        console.error('Error fetching school data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.schoolId) {
      fetchSchoolData();
    }
  }, [user]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSchool(user.schoolId, formData);
      // Optionally show success message
    } catch (error) {
      console.error('Error updating school:', error);
    }
  };



  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Tabs value={tabValue} onChange={handleChangeTab} sx={{ mb: 3 }}>
        <Tab label="School Profile" />
        <Tab label="Account Settings" />
        <Tab label="Preferences" />
      </Tabs>

      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 3 }}
              src={school?.logoUrl}
            >
              {school?.name?.charAt(0)}
            </Avatar>
            <Button variant="contained" component="label">
              Upload Logo
              <input type="file" hidden />
            </Button>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography>
            Email: {user?.email}
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Change Password
          </Button>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Preferences
          </Typography>
          <Typography color="textSecondary">
            Preferences settings will be available soon
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Settings;