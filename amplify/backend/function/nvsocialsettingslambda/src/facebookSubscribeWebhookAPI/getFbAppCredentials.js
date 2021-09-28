const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const getFbAppCredentials = (userID, userAccessToken) => {
    const secretManagerClient = new SecretsManagerClient({
        region: "ap-southeast-1"
    });
    const getSecretValueCommand = new GetSecretValueCommand({
        SecretId: process.env.FB_APP_SECRET_ID
    });
    const fbAppSecretSecret = secretManagerClient.send(getSecretValueCommand);
    return fbAppSecretSecret
};

module.exports = getFbAppCredentials