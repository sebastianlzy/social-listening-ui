const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const get = require("lodash/get")
const client = new SSMClient();

const getYoutubeRedirectUrl = async () => {
    const command = new GetParameterCommand({
        Name: process.env.YT_REDIRECT_URL
    });

    const response = await client.send(command);
    return get(response, "Parameter.Value")
}

module.exports = getYoutubeRedirectUrl