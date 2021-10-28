const { EventBridgeClient, EnableRuleCommand } = require("@aws-sdk/client-eventbridge");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const eventBridgeClient = new EventBridgeClient({ region: "ap-southeast-1" });
const ssmClient = new SSMClient({ region: "ap-southeast-1" });

const startIGCrawler = () => {
    const getRuleNamePromise = new Promise((resolve, reject) => {
        const getSecretValueCommand = new GetParameterCommand({
            Name: process.env.IG_CRAWLER_EVENT_BRIDGE
        });
        const eventBridgeRuleParameter = ssmClient.send(getSecretValueCommand);
        resolve(eventBridgeRuleParameter)
    })
    return getRuleNamePromise.then((parameterName) => {
        const params = {
            Name: parameterName.Parameter.Value,
        };
        const enableRuleCommand = new EnableRuleCommand(params);
        return eventBridgeClient.send(enableRuleCommand)
    })
}

module.exports = startIGCrawler