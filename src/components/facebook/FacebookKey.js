import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import Button from '@material-ui/core/Button';
import Title from '../common/Title'
import moment from "moment";

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

    const {appId, fbAppIdCacheKey} = props
    const [inputAppId, setInputAppId] = React.useState(appId);

    const handleChange = (e) => {
        setInputAppId(e.target.value)
    }

    const handleSubmit = (e) => {
        localStorage.setItem(fbAppIdCacheKey, JSON.stringify({
            appId: inputAppId,
            expiry: moment().add(1, 'd')
        }))
        window.location.reload()
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
                            value={inputAppId}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <div className={classes.divSubmitBtn}>
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={inputAppId && inputAppId.length < 5}
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
