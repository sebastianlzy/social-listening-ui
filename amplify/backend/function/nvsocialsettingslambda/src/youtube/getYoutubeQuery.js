const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const get = require("lodash/get")
const client = new SSMClient();

const getYoutubeQuery= async () => {
    const command = new GetParameterCommand({
        Name: process.env.YT_QUERY
    });

    const response = await client.send(command);
    return get(response, "Parameter.Value")
}

module.exports = getYoutubeQuery