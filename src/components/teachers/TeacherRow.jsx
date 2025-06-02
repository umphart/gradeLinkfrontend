import { TableRow, TableCell, Button, Avatar, Chip } from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TeacherRow = ({ teacher }) => {
  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2 }} src={teacher.photoUrl}>
          {teacher.firstName.charAt(0)}
        </Avatar>
        {`${teacher.firstName} ${teacher.lastName}`}
      </TableCell>
      <TableCell>{teacher.email}</TableCell>
      <TableCell>
        {teacher.subjects?.slice(0, 2).map(subject => (
          <Chip key={subject.id} label={subject.name} size="small" sx={{ mr: 1 }} />
        ))}
        {teacher.subjects?.length > 2 && '...'}
      </TableCell>
      <TableCell>
        {teacher.classes?.slice(0, 2).map(cls => (
          <Chip key={cls.id} label={cls.name} size="small" sx={{ mr: 1 }} />
        ))}
        {teacher.classes?.length > 2 && '...'}
      </TableCell>
      <TableCell>
        <Chip 
          label={teacher.isActive ? 'Active' : 'Inactive'} 
          color={teacher.isActive ? 'success' : 'error'} 
          size="small" 
        />
      </TableCell>
      <TableCell>
        <Button
          size="small"
          component={Link}
          to={`/app/teachers/${teacher.id}`}
          startIcon={<VisibilityIcon />}
        >
          View
        </Button>
        <Button
          size="small"
          component={Link}
          to={`/app/teachers/${teacher.id}/edit`}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TeacherRow;