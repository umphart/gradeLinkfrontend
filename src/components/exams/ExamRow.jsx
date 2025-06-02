import { TableRow, TableCell, Button, Chip } from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ExamRow = ({ exam }) => {
  return (
    <TableRow>
      <TableCell>{exam.name}</TableCell>
      <TableCell>{exam.term?.name || 'N/A'}</TableCell>
      <TableCell>{format(new Date(exam.examDate), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        {exam.subjects?.slice(0, 2).map(subject => (
          <Chip key={subject.id} label={subject.name} size="small" sx={{ mr: 1 }} />
        ))}
        {exam.subjects?.length > 2 && '...'}
      </TableCell>
      <TableCell>
        <Chip 
          label={exam.isCompleted ? 'Completed' : exam.isActive ? 'Active' : 'Upcoming'} 
          color={exam.isCompleted ? 'success' : exam.isActive ? 'primary' : 'default'} 
          size="small" 
        />
      </TableCell>
      <TableCell>
        <Button
          size="small"
          component={Link}
          to={`/app/exams/${exam.id}`}
          startIcon={<VisibilityIcon />}
        >
          View
        </Button>
        <Button
          size="small"
          component={Link}
          to={`/app/exams/${exam.id}/edit`}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button
          size="small"
          component={Link}
          to={`/app/exams/${exam.id}/results`}
          startIcon={<AssignmentIcon />}
        >
          Results
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ExamRow;