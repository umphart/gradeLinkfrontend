import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  SchoolRounded,
  SchoolSharp,
  ClassSharp
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: hovered ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: 'width 0.3s',
        [`& .MuiDrawer-paper`]: {
          width: hovered ? drawerWidth : collapsedWidth,
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
          { text: 'Students', icon: <PeopleIcon />, path: '/admin/students' },
          { text: 'Teachers', icon: <SchoolIcon />, path: '/admin/teachers' },
          { text: 'Sections/Classes', icon: <ClassSharp />, path: '/admin/section' },
          { text: 'Exams', icon: <AssignmentIcon />, path: '/admin/exams' },
          { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
          { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
        ].map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{
              minHeight: 48,
              justifyContent: hovered ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: hovered ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {hovered && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
