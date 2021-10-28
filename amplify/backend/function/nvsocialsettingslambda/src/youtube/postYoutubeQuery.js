const { SSMClient, PutParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient({ region: "ap-southeast-1" });

const postYoutubeQuery = async (ytClientId) => {
    const parameterName = process.env.YT_QUERY;

    const putParameterCommandInput = new PutParameterCommand({
        Name: parameterName
    });
    return ssmClient.send(putParameterCommandInput);
}

module.exports = postYoutubeQuery