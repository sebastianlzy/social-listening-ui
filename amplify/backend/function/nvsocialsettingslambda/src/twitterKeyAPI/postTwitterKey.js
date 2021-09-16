const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const secretManagerClient = new SecretsManagerClient({
    region: "ap-southeast-1"
});

const ssmClient = new SSMClient({
    region: "ap-southeast-1"
});

const lambdaClient = new LambdaClient({
    region: "ap-southeast-1"
});
const lambdaARNParameterStoreName = "TW_LAMBDA_ARN"

const postTwitterKey = async (secretString) => {

    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: process.env.TW_SECRET_ID,
        SecretString: secretString
    });
    await secretManagerClient.send(putSecretValueCommand);

    const getParameterCommand = new GetParameterCommand({
        "Name": `${lambdaARNParameterStoreName}`,
        "WithDecryption": true
    })
    const ssmResponse = await ssmClient.send(getParameterCommand);
    const lambdaARN = ssmResponse.Parameter.Value;
    const invokeCommand = new InvokeCommand({
        FunctionName: lambdaARN,
        LogType: "Tail"
    })
    await lambdaClient.send(invokeCommand)

}

module.exports = postTwitterKey