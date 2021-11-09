const { SSMClient, PutParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient();

const postYoutubeClientId = async (ytClientId) => {
    const putParameterCommandInput = new PutParameterCommand({
        Name: process.env.YT_CLIENT_ID,
        Value: ytClientId,
        Overwrite: true
    });
    return ssmClient.send(putParameterCommandInput);
}

module.exports = postYoutubeClientId