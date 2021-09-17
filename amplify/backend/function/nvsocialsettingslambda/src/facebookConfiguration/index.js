const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");

const client = new SSMClient({region: "ap-southeast-1"});


const postFacebookConfiguration = async (configuration) => {
    const command = new PutParameterCommand({
        Name: process.env.FB_CONFIGURATION,
        Overwrite: true,
        Value: configuration
    });
    return await client.send(command);
}


const getFacebookConfiguration = async () => {
    const command = new GetParameterCommand({
        Name: process.env.FB_CONFIGURATION
    });
    return await client.send(command);
}

module.exports.getFacebookConfiguration = getFacebookConfiguration
module.exports.postFacebookConfiguration = postFacebookConfiguration