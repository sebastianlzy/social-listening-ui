const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const getFbAppId = () => {
    const ssmClient = new SSMClient({
        region: "ap-southeast-1"
    });
    const getSecretValueCommand = new GetParameterCommand({
        Name: process.env.FB_CONFIGURATION
    });
    const fbAppConfig = ssmClient.send(getSecretValueCommand);
    return fbAppConfig
};

module.exports = getFbAppId