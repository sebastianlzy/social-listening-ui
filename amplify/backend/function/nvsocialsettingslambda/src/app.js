/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


const {postFacebookAppChallenge} = require("./facebookAppChallenge");
const {postFacebookAppSecretId} = require("./facebookAppSecretID");

const express = require('express')
const bodyParser = require('body-parser')
const get = require('lodash/get')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const getTwitterRules = require('./twitterRulesAPI/getTwitterRules')
const addTwitterRule = require('./twitterRulesAPI/addTwitterRule')
const deleteTwitterRules = require('./twitterRulesAPI/deleteTwitterRules')
const getRecentMentions = require("./recentMentionsAPI/getRecentMentions")
const postMessage = require("./facebookMessage/postMessage")
const getPageAccessToken = require("./facebookSubscribeWebhookAPI/getPageAccessToken")
const postTwitterKey = require("./twitterKeyAPI/postTwitterKey")
const postYoutubeClientId = require("./youtube/postYoutubeClientId")
const getYoutubeClientId = require("./youtube/getYoutubeClientId")
const getYoutubeRedirectUrl = require("./youtube/getYoutubeRedirectUrl")
const postYoutubeClientSecret = require("./youtube/postYoutubeClientSecret")
const postYoutubeQuery = require("./youtube/postYoutubeQuery")
const getYoutubeQuery = require("./youtube/getYoutubeQuery")
const installApp = require("./facebookSubscribeWebhookAPI/installApp")
const checkPageAccess = require("./facebookCrawler/checkPageAccess")
const startFBCrawler = require("./facebookCrawler/startFBCrawler")
const startIGCrawler = require("./instagramCrawler/startIGCrawler")
const getFbAppCredentials = require("./facebookSubscribeWebhookAPI/getFbAppCredentials")
const getFbAppId = require("./facebookSubscribeWebhookAPI/getFbAppId")
const getLongLivedUserAccessToken = require("./facebookSubscribeWebhookAPI/getLongLivedUserAccessToken")
const storeFbPageAccessTokens = require("./facebookSubscribeWebhookAPI/storeFbPageAccessTokens")
const storeIgToFbPageMapping = require("./facebookSubscribeWebhookAPI/storeIgToFbPageMapping")
const {getFacebookConfiguration, postFacebookConfiguration} = require("./facebookConfiguration");
const {getMLConfiguration, postMLConfiguration} = require("./mlConfiguration");
const moment = require("moment")


// declare a new express app
const app = express()


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
    let noOfMentions = get(req, 'query.limit', 200)


    getRecentMentions(noOfMentions)
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

app.get('/settings/:ssn/configuration', function (req, res) {
    const ssn = get(req, "params.ssn", "")
    const fnRegistry = {
        "facebook": getFacebookConfiguration,
        "ml": getMLConfiguration
    }
    const fn = fnRegistry[ssn]

    if (fn === undefined) {
        res.status(500).json({
            msg: 'method does not exist',
            url: req.url,
        })
    }

    return fn()
        .then((resp) => {
            res.json({
                msg: 'get call succeed!',
                url: req.url,
                body: resp,
                ssn,
            })
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                msg: 'get call failed!',
                url: req.url,
                body: err,
                ssn,
            })
        })
});

app.get('/settings/youtube/youtubeClientId', async function (req, res) {
    
    return getYoutubeClientId()
        .then((ytClientID) => {
            res.json({
                url: req.url,
                body: ytClientID
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'Youtube client ID API fetching failed!',
                body: err
            })
        })
});

app.get('/settings/youtube/youtubeRedirectUrl', async function (req, res) {
    
    return getYoutubeRedirectUrl()
        .then((ytRedirectUrl) => {
            res.json({
                url: req.url,
                body: ytRedirectUrl
            });
        }).catch((err) => {
            console.log(err)
            res.status(500).json({
                msg: 'Youtube redirect URL fetching failed!',
                body: err
            })
        })
});

app.get('/settings/youtube/youtubeQuery', async function (req, res) {
    
    return getYoutubeQuery()
        .then((ytQuery) => {
            res.json({
                url: req.url,
                body: ytQuery
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'Youtube query fetching failed!',
                body: err
            })
        })
});

/****************************
 * Example post method *
 ****************************/

app.post('/settings/:ssn/message', function (req, res) {

    postMessage(get(req, 'body'))
        .then((resp) => {
            res.json({
                success: 'post call /settings/:ssn/message succeed!',
                url: req.url,
                body: resp
            });
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'post call /settings/:ssn/message failed!',
                body: err
            })
        })
});

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
    const getCreds = [getFbAppId(), getFbAppCredentials()]
    return Promise.all(getCreds)
        .then((resps) => { 
            const fbAppId = JSON.parse(resps[0].Parameter.Value).fbAppId
            const fbAppSecret = resps[1].SecretString
            return getLongLivedUserAccessToken(fbAppId, fbAppSecret, userAccessToken)
        })
        .then((resp) => {
            const longUserAccessToken = get(resp, 'data.access_token')
            return getPageAccessToken(userID, longUserAccessToken)
        })
        .then((resp) => { 
            const pages = get(resp, 'data.data');
            return installApp(pages)
        })
        .then((resp) => {
            const igPromise = storeIgToFbPageMapping(resp)
            const fbPromise = storeFbPageAccessTokens(resp)
            return Promise.all([igPromise, fbPromise])
        })
        .then((resp) => {
            res.json({
                url: req.url,
                body: "Facebook webhook subscription succeed!"
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                msg: 'Facebook webhook subscription failed!',
                body: err
            })
        })    

});

