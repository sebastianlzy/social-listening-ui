/*global FB, a*/
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import Title from "../common/Title";
import {useLocation} from "react-router-dom";
import Button from "@material-ui/core/Button";
import updateTwitterKey from "../twitter/updateTwitterKey";
import postFacebookMessage from "./postFacebookMessage";


const useStyles = makeStyles((theme) => ({

    container: {
        padding: theme.spacing(2)
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
    },
    divSubmitBtn: {
        paddingTop: theme.spacing(2)
    }

}));


function useQuery() {
    return new URLSearchParams(useLocation().search);
}


export default function MessageReply(props) {

    const {setIsBackdropShown, setNotificationMessage} = useBackdropContext()
    const [originalText, setOriginalText] = React.useState("");
    const [postId, setPostId] = React.useState("");
    const [platform, setPlatform] = React.useState("");
    const [message, setMessage] = React.useState("");

    let query  = useQuery()

    useEffect(() => {
        setOriginalText(query.get("originalText"))
        setPostId(query.get("postId"))
        setPlatform(query.get("platform"))

    }, [])


    const classes = useStyles();

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        postFacebookMessage(platform,{
            message,
            postId,
            originalText,
            platform
        })
            .then(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Message posted")
            })
            .catch(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Message not posted")
            })
    }

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>

                    <Paper className={classes.paper}>
                        <div >
                            <Title>"{originalText}"</Title>

                            <TextField
                                id="filled-multiline-flexible"
                                label="Reply message"
                                multiline
                                maxRows={4}
                                value={message}
                                onChange={handleChange}
                                variant="filled"
                                fullWidth
                            />
                        </div>
                        <div className={classes.divSubmitBtn}>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={message.length < 5}
                                onClick={handleSubmit}
                            >
                                Post message
                            </Button>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}