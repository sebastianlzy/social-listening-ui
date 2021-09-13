import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import Dashboard from './components/dashboard'
import Facebook from './components/facebook/Facebook'
import Layout from "./layout";
import Twitter from './components/twitter'
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import {withAuthenticator} from '@aws-amplify/ui-react';
import React from 'react';
import BackdropContextProvider from './components/contextProvider/backdropContextProvider'

Amplify.configure(awsconfig);



function App() {



    return (
        <div>
            <BackdropContextProvider>
                <Router>
                    <Switch>
                        <Route path="/dashboard">
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </Route>
                        <Route path="/settings/twitter">
                            <Layout>
                                <Twitter />
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
            </BackdropContextProvider>




        </div>
    );
}

export default withAuthenticator(App);
