import React from 'react';
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


    const {appId, fbAppIdCacheKey} = props
    const [FBAppID, setFBAppID] = React.useState(appId);
    const [FBAppSecretId, setFBAppSecretId] = React.useState("");
    const [FBAppChallenge, setFBAppChallenge] = React.useState("");
    const classes = useStyles();

    const handleInputChange = (inputType) => (e) => {
        const registry = {
            fbAppId: setFBAppID,
            fbAppSecretId: setFBAppSecretId,
            fbAppChallenge: setFBAppChallenge,
        }
        try {
            registry[inputType](e.target.value)
        } catch (e) {
            console.error(e)
        }
    }

    const handleFBAppIDSubmit = () => {
        localStorage.setItem(fbAppIdCacheKey, JSON.stringify({
            appId: FBAppID,
            expiry: moment().add(1, 'd')
        }))
        window.location.reload()
    }

    const handleFBAppChallengeSubmit = async () => {
        try {
            await updateFBAppChallenge(FBAppChallenge)
        } catch (e) {
            console.error(e)
        }
    }

    const handleFBAppSecretIDSubmit = async () => {
        try {
            await updateFBAppSecretID(FBAppSecretId)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className={classes.root}>

            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Facebook settings</Title>
                </div>

                <InputFieldWithButton
                    inputValue={FBAppID}
                    isDisabled={FBAppID && FBAppID.length < 5}
                    label="FB App ID"
                    handleChange={handleInputChange("fbAppId")}
                    handleSubmit={handleFBAppIDSubmit}
                    btnText="Update"
                />
                <InputFieldWithButton
                    inputValue={FBAppSecretId}
                    isDisabled={FBAppSecretId && FBAppSecretId.length < 5}
                    label="FB App Secret ID"
                    handleChange={handleInputChange("fbAppSecretId")}
                    handleSubmit={handleFBAppSecretIDSubmit}
                    btnText="Update"
                />
                <InputFieldWithButton
                    inputValue={FBAppChallenge}
                    isDisabled={FBAppChallenge && FBAppChallenge.length < 5}
                    label="FB App Challenge"
                    handleChange={handleInputChange("fbAppChallenge")}
                    handleSubmit={handleFBAppChallengeSubmit}
                    btnText="Update"
                />
            </Paper>

        </div>
    );
}
