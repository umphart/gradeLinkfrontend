import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ExamRow from '../components/exams/ExamRow';
import { getExams } from '../services/examService';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams
    .filter(exam => exam.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(exam => {
      if (filter === 'all') return true;
      if (filter === 'active') return exam.isActive;
      if (filter === 'completed') return exam.isCompleted;
      return true;
    });

  if (loading) return <Typography>Loading exams...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Exams</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/app/exams/create"
        >
          Create Exam
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip 
            label="All Exams" 
            onClick={() => setFilter('all')} 
            color={filter === 'all' ? 'primary' : 'default'} 
          />
          <Chip 
            label="Active Exams" 
            onClick={() => setFilter('active')} 
            color={filter === 'active' ? 'primary' : 'default'} 
          />
          <Chip 
            label="Completed Exams" 
            onClick={() => setFilter('completed')} 
            color={filter === 'completed' ? 'primary' : 'default'} 
          />
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell>Term</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExams.map((exam) => (
              <ExamRow key={exam.id} exam={exam} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Exams;