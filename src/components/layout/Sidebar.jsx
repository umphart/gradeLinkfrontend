import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,

  ClassSharp
} from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';

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
      background: 'linear-gradient(to bottom, #1976d2, #1565c0)', // Blue gradient
      color: 'White',
      boxSizing: 'border-box',
      transition: 'width 0.3s',
      overflowX: 'hidden',
      borderRight: 'none',
    },
  }}
>

      <Toolbar />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
          { text: 'Students', icon: <PeopleIcon />, path: '/admin/students' },
          { text: 'Teachers', icon: <SchoolIcon />, path: '/admin/teachers' },
          { text: 'Classes', icon: <ClassSharp />, path: '/admin/classes' },
          { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
          { text: 'Exams', icon: <AssignmentIcon />, path: '/admin/exams' },
          { text: 'Results', icon: <DescriptionIcon />, path: '/admin/generate' },
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
                color: '#fff', // white icon
              }}
            >
              {item.icon}
            </ListItemIcon>
            {hovered && (
  <ListItemText
    primary={item.text}
    primaryTypographyProps={{
      sx: {
        fontWeight: 'bold',
        color: '#fff', // white text
        fontSize: '0.95rem',
      },
    }}
  />
)}

          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
