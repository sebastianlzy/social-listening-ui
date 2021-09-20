const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const get = require("lodash/get")
const client = new SSMClient({region: "ap-southeast-1"});


const postMLConfiguration = async (configuration) => {
    const command = new PutParameterCommand({
        Name: process.env.ML_CONFIGURATION,
        Overwrite: true,
        Value: configuration
    });
    return await client.send(command);
}


const getMLConfiguration = async () => {
    const command = new GetParameterCommand({
        Name: process.env.ML_CONFIGURATION
    });

    const response = await client.send(command);
    return JSON.parse(get(response, "Parameter.Value", {}))
}

module.exports.getMLConfiguration = getMLConfiguration
module.exports.postMLConfiguration = postMLConfiguration