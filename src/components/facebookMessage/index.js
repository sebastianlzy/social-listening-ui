/*global FB, a*/
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import Title from "../common/Title";
import {useLocation} from "react-router-dom";


const useStyles = makeStyles((theme) => ({

    container: {
        padding: theme.spacing(2)
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
    },
    subscribeToFBWebhookBtn: {
        paddingTop: theme.spacing(2),
    },
    userAccessTokenText: {
        paddingTop: theme.spacing(2),
    },

}));


function useQuery() {
    return new URLSearchParams(useLocation().search);
}


export default function Facebook(props) {

    const {setIsBackdropShown} = useBackdropContext()
    const [s3Url, setS3Url] = React.useState(false);
    const [textId, setTextId] = React.useState(false);

    let query  = useQuery()

    useEffect(() => {
        setS3Url(query.get("s3Url"))
        setTextId(query.get("textId"))

    }, [])


    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>

                    <Paper className={classes.paper}>
                        <div >
                            <Title>{s3Url}</Title>
                            <span>{textId}</span>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}