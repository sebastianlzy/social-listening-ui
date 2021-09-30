/*global FB, a*/
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import FacebookSettings from "./FacebookSettings";
import Title from "../common/Title";
import moment from "moment";

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

export default function Facebook() {

    const {setIsBackdropShown} = useBackdropContext()
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [webhookSubscriptionResult, setWebhookSubscriptionResult] = useState([]);
    const [isFBInit, setIsFBInit] = React.useState(false);

    const fbAppIdCacheKey = "fbAppId"
    const fbDefaultAppId = "579539346533486"
    const getAppId = () => {
        const itemStr = localStorage.getItem(fbAppIdCacheKey)
        if (!itemStr) {
            return fbDefaultAppId
        }


        const item = JSON.parse(itemStr)
        if (moment().isAfter(item.expiry)) {
            localStorage.removeItem(fbAppIdCacheKey)
            return fbDefaultAppId
        }

        return item.appId
    }

    const [appId] = React.useState(getAppId());
    

    const FBinit = () => {
        console.log("FB init")
        console.log(appId)
        FB.init({
            appId            : appId,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v11.0',
            status: true
        });
    }

    const FBAsyncInit = () => {
        setIsBackdropShown(true)
        console.log("fbAsyncInit")
        if (window.FB !== undefined) {
            FBinit()
            setIsFBInit(true)
            setIsBackdropShown(false)
            return
        }

        window.fbAsyncInit = function() {
            FBinit()
            setIsFBInit(true)
            setIsBackdropShown(false)
        };
    }


    useEffect(() => {
        window.handleOnFbLogin = () => {
            FB.getLoginStatus(async function (response) {
                if (response.status === 'connected') {
                    console.log(response.authResponse)
                    const {accessToken, userID} = response.authResponse
                    await subscribeToFBWebhook(userID, accessToken)
                }
            });
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

    const subscribeToFBWebhook = async (userID, accessToken) => {
        setIsBackdropShown(true)
        try {
            const webhookSubscriptionResponse = await postUserAccessTokenToLambda(userID, accessToken)
            setWebhookSubscriptionResult(webhookSubscriptionResponse.data.body)
        } catch (e) {
            console.log(e)
        }

        setIsBackdropShown(false)
        setOpenSnackbar(true)
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
                            <Title>Login to facebook and subscribe to webhook</Title>
                        </div>
                        <div>
                            <div className="fb-login-button" data-width="" data-size="large"
                                 data-button-type="continue_with" data-onlogin="handleOnFbLogin()"
                                 data-layout="default" data-auto-logout-link="true" data-use-continue-as="false"
                                 data-scope="pages_manage_metadata,pages_messaging"
                            />
                        </div>
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={() => setOpenSnackbar(false)}
                            message={webhookSubscriptionResult}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}