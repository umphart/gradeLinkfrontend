import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ px: isSmallScreen ? 1 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, overflow: 'hidden' }}>
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Times New Roman, serif',
              fontSize: isSmallScreen ? '1.4rem' : '2.4rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.schoolName || 'GradeLink365'}
          </Typography>
        </Box>

        {user?.logo && (
          <Box
            component="img"
            src={`https://gradelink.onrender.com/uploads/${user.logo}`}
            alt="School Logo"
            sx={{
              width: isSmallScreen ? 40 : 60,
              height: isSmallScreen ? 40 : 60,
              borderRadius: 2,
              mx: isSmallScreen ? 1 : 2,
              display: { xs: 'none', sm: 'block' }, // hide on very small screens
            }}
          />
        )}

        <IconButton color="inherit" onClick={handleLogout} title="Logout">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
