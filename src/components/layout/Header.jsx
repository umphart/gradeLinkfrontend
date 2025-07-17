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

  // Construct the proper logo URL
  const getLogoUrl = () => {
    if (!user?.logo) return null;
    
    // If logo is already a full URL (like from cloud storage)
    if (user.logo.startsWith('http')) {
      return user.logo;
    }
    
    // For locally stored logos
    return `https://gradelink.onrender.com${user.logo}`;
  };

  const logoUrl = getLogoUrl();

  // Log the logo URL for debugging
  console.log('Header logo URL:', {
    rawLogo: user?.logo,
    constructedUrl: logoUrl,
    userData: user
  });

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

        {logoUrl && (
          <Box
            component="img"
            src={logoUrl}
            alt="School Logo"
            sx={{
              width: isSmallScreen ? 40 : 60,
              height: isSmallScreen ? 40 : 60,
              borderRadius: 2,
              mx: isSmallScreen ? 1 : 2,
              display: { xs: 'none', sm: 'block' },
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onError={(e) => {
              console.error('Failed to load logo:', logoUrl);
              e.target.style.display = 'none';
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