
const axios = require('axios')
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");




const getPageAccessToken = (userID, userAccessToken) => {
    const secretManagerClient = new SecretsManagerClient({
        region: "ap-southeast-1"
    });
    const getSecretValueCommand = new GetSecretValueCommand({
        SecretId: process.env.FB_APP_SECRET_ID
    });
    const fbAppSecretSecret = await secretManagerClient.send(getSecretValueCommand);
    console.log("fbAppSecretSecret")
    console.log(fbAppSecretSecret)
    const fbAppSecret = fbAppSecretSecret.SecretString
    var getLongLivedUserToken = axios({
        url: `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=579539346533486&client_secret=${fbAppSecret}&fb_exchange_token=${userAccessToken}`
    })
    return getLongLivedUserToken.then(
        function(response) {
            console.log("abouttogetpagetoken")
            console.log(response)
            const longUserAccessToken = get('data.data.access_token')
            axios({
                url: "https://graph.facebook.com/"+ userID + "/accounts?access_token=" + longUserAccessToken,
                method: "GET"
            })
        });

}

module.exports = getPageAccessToken