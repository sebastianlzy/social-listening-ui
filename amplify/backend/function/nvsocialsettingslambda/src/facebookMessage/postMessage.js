const get = require('lodash/get')
const {SNSClient, PublishCommand} = require("@aws-sdk/client-sns");
const {SSMClient, GetParameterCommand} = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient({
    region: "ap-southeast-1"
});

const snsClient = new SNSClient({
    region: "ap-southeast-1"
});

const postMessage = async (body) => {

    const message = get(body, 'message')
    const postId = get(body, 'postId')
    const originalText = get(body, 'originalText')
    const platform = get(body, 'platform')

    const snsARNParameterStoreName = process.env.MESSAGE_SNS_PARAMETER_STORE
    console.log("--------------------21-postMessage-snsARNParameterStoreName---------------------------")
    console.log(snsARNParameterStoreName)
    console.log("--------------------21-postMessage-snsARNParameterStoreName--------------------------")
    const getParameterCommand = new GetParameterCommand({
        "Name": `${snsARNParameterStoreName}`,
    })
    const ssmResponse = await ssmClient.send(getParameterCommand);
    const snsTopicARN = ssmResponse.Parameter.Value;
    console.log("--------------------29-postMessage-snsTopicARN---------------------------")
    console.log(snsTopicARN)
    console.log("--------------------29-postMessage-snsTopicARN--------------------------")
    
    var sendMessageParams = {
      Message: message, // MESSAGE_TEXT
      TopicArn: snsTopicARN, //TOPIC_ARN
    };
    
    await snsClient.send(new PublishCommand(sendMessageParams));
    
    /*
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
    */
    

}

module.exports = postMessage