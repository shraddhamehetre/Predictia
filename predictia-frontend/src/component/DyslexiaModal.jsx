import { Alert, AlertTitle, Box, CircularProgress, Dialog, DialogContent, Fade, FormControl, Modal, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { axiosInstance } from '../service/axiosInstance';
import ProgressBar from './ProgressBar';

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

export const DyslexiaModal = ({ open, handleClose }) => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null)
    const [spinner, setSpinner] = useState(false)

    const closeModel = () => {
        setFile(null)
        setPrediction(null)
        setSpinner(false)
        handleClose()
    }

    const handleFileChange = (event) => {
        event.preventDefault();
        setSpinner(true)

        const formData = new FormData();
        formData.append('image', event.target.files[0]);
        formData.append('checked_date', new Date())
        formData.append('details', "")

        setFile(event.target.files[0])

        axiosInstance.post('/predict/dyslexia/', formData, {
            headers: { 'Authorization': 'Token ' + sessionStorage.getItem('token'), 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            setPrediction(response.data)
            setTimeout(() => setSpinner(false), 7200)
        }).catch(error => {
            setSpinner(false)
            setPrediction(null)
            console.error(error);
        });
    };

    return (
        <Dialog open={open} onClose={closeModel} aria-labelledby="Dyslexia" aria-describedby="Dyslexia Prediction - Accept Image" >
            {spinner ?
                <DialogContent>
                        {/* <CircularProgress color="warning" /> */}
                        <ProgressBar setCompleted={setSpinner} />
                </DialogContent> :
                (prediction === null) ? <DialogContent>
                    <Typography id="Dyslexia" variant="h6" component="h2">
                        Upload Handwriting Image
                    </Typography>
                    <Typography id="Dyslexia Prediction - Accept Image" sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <TextField
                                type="file"
                                onChange={handleFileChange}
                            />
                        </FormControl>
                        <p>Selected file: {file && file.name}</p>
                    </Typography>
                </DialogContent> : <DialogContent>
                    <Alert severity={prediction.Detected ? "error" : "success"}>
                        <AlertTitle>{prediction.Detected? "Found with " : "Not Found with "} {prediction.accuracy}% accuracy</AlertTitle><hr />
                        <Typography id="Dyslexia" variant="body2">
                            {`Our technology uses advanced algorithms to analyze language and behavioral patterns, and the results
                             of this analysis are displayed as a ${prediction.Detected ? "Positive" : "Negative"} prediction for dyslexia for the individual.
                              The prediction is based on a ${prediction.accuracy} percentage likelihood, calculated from over 1,00,000 identified key markers,
                            providing a clear and accurate assessment of the individual's risk for dyslexia`}
                        </Typography>
                    </Alert>
                    <Typography variant='caption' textAlign={"center"}>
                        {`*we have analysed total : ${prediction.total_chars_found} characters from your image`}
                    </Typography>
                </DialogContent>
            }
        </Dialog>

    )
}
