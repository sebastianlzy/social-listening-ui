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


export default function TwitterKey(props) {
    const {setNotificationMessage, setIsBackdropShown} = props
    
    const classes = useStyles();
    const [twBearer, setTwBearer] = React.useState("");
    const [twKey, setTwKey] = React.useState("");
    const [twSecret, setTwSecret] = React.useState("");
    const [twToken, setTwToken] = React.useState("");
    const [twTokenSecret, setTwTokenSecret] = React.useState("");

    const handleChange = (e) => {
        const key = e.target.value
        const id = e.target.id
        console.log(id)
        console.log(key)
        switch(id) {
          case "twbearer":
            setTwBearer(key)
            break;
          case "twkey":
            setTwKey(key)
            break;
          case "twsecret":
            setTwSecret(key)
            break;
          case "twtoken":
            setTwToken(key)
            break;
          case "twtokensecret":
            setTwTokenSecret(key)
        } 
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        const mode = e.target.twMode
        console.log(mode)
        var valueToUpdate = ""
        switch(mode) {
          case "bearer":
            valueToUpdate = twBearer;
            break;
          case "key":
            valueToUpdate = twKey;
            break;
          case "secret":
            valueToUpdate = twSecret;
            break;
          case "token":
            valueToUpdate = twToken;
            break;
          case "token_secret":
            valueToUpdate = twTokenSecret;
        } 
        updateTwitterKey(valueToUpdate, mode)
            .then(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Value updated")
            })
            .catch(() => {
                setIsBackdropShown(false)
                setNotificationMessage("Value not updated")
            })

    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update Twitter API Credentials </Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twbearer">Twitter Bearer Token</InputLabel>
                        <FilledInput
                            id="twbearer"
                            value={twBearer}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={twBearer.length < 5}
                            onClick={(e) => handleSubmit("bearer", e)}
                        >
                            Update
                        </Button>
                    </div>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twkey">Twitter Consumer (API) Key</InputLabel>
                        <FilledInput
                            id="twkey"
                            value={twKey}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={twKey.length < 5}
                            onClick={(e) => handleSubmit("key", e)}
                        >
                            Update
                        </Button>
                    </div>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twkey">Twitter Consumer (API) Secret</InputLabel>
                        <FilledInput
                            id="twsecret"
                            value={twSecret}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={twSecret.length < 5}
                            onClick={(e) => handleSubmit("secret", e)}
                        >
                            Update
                        </Button>
                    </div>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twkey">Twitter Access Token</InputLabel>
                        <FilledInput
                            id="twtoken"
                            value={twToken}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={twToken.length < 5}
                            onClick={(e) => handleSubmit("token", e)}
                        >
                            Update
                        </Button>
                    </div>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="twkey">Twitter Access Token Secret</InputLabel>
                        <FilledInput
                            id="twtokensecret"
                            value={twTokenSecret}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={twTokenSecret.length < 5}
                            onClick={(e) => handleSubmit("token_secret", e)}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Paper>

        </div>
    );
}
