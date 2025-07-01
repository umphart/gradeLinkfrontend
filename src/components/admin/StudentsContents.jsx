import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  TablePagination,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const drawerWidth = 240;

const StudentsContent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState('All');
  const [schoolNames, setSchoolNames] = useState([]);
  const [search, setSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAllStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/school-count/students');
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();

      const sorted = [...data].sort((a, b) => a.school_name.localeCompare(b.school_name));
      setStudents(sorted);
      setFilteredStudents(sorted);

      const schools = [...new Set(sorted.map(s => s.school_name))];
      setSchoolNames(schools);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    let data = [...students];

    if (schoolFilter !== 'All') {
      data = data.filter(s => s.school_name === schoolFilter);
    }

    if (search.trim()) {
      data = data.filter(s =>
        s.admission_number.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredStudents(data);
    setPage(0); // Reset to first page on filter/search
  }, [schoolFilter, search, students]);

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredStudents.map(s => ({
      'Admission Number': s.admission_number,
      'School Name': s.school_name,
      Password: s.password,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students.xlsx');
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Student List', 14, 10);
    autoTable(doc, {
      startY: 15,
      head: [['#', 'Admission Number', 'School Name', 'Password']],
      body: filteredStudents.map((s, i) => [
        i + 1,
        s.admission_number,
        s.school_name,
        s.password,
      ]),
    });
    doc.save('students.pdf');
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f9fafb',
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Paper elevation={2} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Registered School Students
          </Typography>

          {/* Filter & Search */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by School</InputLabel>
              <Select
                value={schoolFilter}
                label="Filter by School"
                onChange={(e) => setSchoolFilter(e.target.value)}
              >
                <MenuItem value="All">All Schools</MenuItem>
                {schoolNames.map((name, idx) => (
                  <MenuItem key={idx} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Search Admission No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 250 }}
            />

            <Button
              variant="contained"
              color="success"
              onClick={handleExportExcel}
              startIcon={<FileDownloadIcon />}
            >
              Excel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleExportPDF}
              startIcon={<FileDownloadIcon />}
            >
              PDF
            </Button>
          </Box>

          {/* Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Admission Number</TableCell>
                <TableCell>School Name</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>{s.admission_number}</TableCell>
                    <TableCell>{s.school_name}</TableCell>
                    <TableCell>
                      <img
                        src={`http://localhost:5000/uploads/logos/${s.logo}`}
                        alt="Logo"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>
                      {s.password}
                    </TableCell>
                  </TableRow>
                ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredStudents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default StudentsContent;
