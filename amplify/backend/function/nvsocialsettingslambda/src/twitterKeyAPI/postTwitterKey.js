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

const postTwitterKey = async (secretString, mode) => {
    var secretId = ""
     switch(mode) {
      case "bearer":
        secretId = process.env.TW_SECRET_ID;
        break;
      case "key":
        secretId = process.env.TW_CONSUMER_KEY;
        break;
      case "secret":
        secretId = process.env.TW_CONSUMER_SECRET;
        break;
      case "token":
        secretId = process.env.TW_TOKEN;
        break;
      case "token_secret":
        secretId = process.env.TW_TOKEN_SECRET;
    } 
        

    const putSecretValueCommand = new PutSecretValueCommand({
        SecretId: secretId,
        SecretString: secretString
    });
    await secretManagerClient.send(putSecretValueCommand);
    
    if(mode == "bearer"){
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

}

module.exports = postTwitterKey