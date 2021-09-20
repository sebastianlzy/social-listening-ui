/*global FB, a*/
import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import Title from "../common/Title";
import InputFieldWithButton from "../common/InputFieldWithButton";
import {updateMLConfiguration} from "./MLConfiguration";


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

export default function MlConfiguration() {

    const {setNotificationMessage, setIsBackdropShown} = useBackdropContext()
    const [positiveSentimentThreshold, setPositiveSentimentThreshold] = React.useState("");
    const [negativeSentimentThreshold, setNegativeSentimentThreshold] = React.useState("");

    const classes = useStyles();


    const handleInputChange = (inputType) => (e) => {
        const registry = {
            "positiveSentimentThreshold": setPositiveSentimentThreshold,
            "negativeSentimentThreshold": setNegativeSentimentThreshold,
        }
        try {
            registry[inputType](e.target.value)
        } catch (e) {
            console.error(e)
        }
    }

    const handleSubmit = (submitType, submitValue) => async ()  => {
        const registry = {
            "setPositiveSentimentThreshold": updateMLConfiguration,
            "setNegativeSentimentThreshold": updateMLConfiguration
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

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper className={classes.paper}>
                        <div >
                            <Title>Comprehend</Title>
                        </div>
                        <InputFieldWithButton
                            inputValue={positiveSentimentThreshold}
                            isDisabled={!positiveSentimentThreshold}
                            label="Positive Sentiment Threshold"
                            handleChange={handleInputChange("positiveSentimentThreshold")}
                            handleSubmit={handleSubmit("setPositiveSentimentThreshold", positiveSentimentThreshold)}
                            btnText="Update"
                        />
                        <InputFieldWithButton
                            inputValue={negativeSentimentThreshold}
                            isDisabled={!negativeSentimentThreshold}
                            label="Negative Sentiment Threshold"
                            handleChange={handleInputChange("negativeSentimentThreshold")}
                            handleSubmit={handleSubmit("setNegativeSentimentThreshold", positiveSentimentThreshold)}
                            btnText="Update"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}