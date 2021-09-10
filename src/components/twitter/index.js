import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import getTwitterRules from "./getTwitterRules";
import get from 'lodash/get'
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import isEqual from "lodash/isEqual"

import TwitterRules from './TwitterRules'
import TwitterKey from './TwitterKey'
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

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

export default function Twitter(props) {

    const {setNotificationMessage} = props
    const [twitterRules, setTwitterRules] = useState([]);
    const [isBackdropShown, setIsBackdropShown] = React.useState(true);

    const fetchTwitterRules = () => {
        return getTwitterRules()
            .then((resp) => {
                let newRules = get(resp, 'data.body')
                if (!isEqual(newRules, twitterRules)) {
                    setTwitterRules(newRules || [])
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchTwitterRules()
            .then(() => {
                setIsBackdropShown(false)
            })
    }, [])

    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <TwitterKey
                        setIsBackdropShown={setIsBackdropShown}
                        setNotificationMessage={setNotificationMessage}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <TwitterRules
                        rows={twitterRules}
                        fetchTwitterRules={fetchTwitterRules}
                        setIsBackdropShown={setIsBackdropShown}
                    />
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={isBackdropShown} onClick={() => setIsBackdropShown(false)}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}