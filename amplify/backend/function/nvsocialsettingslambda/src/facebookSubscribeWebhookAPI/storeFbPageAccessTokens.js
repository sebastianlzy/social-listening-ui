const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const storeFbPageAccessTokens = (pages) => {
    const secretManagerClient = new SecretsManagerClient({
        region: "ap-southeast-1"
    });
    
    var secret = {}
    for(var i in pages){
        secret[pages[i].id] = pages[i].access_token
    }
    
    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: process.env.FB_PAGES_ACCESS_TOKENS,
        SecretString: JSON.stringify(secret)
    });
    
    return secretManagerClient.send(putSecretValueCommand);
};

module.exports = storeFbPageAccessTokens