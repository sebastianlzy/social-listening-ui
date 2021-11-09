const { SSMClient, PutParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient();

const postYoutubeQuery = async (ytQuery) => {
    const putParameterCommandInput = new PutParameterCommand({
        Name: process.env.YT_QUERY,
        Value: ytQuery,
        Overwrite: true
    });
    return ssmClient.send(putParameterCommandInput);
}

module.exports = postYoutubeQuery