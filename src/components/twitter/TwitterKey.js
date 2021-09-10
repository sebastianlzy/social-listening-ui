import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Title from '../common/Title'
import updateTwitterKey from './updateTwitterKey'

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


export default function TwitterRules(props) {
    const {setNotificationMessage, setIsBackdropShown} = props
    const classes = useStyles();
    const [apiKey, setApiKey] = React.useState("");

    const handleChange = (e) => {
        const apiKey = e.target.value
        setApiKey(apiKey)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        updateTwitterKey(apiKey)
            .then(() => {
                setIsBackdropShown(false)
                setNotificationMessage("API key updated")
            })
            .catch(() => {
                setIsBackdropShown(false)
                setNotificationMessage("API key not updated")
            })

    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update Twitter API Key</Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twitterKey-apiKey">API key</InputLabel>
                        <FilledInput
                            id="twitterKey-apiKey"
                            value={apiKey}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={apiKey.length < 5}
                            onClick={handleSubmit}
                        >
                            Update API key
                        </Button>
                    </div>
                </div>
            </Paper>

        </div>
    );
}
