import { AccordionDetails, AccordionSummary, Table, TableBody, TableHead } from '@mui/material';
import Accordion from '@mui/material/Accordion/Accordion';
import Box from '@mui/material/Box/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog/Dialog'
import DialogContent from '@mui/material/DialogContent/DialogContent';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import TableCell from '@mui/material/TableCell/TableCell';
import TableRow from '@mui/material/TableRow/TableRow';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react'
import { axiosInstance } from '../service/axiosInstance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export const DyscalculiaResult = ({ open, close }) => {

    const [result, setResult] = useState()

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        axiosInstance.put('/predict/dyscalculia/', {}, {
            headers: { 'Authorization': 'Token ' + sessionStorage.getItem('token') }
        }).then(response => {
            console.log(response)
            setResult(response.data)
        }).catch(error => {
            console.error(error);
        });
    }, [open])

    return (
        <Dialog open={true} onClose={() => close(false)} maxWidth={"lg"}>
            <Typography textAlign={"center"} variant={"h6"} p={2}>Dyscalculia Test Results</Typography>
            <DialogContent>
                <Grid container spacing={2} columns={12}>
                    {
                        result && result.map((row, ind) => (
                            <Accordion expanded={expanded === `panel${ind}`} key={ind} onChange={handleChange(`panel${ind}`)} sx={{ width: "100%", backgroundColor: row.test_result.prediction >= 80 ? "#f0fff2" : "#fff1f0" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${ind}-content`}
                                    id={`panel${ind}-header`}
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Checked On {row.checked_date}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>Accuracy :- {row.test_result.prediction}%</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Question</TableCell>
                                            <TableCell>Correct Answer</TableCell>
                                            <TableCell>Given Answer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        Object.keys(row.test_result).map((key, ind) =>
                                            <TableRow key={key} sx={{ backgroundColor: (row.test_result[key].actual_answer === row.test_result[key].answer_given) ? "#f0fff2" : "#fff1f0" }}>
                                                <TableCell>
                                                    <Typography>{row.test_result[key].problem}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{row.test_result[key].actual_answer}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>{row.test_result[key].answer_given}</Typography>
                                                </TableCell>
                                            </TableRow>)
                                    }
                                    </TableBody>
                                    </Table>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    }
                </Grid>
            </DialogContent>
        </Dialog>
    );
}