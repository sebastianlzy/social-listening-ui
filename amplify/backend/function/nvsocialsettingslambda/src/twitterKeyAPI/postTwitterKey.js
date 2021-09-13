const { SecretsManagerClient, PutSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const secretManagerClient = new SecretsManagerClient({
    region: "ap-southeast-1"
});

const lambdaClient = new LambdaClient({
    region: "ap-southeast-1"
});

const postTwitterKey = async (secretString) => {

    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: "TwitterBearerTokenSecretManagerSecret",
        SecretString: secretString
    });
    await secretManagerClient.send(putSecretValueCommand);

    const lambdaARN = process.env.TW_ACTIVATE_TOKEN_LAMBDA_ARN
    const invokeCommand = new InvokeCommand({
        FunctionName: lambdaARN,
        LogType: "Tail"
    })
    await lambdaClient.send(invokeCommand)

}

module.exports = postTwitterKey