app.post('/settings/facebook/startIGCrawler', function (req, res) {
    const userID = req.body.userID;
    const userAccessToken = req.body.userAccessToken;
    const getCreds = [getFbAppId(), getFbAppCredentials()]
    return Promise.all(getCreds)
        .then((resps) => { 
            const fbAppId = JSON.parse(resps[0].Parameter.Value).fbAppId
            const fbAppSecret = resps[1].SecretString
            return getLongLivedUserAccessToken(fbAppId, fbAppSecret, userAccessToken)
        })
        .then((resp) => {
            const longUserAccessToken = get(resp, 'data.access_token')
            return getPageAccessToken(userID, longUserAccessToken)
        })
        .then((resp) => { 
            const pages = get(resp, 'data.data');
            return checkPageAccess(pages)
        })
        .then((resp) => {
            const igPromise = storeIgToFbPageMapping(resp)
            const fbPromise = storeFbPageAccessTokens(resp)
            return Promise.all([igPromise, fbPromise])
        })
        .then((resp) => {
            return startIGCrawler();
        })
        .then((resp) => {
            res.json({
                url: req.url,
                body: "Instagram crawler started"
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                msg: 'Instagram crawler start failed!',
                body: err
            })
        })    

});

app.post('/settings/facebook/startCrawler', function (req, res) {
    const userID = req.body.userID;
    const userAccessToken = req.body.userAccessToken;
    const getCreds = [getFbAppId(), getFbAppCredentials()]
    return Promise.all(getCreds)
        .then((resps) => { 
            const fbAppId = JSON.parse(resps[0].Parameter.Value).fbAppId
            const fbAppSecret = resps[1].SecretString
            return getLongLivedUserAccessToken(fbAppId, fbAppSecret, userAccessToken)
        })
        .then((resp) => {
            const longUserAccessToken = get(resp, 'data.access_token')
            return getPageAccessToken(userID, longUserAccessToken)
        })
        .then((resp) => { 
            const pages = get(resp, 'data.data');
            return checkPageAccess(pages)
        })
        .then((resp) => {
            return storeFbPageAccessTokens(resp)
        })
        .then((resp) => {
            return startFBCrawler();
        })
        .then((resp) => {
            res.json({
                url: req.url,
                body: "Facebook crawler started"
            });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                msg: 'Facebook crawler start failed!',
                body: err
            })
        })    

});

app.post('/settings/:ssn/twitterKey', async function (req, res) {
    const apiKey = req.body.apiKey;
    const mode = req.body.mode
    
    return postTwitterKey(apiKey, mode)
        .then(() => {
            res.json({
                url: req.url,
                body: "Updated secret for Twitter API"
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'Twitter API update failed!',
                body: err
            })
        })
});

app.post('/settings/youtube/youtubeClientId', async function (req, res) {
    const ytClientId = req.body.ytClientId
    
    return postYoutubeClientId(ytClientId)
        .then(() => {
            res.json({
                url: req.url,
                body: "Updated client ID for Youtube"
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'Youtube client ID API update failed!',
                body: err
            })
        })
});

app.post('/settings/youtube/youtubeClientSecret', async function (req, res) {
    const ytClientSecret = req.body.ytClientSecret
    
    return postYoutubeClientSecret(ytClientSecret)
        .then(() => {
            res.json({
                url: req.url,
                body: "Updated client secret for Youtube"
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'Youtube client secret API update failed!',
                body: err
            })
        })
});

app.post('/settings/youtube/youtubeQuery', async function (req, res) {
    const ytQuery = req.body.ytQuery
    
    return postYoutubeQuery(ytQuery)
        .then(() => {
            res.json({
                url: req.url,
                body: "Updated query for Youtube"
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'Youtube query API update failed!',
                body: err
            })
        })
});

app.post('/settings/:ssn/appChallenge', async function (req, res) {
    const appChallenge = req.body.appChallenge;

    return postFacebookAppChallenge(appChallenge)
        .then(() => {
            res.json({
                url: req.url,
                body: "Updated secret for postFacebookAppChallenge"
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'postFacebookAppChallenge update failed!',
                body: err
            })
        })
});

app.post('/settings/:ssn/appSecretId', async function (req, res) {
    const appSecretId = req.body.appSecretId;

    return postFacebookAppSecretId(appSecretId)
        .then(() => {
            res.json({
                url: req.url,
                body: "Updated secret for postFacebookAppSecretId"
            });
        }).catch((err) => {
            res.status(500).json({
                msg: 'postFacebookAppSecretId update failed!',
                body: err
            })
        })
});

app.post('/settings/:ssn/configuration', async function (req, res) {
    const configuration = get(req, "body.configuration", "");

    const ssn = get(req, "params.ssn", "")
    const fnRegistry = {
        "facebook": postFacebookConfiguration,
        "ml": postMLConfiguration
    }
    const fn = fnRegistry[ssn]

    if (fn === undefined) {
        res.status(500).json({
            msg: 'method does not exist',
            url: req.url,
        })
    }

    return fn(JSON.stringify(configuration))
        .then((resp) => {
            res.json({
                msg: 'successfully updated',
                url: req.url,
                body: resp,
                ssn,
            })
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                msg: 'update failed',
                url: req.url,
                body: err,
                ssn,
            })
        })
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
