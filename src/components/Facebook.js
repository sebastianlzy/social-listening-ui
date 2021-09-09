/*global FB, a*/
import React, {useState, useEffect} from "react";
import {API} from "aws-amplify";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme) => ({

    container: {
        padding: theme.spacing(2)
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2),
    },
    getUserAccessTokenBtn: {
        paddingTop: theme.spacing(2),
    },
    userAccessTokenText: {
        paddingTop: theme.spacing(2),
    }


}));

export default function Facebook() {



    const [userAccessToken, setUserAccessToken] = useState("");
    const [isFBLogin, setIsFBLogin] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [webhookSubscriptionResult, setWebhookSubscriptionResult] = useState([]);


    useEffect(() => {

        setTimeout(() => {
            FB.getLoginStatus(async function (response) {
                if (response.status === 'connected') {
                    setIsFBLogin(true)
                }
            });
        })

    }, [])

    const getUserAccessToken = (e) => {
        e.preventDefault()
        FB.getLoginStatus(async function (response) {
            if (response.status === 'connected') {
                const userAccessToken = response.authResponse.accessToken;
                const userID = response.authResponse.userID
                const webhookSubscriptionResponse = await postUserAccessTokenToLambda(userID, userAccessToken)
                setWebhookSubscriptionResult(webhookSubscriptionResponse.data.body)
            }
        });

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

    const copyToClipboard = () => {
        setOpenSnackbar(true)
        navigator.clipboard.writeText(userAccessToken)
    }

    const renderGetAccessToken = () => {
        return (
            <div className={classes.getUserAccessTokenBtn}>
                <div>
                    <Button variant="contained" color="primary" onClick={getUserAccessToken}>
                        Get user access token
                    </Button>
                </div>
                <div className={classes.userAccessTokenText}>
                    {userAccessToken !== "" ? (
                        <TextField
                            onClick={copyToClipboard}
                            fullWidth disabled
                            value={userAccessToken}
                        />
                    ) : null}
                </div>
            </div>
        )
    }


    const classes = useStyles();
    return (

        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>

                    <Paper className={classes.paper}>
                        <div>
                            <div className="fb-login-button" data-width="" data-size="medium" data-button-type="continue_with"
                                 data-layout="default" data-auto-logout-link="false" data-use-continue-as="false" data-scope="pages_manage_metadata,pages_messaging" />
                        </div>
                        {isFBLogin ? renderGetAccessToken() : null}
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={() => setOpenSnackbar(false)}
                            message={"Copied"}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}