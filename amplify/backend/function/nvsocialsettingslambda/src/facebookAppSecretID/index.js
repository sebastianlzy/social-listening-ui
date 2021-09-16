const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secretManagerClient = new SecretsManagerClient({
    region: "ap-southeast-1"
});

const postFacebookAppSecretId = async (secretString) => {

    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: process.env.FB_APP_SECRET_ID,
        SecretString: secretString
    });
    await secretManagerClient.send(putSecretValueCommand);
}

module.exports.postFacebookAppSecretId = postFacebookAppSecretId