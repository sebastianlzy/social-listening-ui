const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secretManagerClient = new SecretsManagerClient({ region: "ap-southeast-1" });

const postYoutubeClientSecret = async (ytClientSecret) => {
    const secretName = process.env.YT_CLIENT_SECRET;

    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: secretName,
        SecretString: ytClientSecret
    });
    return secretManagerClient.send(putSecretValueCommand);
}

module.exports = postYoutubeClientSecret