import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Paper, Snackbar, TextField, Typography, Zoom } from '@mui/material'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { axiosInstance } from '../service/axiosInstance'

export const Login = () => {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: "", password: "" })
    const [error, setError] = useState()

    const handleInput = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const login = () => {
        if (formData.username === "")
            setError("Username Required")
        else if (formData.password === "")
            setError("Password Required")
        else {
            axiosInstance.post("/login/", formData).then((response) => {
                setUser(response.data.token)
                sessionStorage.setItem("token", response.data.token)
                navigate("/home")
            }).catch(err => {
                setError(err.response.data.error)
            })
        }

    }

    return (
        <>
            <Box sx={{ alignContent: "center", justifyContent: "center", alignItems: "center", display: "flex", height: "80%" }}>
                <div>
                    <Card sx={{ width: "400px", pb: 2 }}>
                        <CardContent sx={{ m: 2 }}>
                            {error && <Alert severity='error'>{error}</Alert>}
                            <TextField required size='small' onChange={handleInput} fullWidth label="Username" name='username' sx={{ marginTop: 2, marginBottom: 1 }} />
                            <TextField type={"password"} required size='small' onChange={handleInput} fullWidth label="Password" name='password' sx={{ marginTop: 1 }} />
                        </CardContent>
                        <CardActions>
                            <Button onClick={login} size="small" variant='contained' color="primary" fullWidth>
                                Login
                            </Button>
                        </CardActions>
                        <Button variant='text' onClick={() => navigate("/register")} fullWidth sx={{ textAlign: "center" }}>Not Registered yet? Register</Button>
                    </Card>
                </div>
            </Box>
        </>
    )
}
