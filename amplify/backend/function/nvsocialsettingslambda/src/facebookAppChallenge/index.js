const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const secretManagerClient = new SecretsManagerClient({
    region: "ap-southeast-1"
});

const postFacebookAppChallenge = async (secretString) => {

    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: process.env.FB_APP_CHALLENGE,
        SecretString: secretString
    });
    await secretManagerClient.send(putSecretValueCommand);
}

module.exports.postFacebookAppChallenge = postFacebookAppChallenge