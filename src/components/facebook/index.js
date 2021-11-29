/*global FB, a*/
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Button from "@material-ui/core/Button";
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import FacebookSettings from "./FacebookSettings";
import {getFBConfiguration} from "./FBConfiguration";
import Title from "../common/Title";
import moment from "moment";
import get from 'lodash/get'

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
    fbActionButtonContainer: {
        paddingTop: theme.spacing(2),
    }
}));

export default function Facebook() {
    
    const {setIsBackdropShown} = useBackdropContext()
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [messageToDisplay, setMessageToDisplay] = useState([]);
    const [isFBInit, setIsFBInit] = React.useState(false);
    const [userID, setUserID] = React.useState("0");
    const [accessToken, setAccessToken] = React.useState("0");
    const [appId, setAppId] = React.useState();
    
    
    const fbAppIdCacheKey = "fbAppId"

    const getAppId = async () => {
        const itemStr = localStorage.getItem(fbAppIdCacheKey)
        if (!itemStr) {
            const freshAppId = await getAppIdFromServer()
            setIsFBInit(false)
            setAppId(freshAppId)
            return freshAppId
        }

        const item = JSON.parse(itemStr)
        if (moment().isAfter(item.expiry)) {
            localStorage.removeItem(fbAppIdCacheKey)
            const freshAppId = await getAppIdFromServer()
            setIsFBInit(false)
            setAppId(freshAppId)
            return freshAppId
        }

        return item.appId
    }
    
    const getAppIdFromServer = async () => {
        const response = await getFBConfiguration()
        return get(response, 'fbAppId')
    }

    const FBinit = () => {
        FB.init({
            appId            : appId,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v12.0',
            status: true
        });
    }

    const FBAsyncInit = () => {
        setIsBackdropShown(true)
        if (window.FB !== undefined) {
            FBinit()
            setIsFBInit(true)
            setFBCreds()
            setIsBackdropShown(false)
            return
        }

        window.fbAsyncInit = function() {
            FBinit()
            setIsFBInit(true)
            setFBCreds()
            setIsBackdropShown(false)
        };
    }
    
   const setFBCreds = () => {
        FB.getLoginStatus(async function (response) {
            if (response.status === 'connected') {
                console.log("connected")
                setUserID(response.authResponse.userID)
                setAccessToken(response.authResponse.accessToken)
            }
        });
   }


    useEffect(() => {
        window.handleOnFbLogin = () => {
            setFBCreds()
        }
    }, [])

    useEffect(() => {
        async function fetchAppId() {
            const myAppId = await getAppId()
            setAppId(myAppId)
        }
        fetchAppId()

    }, [])

    useEffect(() => {
        if(appId === undefined) return;
        if (isFBInit) {
            setIsBackdropShown(false)
            return
        }

        FBAsyncInit()
    }, [appId])

    const subscribeToFBWebhook = async () => {
        setIsBackdropShown(true)
        try {
            const webhookSubscriptionResponse = await postUserAccessTokenToLambda(userID, accessToken)
            setMessageToDisplay(webhookSubscriptionResponse.data.body)
        } catch (e) {
            console.log(e)
        }
        setIsBackdropShown(false)
        setOpenSnackbar(true)
    }
    const startFBCrawler = async () => {
        setIsBackdropShown(true)
        try {
            const startCrawlerResponse = await postStartCrawlerRequestToLambda(userID, accessToken)
            setMessageToDisplay(startCrawlerResponse.data.body)
        } catch (e) {
            console.log(e)
        }
        setIsBackdropShown(false)
    }
    const startIGCrawler = async () => {
        setIsBackdropShown(true)
        try {
            const startCrawlerResponse = await postStartIGCrawlerRequestToLambda(userID, accessToken)
            setMessageToDisplay(startCrawlerResponse.data.body)
        } catch (e) {
            console.log(e)
        }
        setIsBackdropShown(false)
    }
    const postUserAccessTokenToLambda = (userID, userAccessToken) => {
        const apiName = 'nvsocial';
        const path = '/settings/facebook/subscribeWebhook';
        const config = {
            response: true,
            body: {
                userID: userID,
                userAccessToken: userAccessToken
            }
        };

        return API.post(apiName, path, config)
    }
    const postStartCrawlerRequestToLambda = (fbUserID, fbAccessToken) => {
        const apiName = 'nvsocial';
        const path = '/settings/facebook/startCrawler';
        const config = {
            response: true,
            body: {
                userID: fbUserID,
                userAccessToken: fbAccessToken
            }
        };

        return API.post(apiName, path, config)
    }
     const postStartIGCrawlerRequestToLambda = (fbUserID, fbAccessToken) => {
        const apiName = 'nvsocial';
        const path = '/settings/facebook/startIGCrawler';
        const config = {
            response: true,
            body: {
                userID: fbUserID,
                userAccessToken: fbAccessToken
            }
        };

        return API.post(apiName, path, config)
    }

    const classes = useStyles();

    return (

        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <FacebookSettings
                        appId={appId}
                        fbAppIdCacheKey={fbAppIdCacheKey}
                    />
                    <Paper className={classes.paper}>
                        <div >
                            <Title>Login to facebook</Title>
                        </div>
                        <div>
                            {/*<div className="fb-login-button" data-width="" data-size="large"
                                 data-button-type="continue_with" data-onlogin="handleOnFbLogin()"
                                 data-layout="default" data-auto-logout-link="true" data-use-continue-as="false"
                                 data-scope="pages_manage_metadata,pages_manage_engagement,pages_show_list,pages_read_user_content,instagram_manage_comments,instagram_basic"
                            />*/}
                            <div className="fb-login-button" data-width="" data-size="large"
                                 data-button-type="continue_with" data-onlogin="handleOnFbLogin()"
                                 data-layout="default" data-auto-logout-link="true" data-use-continue-as="false"
                                 data-scope="pages_manage_metadata,pages_show_list,pages_read_user_content,instagram_manage_comments,instagram_basic,pages_manage_engagement"
                            />
                        </div>
                        <div className={classes.fbActionButtonContainer}>
                            <Button 
                                variant="contained"
                                onClick={subscribeToFBWebhook}>Subscribe to webhook
                            </Button>
                            <span> or </span>
                            <Button 
                                variant="contained"
                                onClick={startFBCrawler} >Start FB crawler
                            </Button>
                        </div>
                        <div className={classes.fbActionButtonContainer}>
                            <Button 
                                variant="contained"
                                onClick={startIGCrawler} >Start IG crawler
                            </Button>
                        </div>
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={() => setOpenSnackbar(false)}
                            message={messageToDisplay}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}