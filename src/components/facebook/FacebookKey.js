import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Title from '../common/Title'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        paddingBottom: theme.spacing(2)
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


export default function FacebookKey(props) {
    const classes = useStyles();
    const [appId, setAppId] = React.useState(props.appId);

    const handleChange = (e) => {
        const appId = e.target.value
        setAppId(appId)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("--------------------43-handleSubmit-appId---------------------------")
        console.log(appId)
        console.log("--------------------43-handleSubmit-appId--------------------------")

    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Title> Update Facebook App ID</Title>
                </div>
                <div className={classes.inputTextApiKey}>
                    <FormControl fullWidth variant="filled">
                        <InputLabel htmlFor="facebookKey-appId">App ID</InputLabel>
                        <FilledInput
                            id="facebookKey-appId"
                            value={appId}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={appId && appId.length < 5}
                            onClick={handleSubmit}
                        >
                            Update App ID
                        </Button>
                    </div>
                </div>
            </Paper>

        </div>
    );
}
