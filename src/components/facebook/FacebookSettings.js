import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import updateFBAppChallenge from "./updateFBAppChallenge";
import updateFBAppSecretID from "./updateFBAppSecretID";
import Title from '../common/Title'
import moment from "moment";
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import {updateFBWebhookURL, getFBConfiguration} from "./updateFBConfiguration";
import get from "lodash/get"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        paddingBottom: theme.spacing(2)
    },
    paper: {
        width: '100%',
        paddingBottom: theme.spacing(4)
    },
    title: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    inputTextApiKey: {
        paddingLeft: theme.spacing(2),

    },
    divSubmitBtn: {
        display: "flex",
        alignItems: "center",
    }
}));

const InputFieldWithButton = (props) => {
    const classes = useStyles();
    const {inputValue, handleChange, handleSubmit, isDisabled, label, btnText} = props
    return (
        <Grid container spacing={4}>
            <Grid item xs={10}>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="facebookKey-appId">{label}</InputLabel>
                        <FilledInput
                            id="facebookKey-appId"
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </FormControl>
                </div>
            </Grid>
            <Grid item xs={2} className={classes.divSubmitBtn}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={isDisabled}
                    onClick={handleSubmit}
                    size="large"
                >
                    {btnText}
                </Button>
            </Grid>

        </Grid>
    )
}


export default function FacebookSettings(props) {

    const {setIsBackdropShown, setNotificationMessage} = useBackdropContext()
    const {appId, fbAppIdCacheKey} = props
    const [FBAppID, setFBAppID] = React.useState(appId);
    const [FBAppSecretId, setFBAppSecretId] = React.useState("");
    const [FBAppChallenge, setFBAppChallenge] = React.useState("");
    const [FBWebhookURL, setFBWebhookURL] = React.useState("");
    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            const fbConfiguration = await getFBConfiguration()
            console.log(fbConfiguration)
            setFBWebhookURL(get(fbConfiguration, "webhookURL", ""))
        }

        fetchData();
    }, [])

    const handleInputChange = (inputType) => (e) => {
        const registry = {
            fbAppId: setFBAppID,
            fbAppSecretId: setFBAppSecretId,
            fbAppChallenge: setFBAppChallenge,
            fbWebhookURL: setFBWebhookURL,
        }
        try {
            registry[inputType](e.target.value)
        } catch (e) {
            console.error(e)
        }
    }

    const handleSubmit = (submitType, submitValue) => async ()  => {
        const registry = {
            updateFBWebhookURL,
            updateFBAppChallenge,
            updateFBAppSecretID,
            updateFBAppID
        }
        setIsBackdropShown(true)
        try {
            await registry[submitType](submitValue)
            setNotificationMessage(`${submitType} successfully updated`)
        } catch (e) {
            setNotificationMessage("ERROR" + e.message)
            console.error(e)
        }
        setIsBackdropShown(false)

    }

    const updateFBAppID = () => {
        localStorage.setItem(fbAppIdCacheKey, JSON.stringify({
            appId: FBAppID,
            expiry: moment().add(1, 'd')
        }))
        window.location.reload()
    }

    return (
        <div className={classes.root}>

            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Facebook settings</Title>
                </div>

                <InputFieldWithButton
                    inputValue={FBAppID}
                    isDisabled={!FBAppID || FBAppID.length < 5}
                    label="FB App ID"
                    handleChange={handleInputChange("fbAppId")}
                    handleSubmit={handleSubmit("updateFBAppID", FBAppID)}
                    btnText="Update"
                />
                <InputFieldWithButton
                    inputValue={FBWebhookURL}
                    isDisabled={!FBWebhookURL || FBWebhookURL.length < 5}
                    label="FB webhook URL"
                    handleChange={handleInputChange("fbWebhookURL")}
                    handleSubmit={handleSubmit("updateFBWebhookURL", FBWebhookURL)}
                    btnText="Update"
                />

                <InputFieldWithButton
                    inputValue={FBAppSecretId}
                    isDisabled={!FBAppSecretId || FBAppSecretId.length < 5}
                    label="FB App Secret ID"
                    handleChange={handleInputChange("fbAppSecretId")}
                    handleSubmit={handleSubmit("updateFBAppSecretID", FBAppSecretId)}
                    btnText="Update"
                />
                <InputFieldWithButton
                    inputValue={FBAppChallenge}
                    isDisabled={!FBAppChallenge || FBAppChallenge.length < 5}
                    label="FB App Challenge"
                    handleChange={handleInputChange("fbAppChallenge")}
                    handleSubmit={handleSubmit("updateFBAppChallenge", FBAppChallenge)}
                    btnText="Update"
                />
            </Paper>

        </div>
    );
}
