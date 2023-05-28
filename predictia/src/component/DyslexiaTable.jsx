import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Dialog, DialogContent, Modal } from '@mui/material';

export default function DyslexiaTable({ headers, rows, closeTable }) {
    return (
        <Dialog open={true} onClose={() => closeTable(undefined)} maxWidth={"lg"}>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                        <TableHead>
                            <TableRow>
                                {
                                    headers.map(header => <TableCell key={header} align="right">{header}</TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    size="small"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor:((Number(row.score["1"])*100) > (Number(row.score["0"])*100) )?"#fff1f0":"#f0fff2" }}
                                >
                                    <TableCell align="right"><img src={`http://localhost:8000/${row.image}`} style={{height:100,width:100}}/></TableCell>
                                    <TableCell align="right">{row.details}</TableCell>
                                    <TableCell align="right">{row.checked_date}</TableCell>
                                    <TableCell align="right">{(Number(row.score["1"])*100).toFixed(2)}%</TableCell>
                                    <TableCell align="right">{(Number(row.score["0"])*100).toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
}