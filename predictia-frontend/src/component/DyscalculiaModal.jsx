import { Alert, AlertTitle, Box, Button, CircularProgress, Dialog, DialogContent, Divider, Fab, Fade, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, List, ListItem, ListItemText, Modal, Radio, RadioGroup, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../service/axiosInstance';
import ProgressBar from './ProgressBar';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';


export const DyscalculiaModal = ({ open, handleClose }) => {
    const [spinner, setSpinner] = useState(false)
    const [prediction, setPrediction] = useState(null)
    const [testSentences, setTestSentences] = useState([])

    const [reqBody, setReqBody] = useState({
        problem_1: { problem: "", answer_given: "", actual_answer: "" },
        problem_2: { problem: "", answer_given: "", actual_answer: "" },
        problem_3: { problem: "", answer_given: "", actual_answer: "" },
        problem_4: { problem: "", answer_given: "", actual_answer: "" },
        problem_5: { problem: "", answer_given: "", actual_answer: "" },
    })

    const closeModal = () => {
        setSpinner(false)
        setPrediction(null)
        setReqBody({
            problem_1: { problem: "", answer_given: "", actual_answer: "" },
            problem_2: { problem: "", answer_given: "", actual_answer: "" },
            problem_3: { problem: "", answer_given: "", actual_answer: "" },
            problem_4: { problem: "", answer_given: "", actual_answer: "" },
            problem_5: { problem: "", answer_given: "", actual_answer: "" },
        })
        handleClose()
    }

    useEffect(() => {
        axiosInstance.get('/predict/dyscalculia/', {
            headers: { 'Authorization': 'Token ' + sessionStorage.getItem('token') }
        }).then(response => {
            setTestSentences(response.data.problems)
            console.log(response.data)
        }).catch(error => {
            console.error(error);
        });
    }, [open])

    const handleChange = (name, value) => {
        setReqBody(prev => { return { ...prev, [name]: value } })
    }

    const handleSubmit = () => {
        console.log(reqBody)
        axiosInstance.post('/predict/dyscalculia/', reqBody, {
            headers: { 'Authorization': 'Token ' + sessionStorage.getItem('token') }
        }).then(response => {
            console.log(response)
            setPrediction(response.data)
            setTimeout(() => setSpinner(false), 7200)
        }).catch(error => {
            setSpinner(false)
            setPrediction(null)
            console.error(error);
        });
    }

    return (
        <Dialog open={open} onClose={closeModal} aria-labelledby="Dyscalculia" aria-describedby="Dyscalculia Prediction - Grammer Test" >
            {spinner ?
                <DialogContent>
                    {/* <CircularProgress color="warning" /> */}
                    <ProgressBar setCompleted={setSpinner} />
                </DialogContent> :
                (prediction === null) ? <DialogContent >
                    <Typography id="Dyscalculia" variant="h6" component="h2" textAlign={"center"}>
                        Dyscalculia Prediction
                    </Typography>
                    <List>
                        {
                            testSentences.map((problem, ind) =>
                                <>
                                    <ListItem key={problem}>
                                        <FormControl>
                                            <FormLabel id={`problem_${ind + 1}_id`} title={problem.answer}>{problem.problem}</FormLabel>
                                            <RadioGroup row aria-labelledby={`problem_${ind + 1}_id`} name={`problem_${ind + 1}`} onChange={(e) => handleChange(`problem_${ind + 1}`, { problem: problem.problem, answer_given: e.target.value, actual_answer: problem.answer })}>
                                                {
                                                    problem.options.map((optn, ind) => <FormControlLabel key={ind} value={optn} control={<Radio />} label={optn} />)
                                                }
                                            </RadioGroup>
                                        </FormControl>
                                    </ListItem>
                                    <Divider />
                                </>
                            )
                        }
                    </List>
                    <Button fullWidth variant='contained' onClick={handleSubmit}>Get Result</Button>
                </DialogContent> : <DialogContent>
                    <Alert severity={Number(prediction.prediction) >= 80 ? "success" : "error"}>
                        The user's Computational average accuracy is {prediction.prediction}%, based on the answers given in test.
                    </Alert>
                    <TableContainer>
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
                                    Object.keys(prediction).map((key, ind) =>
                                        <TableRow key={key} sx={{ backgroundColor: (prediction[key].actual_answer === prediction[key].answer_given) ? "#f0fff2" : "#fff1f0" }}>
                                            <TableCell>
                                                <Typography>{prediction[key].problem}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{prediction[key].actual_answer}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{prediction[key].answer_given}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            }
        </Dialog>

    )
}
