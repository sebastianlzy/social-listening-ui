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
    const {setNotificationMessage, setIsBackdropShown, mode} = props
    var displayMode = ""
    switch(mode) {
      case "bearer":
        displayMode = "Twitter Bearer Token"
        break;
      case "key":
        displayMode = "Twitter API (Consumer) Key"
        break;
      case "secret":
        displayMode = "Twitter API (Consumer) Secret"
        break;
      case "token":
        displayMode = "Twitter Access Token"
        break;
      case "token_secret":
        displayMode = "Twitter Access Token Secret"
    } 
    const classes = useStyles();
    const [twKeyValue, setTwKeyValue] = React.useState("");

    const handleChange = (e) => {
        const key = e.target.value
        setTwKeyValue(key)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsBackdropShown(true)
        updateTwitterKey(twKeyValue, mode)
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
                    <Title> {"Update" + displayMode}</Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor={"tw" + mode}>{displayMode}</InputLabel>
                        <FilledInput
                            id={"tw" + mode}
                            value={twKeyValue}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={twKeyValue.length < 5}
                            onClick={handleSubmit}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </Paper>

        </div>
    );
}
