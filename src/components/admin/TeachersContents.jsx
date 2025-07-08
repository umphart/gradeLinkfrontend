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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const drawerWidth = 240;

const TeachersContent = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState('All');
  const [schoolNames, setSchoolNames] = useState([]);
  const [search, setSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

const fetchAllTeachers = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/school-count/getTeachers');
    if (!res.ok) throw new Error('Failed to fetch teachers');
    const data = await res.json();

    const sortedTeachers = [...data.teachers].sort((a, b) =>
      a.school_name.localeCompare(b.school_name)
    );

    setTeachers(sortedTeachers);
    setFilteredTeachers(sortedTeachers);

    const schools = [...new Set(sortedTeachers.map(t => t.school_name))];
    setSchoolNames(schools);
  } catch (err) {
    console.error('Error fetching teachers:', err);
  }
};

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  useEffect(() => {
    let data = [...teachers];

    if (schoolFilter !== 'All') {
      data = data.filter(t => t.school_name === schoolFilter);
    }

    if (search.trim()) {
      data = data.filter(t =>
        t.teacher_id.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTeachers(data);
    setPage(0); // Reset to first page on filter/search
  }, [schoolFilter, search, teachers]);

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredTeachers.map(t => ({
      'Teacher ID': t.teacher_id,
      'Name': t.name,
      'Email': t.email,
      'School Name': t.school_name,
      'Password': t.password,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
    XLSX.writeFile(wb, 'teachers.xlsx');
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Teacher List', 14, 10);
    autoTable(doc, {
      startY: 15,
      head: [['#', 'Teacher ID', 'Name', 'Email', 'School Name', 'Password']],
      body: filteredTeachers.map((t, i) => [
        i + 1,
        t.teacher_id,
        t.name,
        t.email,
        t.school_name,
        t.password,
      ]),
    });
    doc.save('teachers.pdf');
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
            Registered School Teachers
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
              label="Search Teacher ID or Email"
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
                <TableCell>Teacher ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>School Name</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((t, i) => (
                  <TableRow key={t.id}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>{t.teacher_id}</TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.email}</TableCell>
                    <TableCell>{t.school_name}</TableCell>
                    <TableCell>
                      <img
                        src={`http://localhost:5000/uploads/logos/${t.logo}`}
                        alt="Logo"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell>
                      {t.password}
                    </TableCell>
                  </TableRow>
                ))}
              {filteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No teachers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredTeachers.length}
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

export default TeachersContent;