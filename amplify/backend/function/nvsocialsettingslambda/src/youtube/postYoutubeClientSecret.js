const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secretManagerClient = new SecretsManagerClient({ region: "ap-southeast-1" });

const postYoutubeClientSecret = async (ytClientSecret) => {
    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: process.env.YT_CLIENT_SECRET,
        SecretString: ytClientSecret,
        Overwrite: true
    });
    return secretManagerClient.send(putSecretValueCommand);
}

module.exports = postYoutubeClientSecret