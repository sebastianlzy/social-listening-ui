import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Title from '../common/Title'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import addTwitterRule from "./addTwitterRule";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 500,
        },
    },
    submitButton: {
        marginTop: theme.spacing(3),
    },
    errorMsg: {
        marginTop: theme.spacing(3),
        color: theme.palette.error.dark
    }
}));



export default function SimpleModal(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const {handleCloseAddRuleModal, openAddRuleModal, fetchTwitterRules, setIsBackdropShown} = props
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsBackdropShown(true)

        const value = get(event, 'target.0.value')
        const tag = get(event, 'target.1.value')

        if (isEmpty(value) || isEmpty(tag)) {

            setErrorMsg("Value or Tag cannot be empty")
            setIsBackdropShown(false)
            return
        }

        addTwitterRule(value, tag)
            .then((resp) => {
                fetchTwitterRules()
                handleCloseAddRuleModal()
            })
            .catch((e) => {
                event.preventDefault();
                setErrorMsg(JSON.stringify(e))
            })
            .then(() => setIsBackdropShown(false))

    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <Title>Add new rule</Title>
            <form onSubmit={handleSubmit} className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" label="Value" />
                <TextField id="standard-basic" label="Tag" />
                <Button className={classes.submitButton}
                    variant="contained" color="primary" type="submit">Submit</Button>
            </form>

            <Typography variant="subtitle2" className={classes.errorMsg}>
                {errorMsg}
            </Typography>
        </div>
    );

    return (
        <Modal
            open={openAddRuleModal}
            onClose={handleCloseAddRuleModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    );
}