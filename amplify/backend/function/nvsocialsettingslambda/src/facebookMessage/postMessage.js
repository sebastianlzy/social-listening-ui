const get = require('lodash/get')
const {LambdaClient, InvokeCommand} = require("@aws-sdk/client-lambda");
const {SSMClient, GetParameterCommand} = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient({
    region: "ap-southeast-1"
});

const lambdaClient = new LambdaClient({
    region: "ap-southeast-1"
});

const postMessage = async (body) => {

    const message = get(body, 'message')
    const postId = get(body, 'postId')
    const originalText = get(body, 'originalText')
    const platform = get(body, 'platform')

    const lambdaARNParameterStoreName = process.env.MESSAGE_LAMBDA_PARAMETER_STORE
    console.log("--------------------21-postMessage-lambdaARNParameterStoreName---------------------------")
    console.log(lambdaARNParameterStoreName)
    console.log("--------------------21-postMessage-lambdaARNParameterStoreName--------------------------")
    const getParameterCommand = new GetParameterCommand({
        "Name": `${lambdaARNParameterStoreName}`,
    })
    const ssmResponse = await ssmClient.send(getParameterCommand);
    const lambdaARN = ssmResponse.Parameter.Value;
    console.log("--------------------29-postMessage-lambdaARN---------------------------")
    console.log(lambdaARN)
    console.log("--------------------29-postMessage-lambdaARN--------------------------")

    const invokeCommand = new InvokeCommand({
        FunctionName: lambdaARN,
        LogType: "Tail",
        Payload: new TextEncoder().encode(JSON.stringify({
            message,
            postId,
            originalText,
            platform
        }))
    })

    await lambdaClient.send(invokeCommand)


}

module.exports = postMessage