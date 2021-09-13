/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const get = require('lodash/get')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const getTwitterRules = require('./twitterRulesAPI/getTwitterRules')
const addTwitterRule = require('./twitterRulesAPI/addTwitterRule')
const deleteTwitterRules = require('./twitterRulesAPI/deleteTwitterRules')
const getRecentMentions = require("./recentMentionsAPI/getRecentMentions")
const getPageAccessToken = require("./facebookSubscribeWebhookAPI/getPageAccessToken")
const installApp = require("./facebookSubscribeWebhookAPI/installApp")
const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

// declare a new express app
const app = express()
const SecretManagerClient = new SecretsManagerClient({
    region: "ap-southeast-1"
});


app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())


// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
});


/**********************
 * Example get method *
 **********************/

app.get('/settings/:ssn', function (req, res) {
    // Add your code here
    res.json({success: 'get call succeed!', url: req.url});
});

app.get('/settings/:ssn/recentMentions', function (req, res) {

    getRecentMentions()
        .then((recentMentions) => {
            res.json({
                success: 'get call /settings/:ssn/recentMentions succeed!',
                url: req.url,
                body: recentMentions
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'get call /settings/:ssn/recentMentions failed!',
                body: err
            })
        })


});

app.get('/settings/:ssn/rules', function (req, res) {

    return getTwitterRules()
        .then((resp) => {
            res.json({
                msg: 'get call succeed!',
                url: req.url,
                body: get(resp, 'data.data'),
            })
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'get call failed!',
                body: err
            })
        })
});

/****************************
 * Example post method *
 ****************************/

app.post('/settings/:ssn', function (req, res) {

    res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/settings/:ssn/rules', function (req, res) {
    const value = get(req, 'body.value')
    const tag = get(req, 'body.tag')

    return addTwitterRule(value, tag).then(
        (resp) => {
            res.json({
                msg: 'post call succeed!',
                url: req.url,
                body: get(resp, 'data.data'),
            })
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'post call failed!',
                body: err
            })
        })

});

app.post('/settings/:ssn/subscribeWebhook', function (req, res) {
    const userID = req.body.userID;
    const userAccessToken = req.body.userAccessToken;
    return getPageAccessToken(userID, userAccessToken)
        .then((resp) => { return installApp(resp) })
        .then((resp) => {
            res.json({
                url: req.url,
                body: "Facebook webhook subscription succeed!"
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'Facebook webhook subscription failed!',
                body: err
            })
        })    

});

app.post('/settings/:ssn/twitterKey', async function (req, res) {
    const secretString = req.body.apiKey;


    const command = new PutSecretValueCommand({
        SecretId: "TwitterBearerTokenSecretManagerSecret",
        SecretString: secretString
    });
    await SecretManagerClient.send(command);


    res.json({
        url: req.url,
        body: "Updated secret for Twitter API"
    });
});

/****************************
 * Example put method *
 ****************************/

app.put('/settings/:ssn', function (req, res) {
    // Add your code here
    res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/settings/:ssn/*', function (req, res) {

    res.json({success: 'get call succeed!', url: req.url});
});

/****************************
 * Example delete method *
 ****************************/

app.delete('/settings/:ssn', function (req, res) {
    // Add your code here
    res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/settings/:ssn/rules', function (req, res) {
    const ids = get(req, 'body')

    return deleteTwitterRules(ids).then(
        (resp) => {
            res.json({
                msg: 'delete call succeed!',
                url: req.url,
                body: get(resp, 'data.data'),
            })
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'delete call failed!',
                body: err
            })
        })
});

app.listen(3000, function () {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
