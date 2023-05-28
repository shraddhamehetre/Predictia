import { Alert, AlertTitle, Box, Button, CircularProgress, Dialog, DialogContent, Fab, Fade, FormControl, Grid, LinearProgress, Modal, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../service/axiosInstance';
import ProgressBar from './ProgressBar';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const resultStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

export const DysgraphiaModal = ({ open, handleClose }) => {
    const [spinner, setSpinner] = useState(false)
    const [prediction, setPrediction] = useState(null)
    const [testSentences, setTestSentences] = useState([])

    const [reqBody, setReqBody] = useState({
        sentence_1:{actual:"",typed:""},
        sentence_2:{actual:"",typed:""},
        sentence_3:{actual:"",typed:""},
        sentence_4:{actual:"",typed:""},
        sentence_5:{actual:"",typed:""},
    })

     const closeModal = () => {
        setSpinner(false)
        setPrediction(null)
        setReqBody({
            sentence_1:{actual:"",typed:""},
            sentence_2:{actual:"",typed:""},
            sentence_3:{actual:"",typed:""},
            sentence_4:{actual:"",typed:""},
            sentence_5:{actual:"",typed:""},
        })
        handleClose()
     }

    useEffect(()=>{
        axiosInstance.get('/predict/dysgraphia/', {
            headers: { 'Authorization': 'Token ' + sessionStorage.getItem('token')}
        }).then(response => {
            setTestSentences(response.data.sentences)
            console.log(response.data)
        }).catch(error => {
            console.error(error);
        });
    },[open])

    const handlePlay = (sentence) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.rate = 0.70;
        utterance.pitch = 2;
        synth.speak(utterance);
      };

    const handleChange = (name,value) => {
        setReqBody(prev => {return {...prev, [name]:value}})
    }

    const handleSubmit = () => {
        console.log(reqBody)
        axiosInstance.post('/predict/dysgraphia/', reqBody, {
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
        <Dialog open={open} onClose={closeModal} aria-labelledby="Dysgraphia" aria-describedby="Dysgraphia Prediction - Grammer Test" >
            {spinner ?
                <DialogContent>
                        {/* <CircularProgress color="warning" /> */}
                        <ProgressBar setCompleted={setSpinner} />
                </DialogContent> :
                (prediction === null) ? <DialogContent >
                    <Typography id="Dysgraphia" variant="h6" component="h2">
                        Dysgraphia Prediction
                    </Typography>
                    <Table>
                        <TableBody>
                            {
                                testSentences.map((sentence,ind)=>
                                    <TableRow key={sentence}>
                                        <TableCell>
                                            <Fab size='small' onClick={()=>handlePlay(sentence)} title={sentence}>
                                                <PlayArrowIcon/>
                                            </Fab>
                                        </TableCell>
                                        <TableCell> 
                                            <FormControl fullWidth>
                                                <TextField size='small' name={`sentence_${ind+1}`} value={reqBody[`sentence_${ind+1}`].typed} onChange={(e)=>handleChange(`sentence_${ind+1}`,{actual:sentence,typed:e.target.value})}/>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                    <Button fullWidth variant='contained' onClick={handleSubmit}>Get Result</Button>
                </DialogContent> : <DialogContent>
                <TableContainer>
                    <Table>
                        
                            <TableHead>
                                <TableRow>
                                    <TableCell>Actual Text</TableCell>
                                    <TableCell>Typed Text</TableCell>
                                    <TableCell>Accuracy</TableCell>
                                </TableRow>
                            </TableHead>
                        
                        <TableBody>
                            {
                                Object.keys(prediction).map((key,ind)=>
                                    <TableRow key={key}>
                                        <TableCell>
                                            <Typography>{prediction[key].actual}</Typography>
                                        </TableCell>
                                        <TableCell> 
                                            <Typography>{prediction[key].typed}</Typography>
                                        </TableCell>
                                        <TableCell> 
                                            {/* <Typography>{prediction[key].accuracy}</Typography> */}
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress variant="determinate" value={Number(prediction[key].accuracy)} />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography variant="body2" color="text.secondary">{prediction[key].accuracy}%</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <Alert severity={(Object.keys(prediction).reduce((sum, key) => sum + Number(prediction[key].accuracy),0)/5)>80?"success":"error"}>
                        The user's typing average accuracy is {Number(Object.keys(prediction).reduce((sum, key) => sum + Number(prediction[key].accuracy),0)/5).toFixed(2)}%, based on the comparison of the typed text with the actual text.
                    </Alert>
                </DialogContent>
            }
        </Dialog>

    )
}
