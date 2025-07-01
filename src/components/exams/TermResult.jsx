import React, { useRef } from 'react';
import {
  Button, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';

const TermResult = ({ student, results, session, term }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!student) return <Typography>No student selected</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" color="primary" onClick={handlePrint}>Print Report</Button>

      <Box ref={componentRef} sx={{ mt: 3, p: 3, border: '1px solid #ccc' }}>
        <Typography variant="h5" align="center" gutterBottom>Student Report Sheet</Typography>
        <Typography><strong>Name:</strong> {student.full_name}</Typography>
        <Typography><strong>Class:</strong> {student.class_name}</Typography>
        <Typography><strong>Admission No:</strong> {student.admission_number}</Typography>
        <Typography><strong>Term:</strong> {term}</Typography>
        <Typography><strong>Session:</strong> {session}</Typography>

        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>CA</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Remark</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((res, i) => (
              <TableRow key={i}>
                <TableCell>{res.subject}</TableCell>
                <TableCell>{res.ca}</TableCell>
                <TableCell>{res.exam_mark}</TableCell>
                <TableCell>{res.total}</TableCell>
                <TableCell>{res.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default TermResult;
