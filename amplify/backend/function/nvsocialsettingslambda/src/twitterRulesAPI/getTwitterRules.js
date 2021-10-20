const axios = require('axios')
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secretManagerClient = new SecretsManagerClient({
    region: "ap-southeast-1"
});

const getTwitterRules = () => {
     const getTwitterBearerToken = new Promise((resolve, reject) => {
        const getSecretValueCommand = new GetSecretValueCommand({
            SecretId: process.env.TW_SECRET_ID
        });
        resolve(secretManagerClient.send(getSecretValueCommand))
    })
    
    return getTwitterBearerToken.then((bearerTokenSecret) => {
        const bearerToken = bearerTokenSecret.SecretString
        const apiURL = {
            streamRules: process.env.TW_STREAM_RULES_API_URL,
            bearerToken: bearerToken
        }
        return axios({
            url: apiURL.streamRules,
            headers: {'Authorization': `Bearer ${bearerToken}`},
        })
    })

}

module.exports = getTwitterRules

