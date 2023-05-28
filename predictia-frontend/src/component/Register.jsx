import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Paper, Snackbar, TextField, Typography, Zoom } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { axiosInstance } from '../service/axiosInstance'

export const Register = () => {

    const { user, setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({ username: "", password: "", email: "", first_name: "", last_name: "" })
    const [error, setError] = useState()
    const navigate = useNavigate();

    const handleInput = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const createAccount = () => {
        if (formData.first_name === "")
            setError("First Name Required")
        else if (formData.last_name === "")
            setError("Last Name Required")
        else if (formData.email === "")
            setError("Email Required")
        else if (formData.username === "")
            setError("Username Required")
        else if (formData.password === "")
            setError("Password Required")
        else {
            axiosInstance.post("/register/", formData).then((response) => {
                setUser(response.data.token)
                navigate("/home")
            }).catch(err => {
                setError(JSON.stringify(err.response.data.detail))
            })
        }

    }

    return (
        <>
            <Box sx={{ alignContent: "center", justifyContent: "center", alignItems: "center", display: "flex", height: "80%" }}>
                <div>
                    <Card sx={{ width: "400px",  pb: 2 }}>
                        <CardContent sx={{ m: 2 }}>
                            {error && <Alert severity='error'>{error}</Alert>}
                            <Grid container columns={12} spacing={1}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <TextField required size='small' onChange={handleInput} value={formData.first_name} fullWidth label="First Name" name='first_name' sx={{ marginTop: 2, marginBottom: 1 }} />
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <TextField required size='small' onChange={handleInput} value={formData.last_name} fullWidth label="Last Name" name='last_name' sx={{ marginTop: 2, marginBottom: 1 }} />
                                </Grid>
                            </Grid>
                            <TextField required size='small' onChange={handleInput} value={formData.email} fullWidth label="E-Mail" name='email' sx={{ marginTop: 2, marginBottom: 1 }} />
                            <TextField required size='small' onChange={handleInput} value={formData.username} fullWidth label="Username" name='username' sx={{ marginTop: 1, marginBottom: 1 }} />
                            <TextField type={"password"} required size='small' onChange={handleInput} value={formData.password} fullWidth label="Password" name='password' sx={{ marginTop: 1 }} />
                        </CardContent>
                        <CardActions>
                            <Button size="small" variant='contained' color="primary" fullWidth onClick={createAccount}>
                                Register
                            </Button>
                        </CardActions>
                        <Button variant='text' onClick={() => navigate("/login")} fullWidth sx={{ textAlign: "center" }}>Aleady Registered? Login</Button>
                    </Card>
                </div>
            </Box>
        </>
    )
}
