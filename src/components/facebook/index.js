/*global FB, a*/
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import FacebookKey from "./FacebookKey";
import Title from "../common/Title";

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
    const appId = "183172253917242"



    useEffect(() => {
        if (isFBInit) {
            setIsBackdropShown(false)
            return
        }

        setIsBackdropShown(true)
        console.log("fbAsyncInit")
        window.fbAsyncInit = function() {
            console.log("FB init")
            FB.init({
                appId            : appId,
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v11.0',
                status: true
            });

            setIsFBInit(true)
            setIsBackdropShown(false)
        };

        window.handleOnFbLogin = (resp) => {
            FB.getLoginStatus(async function (response) {
                if (response.status === 'connected') {
                    const {accessToken, userID} = response.authResponse
                    await subscribeToFBWebhook(userID, accessToken)
                }
            });
        }
    }, [])

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
                    <FacebookKey appId={appId}/>
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