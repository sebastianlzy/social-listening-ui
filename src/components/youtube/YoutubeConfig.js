import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Title from '../common/Title'
import updateYoutubeClientId from './updateYoutubeClientId'
import getYoutubeClientId from './getYoutubeClientId'
import updateYoutubeClientSecret from './updateYoutubeClientSecret'
import getYoutubeRedirectUrl from './getYoutubeRedirectUrl'
import updateYoutubeQuery from './updateYoutubeQuery'
import getYoutubeQuery from './getYoutubeQuery'

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


function YoutubeConfig(props) {
    const {setNotificationMessage, setIsBackdropShown} = props
    
    const classes = useStyles();
    const [ytClientId, setYtClientId] = React.useState("");
    const [ytClientSecret, setYtClientSecret] = React.useState("");
    const [ytRedirectUrl, setYtRedirectUrl] = React.useState("");
    const [ytQuery, setYtQuery] = React.useState("");
    
    const handleYTAuth = (e) => {
        e.preventDefault()
        var redirectCallbackUri = encodeURIComponent(ytRedirectUrl)
        var redirectString = "https://accounts.google.com/o/oauth2/v2/auth?"
        redirectString += "scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&"
        redirectString += "access_type=offline&"
        redirectString += "include_granted_scopes=true&"
        redirectString += `redirect_uri=${redirectCallbackUri}&`
        redirectString += "response_type=code&"
        redirectString += `client_id=${ytClientId}`
        console.log(redirectString)
        console.log(this.props)
        this.props.history.push(redirectString)
    }
    
    const handleClientIdChange = (e) => {
        const clientId = e.target.value
        setYtClientId(clientId)
    }

    const handleClientIdSubmit = (e) => {
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
    
    const handleClientSecretChange = (e) => {
        const clientSecret = e.target.value
        setYtClientSecret(clientSecret)
    }

    const handleClientSecretSubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        updateYoutubeClientSecret(ytClientSecret)
            .then(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Value updated")
            })
            .catch(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Value not updated")
            })

    }
    
    const handleQueryChange = (e) => {
        const query = e.target.value
        setYtQuery(query)
    }

    const handleQuerySubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        updateYoutubeQuery(ytQuery)
            .then(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Query updated")
            })
            .catch(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Query not updated")
            })

    }
    
    useEffect(() => {
        async function getClientId() {
            const ytClientId = await getYoutubeClientId()
            setYtClientId(ytClientId)
        }
        setIsBackdropShown(true)
        getClientId();
        setIsBackdropShown(false)
    }, [])
    
    useEffect(() => {
        async function getYtRedirectUrl() {
            const ytRedirectUrl = await getYoutubeRedirectUrl()
            setYtRedirectUrl(ytRedirectUrl)
        }
        setIsBackdropShown(true)
        getYtRedirectUrl();
        setIsBackdropShown(false)
    }, [])
    
     useEffect(() => {
        async function getQuery() {
            const ytQuery = await getYoutubeQuery()
            setYtQuery(ytQuery)
            
        }
        setIsBackdropShown(true)
        getQuery();
        setIsBackdropShown(false)
    }, [])

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update YouTube Client ID </Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="ytclientid">YouTube Client ID</InputLabel>
                        <FilledInput
                            id="ytclientid"
                            value={ytClientId}
                            onChange={handleClientIdChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={ytClientId.length < 5}
                            onClick={handleClientIdSubmit}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Paper>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update YouTube Client Secret </Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="ytclientsecret">YouTube Client Secret</InputLabel>
                        <FilledInput
                            id="ytclientsecret"
                            value={ytClientSecret}
                            onChange={handleClientSecretChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={ytClientSecret.length < 5}
                            onClick={handleClientSecretSubmit}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Paper>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update YouTube Search Query </Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="ytquery">Terms to search on YouTube videos, channels, or playlists. Use | if multiple</InputLabel>
                        <FilledInput
                            id="ytquery"
                            value={ytQuery}
                            onChange={handleQueryChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleQuerySubmit}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Paper>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Youtube Authorization Redirect URI </Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="ytredirecturl">Redirect URI</InputLabel>
                        <FilledInput
                            id="ytredirecturl"
                            value={ytRedirectUrl}
                            disabled={true}
                        />
                    </FormControl>
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

module.exports = withRouter(YoutubeConfig)