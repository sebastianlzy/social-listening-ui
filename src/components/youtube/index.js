import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import get from 'lodash/get'
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";


import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import YoutubeConfig from "./YoutubeConfig";

const useStyles = makeStyles((theme) => ({
    title: {
        padding: theme.spacing(2)
    },
    fixedHeight: {
        height: 240,
    },
    container: {
        padding: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
}));

export default function Youtube() {

    const {setIsBackdropShown, setNotificationMessage} = useBackdropContext()

    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                     <YoutubeConfig
                        setIsBackdropShown={setIsBackdropShown}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}