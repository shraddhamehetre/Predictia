import * as React from 'react';
import { CardMedia, Dialog, DialogContent, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import CardContent from '@mui/material/CardContent';

export default function DyslexiaTable({ headers, rows, closeTable }) {
    return (
        <Dialog open={true} onClose={() => closeTable(undefined)} maxWidth={"lg"}>
            <Typography textAlign={"center"} variant={"h6"} p={2}>Dyslexia Test Results</Typography>
            <DialogContent>
                <Grid container spacing={2} columns={12}>
                    {rows.map((row,ind) => (
                        <Grid item xs={12} sm={12} md={4} lg={4} key={ind}>
                            <Card sx={{ display: 'flex', backgroundColor:((Number(row.score["1"]) * 100) > (Number(row.score["0"]) * 100)) ? "#fff1f0" : "#f0fff2"  }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography variant="h6">
                                            Checked On {row.checked_date}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {row.details}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Positive :- {(Number(row.score["1"]) * 100).toFixed(2)}%
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Negative :- {(Number(row.score["0"]) * 100).toFixed(2)}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <CardMedia
                                    component="img"
                                    sx={{ height: 100, width: 100 }}
                                    image={`http://localhost:8000/${row.image}`}
                                    alt="Live from space album cover"
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}