import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Title from '../common/Title'
import updateYoutubeClientId from './updateYoutubeClientId'
import getYoutubeClientId from './getYoutubeClientId'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
    },
    title: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    inputTextApiKey: {
        padding: theme.spacing(2),
    },
    divSubmitBtn: {
        paddingTop: theme.spacing(2),
        textAlign: "right"
    }
}));


export default function TwitterKey(props) {
    const {setNotificationMessage, setIsBackdropShown} = props
    
    const classes = useStyles();
    const [ytClientId, setYtClientId] = React.useState("");

    const handleChange = (e) => {
        const clientId = e.target.value
 
        setYtClientId(clientId)
    }
    
    const handleYTAuth = (e) => {
        e.preventDefault()
        var redirectCallbackUri = encodeURIComponent(`https:// + ${(new URL(window.location.href)).hostname}`)
        var redirectString = "https://accounts.google.com/o/oauth2/v2/auth?"
        redirectString += "scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&"
        redirectString += "access_type=offline&"
        redirectString += "include_granted_scopes=true&"
        redirectString += `redirect_uri=${redirectCallbackUri}&`
        redirectString += "response_type=code&"
        redirectString += `client_id=${ytClientId}`
        this.props.history.push(redirectString)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        updateYoutubeClientId(ytClientId)
            .then(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Value updated")
            })
            .catch(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Value not updated")
            })

    }
    
    useEffect(() => {
        async function fetchData() {
            const ytClientId = await getYoutubeClientId()
            console.log(ytClientId)
            setYtClientId(ytClientId)
        }

        fetchData();
    }, [])

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update YouTube Client ID </Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twbearer">YouTube Client ID</InputLabel>
                        <FilledInput
                            id="ytclientid"
                            value={ytClientId}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={ytClientId.length < 5}
                            onClick={handleSubmit}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Paper>
            <div className={classes.divSubmitBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleYTAuth}
                >
                    Authorize for Youtube
                </Button>
            </div>

        </div>
    );
}
