import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {makeStyles} from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";

const BackdropContext = React.createContext({
    setIsBackdropShown: () => {
    },
    setNotificationMessage: () => {
    }
});

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
}));

export default function BackdropContextProvider(props) {


    const [isBackdropShown, setIsBackdropShown] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
        setSnackbarMsg("")
    }

    const setNotificationMessage = (message) => {
        setOpenSnackbar(true)
        setSnackbarMsg(message)
    }

    const classes = useStyles();

    return (
        <BackdropContext.Provider value={{setIsBackdropShown, setNotificationMessage}}>
            {props.children}

            <Backdrop
                className={classes.backdrop}
                open={isBackdropShown}
                onClick={() => setIsBackdropShown(false)}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMsg}
            />
        </BackdropContext.Provider>
    );
}

export const useBackdropContext = () => React.useContext(BackdropContext);