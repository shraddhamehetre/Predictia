import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import dyslexia from '../img/dyslexia.png'
import dysgraphia from '../img/dysgraphia.png'
import dyscalculia from '../img/dyscalculia.png'
import { useNavigate } from 'react-router-dom'
import { DyslexiaModal } from './DyslexiaModal'
import { axiosInstance } from '../service/axiosInstance'
import DyslexiaTable from './DyslexiaTable'
import { AudioBox } from './Audio'
import { DysgraphiaModal } from './DysgraphiaModal'
import { DysgraphiaResult } from './DysgraphiaResult'
import { DyscalculiaModal } from './DyscalculiaModal'
import { DyscalculiaResult } from './DyscalculiaResult'

export const HomePage = () => {
    const navigate = useNavigate();
    const [dyslexiaWindow, setDyslexiaWindow] = useState(false)
    const [dyslexiaHistory, setDyslexiaHistory] = useState()

    const [dysgraphiaWindow, setDysgraphiaWindow] = useState(false)
    const [dysgraphiaHistory, setDysgraphiaHistory] = useState(false)

    const [dyscalculiaWindow, setDyscalculiaWindow] = useState(false)
    const [dyscalculiaHistory, setDyscalculiaHistory] = useState(false)

    const checkAuth = useCallback(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const closeDyslexiaWindow = () => setDyslexiaWindow(false)
    const closeDysgraphiaWindow = () => setDysgraphiaWindow(false)
    const closeDyscalculiaWindow = () => setDyscalculiaWindow(false)

    const showResults = () => {
        axiosInstance.get('/predict/dyslexia/', {
            headers: { 'Authorization': 'Token ' + sessionStorage.getItem('token') }
        }).then(response => {
            console.log(response)
            setDyslexiaHistory(response.data)
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div>
            <Grid container columns={12} spacing={5} p={5}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Card>
                        <CardActionArea onClick={() => setDyslexiaWindow(true)}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={dyslexia}
                                title="Dyslexia"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Dyslexia
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: "170px" }}>
                                    Dyslexia is a neurological disorder that affects an individual's ability to read and process written language.
                                    It is thought to be caused by difficulties in processing phonological and/or visual information, making it difficult for individuals with dyslexia to recognize and read words.
                                    It is a lifelong condition, but it can be managed with appropriate interventions such as specialized instruction, accommodations, and therapies.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" onClick={showResults} fullWidth variant='contained'>Old Results</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Card>
                        <CardActionArea onClick={() => setDyscalculiaWindow(true)}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={dyscalculia}
                                title="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Dyscalculia
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: "170px" }}>
                                    Dyscalculia is a learning disorder that affects an individual's ability to understand and use mathematical concepts.
                                    It is characterized by difficulties in understanding numbers, learning math facts, and performing mathematical operations.
                                    Dyscalculia can also make it hard for people to understand the relationship between numbers and quantities, as well as to learn math concepts.
                                    It is a lifelong condition and can be managed with appropriate interventions such as specialized instruction, accommodations, and therapies.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" onClick={()=>setDyscalculiaHistory(true)} fullWidth variant='contained'>Old Results</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Card>
                        <CardActionArea onClick={() => setDysgraphiaWindow(true)}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={dysgraphia}
                                title="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Dysgraphia
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ minHeight: "170px" }}>
                                    Dysgraphia is a learning disorder that affects an individual's ability to write legibly and express thoughts in writing.
                                    It is characterized by difficulties with handwriting, spelling, grammar, and organizing ideas on paper.
                                    Individuals with dysgraphia may struggle with fine motor skills, spatial awareness, and organization.
                                    Dysgraphia is a lifelong condition and can be managed with appropriate interventions such as specialized instruction, accommodations, and therapies.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" onClick={() => setDysgraphiaHistory(true)} fullWidth variant='contained'>Old Results</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <DyslexiaModal open={dyslexiaWindow} handleClose={closeDyslexiaWindow} />
            {dyslexiaHistory && <DyslexiaTable headers={["Image", "Details", "Checked on", "Positive Score", "Negative Score"]} rows={dyslexiaHistory} closeTable={setDyslexiaHistory} />}
            
            <DysgraphiaModal open={dysgraphiaWindow} handleClose={closeDysgraphiaWindow} />
            {dysgraphiaHistory && <DysgraphiaResult open={dysgraphiaHistory} close={setDysgraphiaHistory} />}
            
            <DyscalculiaModal open={dyscalculiaWindow} handleClose={closeDyscalculiaWindow} />
            { dyscalculiaHistory && <DyscalculiaResult open={dyscalculiaHistory} close={setDyscalculiaHistory} /> }
        </div>
    )
}
