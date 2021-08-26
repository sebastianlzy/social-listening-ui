import './App.css';
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import Dashboard from './components/Dashboard'
import Facebook from './components/Facebook'
import Layout from "./layout";
import Twitter from './components/Twitter'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {withAuthenticator} from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function App() {
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
                            <Twitter/>
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
        </div>
    );
}

export default withAuthenticator(App);
