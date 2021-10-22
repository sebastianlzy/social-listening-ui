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

    const fbAppIdCacheKey = "fbAppId"
    //const fbDefaultAppId = "PLACEHOLDER"
    const getAppId = () => {
        const itemStr = localStorage.getItem(fbAppIdCacheKey)
        if (!itemStr) {
            return getAppIdFromServer()
        }


        const item = JSON.parse(itemStr)
        if (moment().isAfter(item.expiry)) {
            localStorage.removeItem(fbAppIdCacheKey)
            return getAppIdFromServer()
        }

        return item.appId
    }
    
    const getAppIdFromServer = () => {
        return get(getFBConfiguration(), 'data.body.webhookURL')
    }

    const [appId] = React.useState(getAppId());
    

    const FBinit = () => {
        console.log("FB init")
        console.log(appId)
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
        console.log("fbAsyncInit")
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
                console.log(response.authResponse)
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
        console.log("isFBInit: " + isFBInit)
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
        console.log(userID)
        console.log(accessToken)
        try {
            const startCrawlerResponse = await postStartCrawlerRequestToLambda(userID, accessToken)
            setMessageToDisplay(startCrawlerResponse.data.body)
        } catch (e) {
            console.log(e)
        }
        setIsBackdropShown(false)
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
                            <div className="fb-login-button" data-width="" data-size="large"
                                 data-button-type="continue_with" data-onlogin="handleOnFbLogin()"
                                 data-layout="default" data-auto-logout-link="true" data-use-continue-as="false"
                                 data-scope="pages_manage_metadata,pages_manage_engagement,pages_show_list,pages_read_user_content,instagram_manage_comments"
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
                                onClick={startFBCrawler} >Start crawler
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