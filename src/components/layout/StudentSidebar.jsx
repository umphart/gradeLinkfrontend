import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const StudentSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {[
{ text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
{ text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
{ text: 'Profile..', icon: <PeopleIcon />, path: '/student/profile' },
{ text: 'Check Result', icon: <AssignmentIcon />, path: '/student/results' },
{ text: 'Reports', icon: <AssessmentIcon />, path: '/student/reports' },
{ text: 'Settings', icon: <SettingsIcon />, path: '/student/settings' },

        ].map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default StudentSidebar;