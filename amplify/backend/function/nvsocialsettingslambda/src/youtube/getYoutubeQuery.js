const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const get = require("lodash/get")
const client = new SSMClient({region: "ap-southeast-1"});

const getYoutubeQuery= async () => {
    const command = new GetParameterCommand({
        Name: process.env.YT_QUERY
    });

    const response = await client.send(command);
    return JSON.parse(get(response, "Parameter.Value", {}))
}

module.exports = getYoutubeQuery