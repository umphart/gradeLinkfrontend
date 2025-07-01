import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert
} from '@mui/material';
import TeacherLayout from '../layout/TeacherLayout';

const TeachersSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false); // For future use

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(false);

  // Simulate checking old password (replace with real auth check)
  const correctOldPassword = 'currentPassword123'; // For demo only!

  const handlePasswordChange = () => {
    setPasswordMessage(null);
    setPasswordError(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Please fill out all password fields.');
      setPasswordError(true);
      return;
    }

    if (oldPassword !== correctOldPassword) {
      setPasswordMessage('Old password is incorrect.');
      setPasswordError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      setPasswordError(true);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters.');
      setPasswordError(true);
      return;
    }

    // Simulate password update (replace with API call)
    setPasswordMessage('Password updated successfully!');
    setPasswordError(false);

    // Clear fields
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <TeacherLayout>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Settings
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            }
            label="Enable Notifications"
          />
          <FormControlLabel
            control={<Switch checked={darkModeEnabled} disabled />}
            label="Dark Mode (coming soon)"
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Change Password
        </Typography>

        {passwordMessage && (
          <Alert severity={passwordError ? 'error' : 'success'} sx={{ mb: 2 }}>
            {passwordMessage}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2} mb={2}>
          <TextField
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
        </Box>

        <Button variant="contained" onClick={handlePasswordChange}>
          Update Password
        </Button>
      </Paper>
    </TeacherLayout>
  );
};

export default TeachersSettings;
