import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import Dashboard from './components/Dashboard'
import Facebook from './components/Facebook'
import Layout from "./layout";
import Twitter from './components/twitter'
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import {withAuthenticator} from '@aws-amplify/ui-react';
import React from 'react';
import Snackbar from "@material-ui/core/Snackbar";


Amplify.configure(awsconfig);

function App() {

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

    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/dashboard">
                        <Layout>
                            <Dashboard/>
                        </Layout>
                    </Route>
                    <Route path="/settings/twitter">
                        <Layout>
                            <Twitter
                                setNotificationMessage={setNotificationMessage}
                            />
                        </Layout>
                    </Route>
                    <Route path="/settings/facebook">
                        <Layout>
                            <Facebook/>
                        </Layout>
                    </Route>
                    <Route path="/">
                        <Layout>
                            <Dashboard/>
                        </Layout>
                    </Route>
                </Switch>
            </Router>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMsg}
            />
        </div>
    );
}

export default withAuthenticator(App);
