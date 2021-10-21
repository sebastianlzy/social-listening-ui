const { EventBridgeClient, EnableRuleCommand } = require("@aws-sdk/client-eventbridge");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const eventBridgeClient = new EventBridgeClient({ region: "ap-southeast-1" });
const ssmClient = new SSMClient({ region: "ap-southeast-1" });

const startFBCrawler = async () => {
    const getSecretValueCommand = new GetParameterCommand({
        Name: process.env.FB_CRAWLER_EVENT_BRIDGE
    });
    const eventBridgeRuleParameter = await ssmClient.send(getSecretValueCommand);
    
    const params = {
        Name: eventBridgeRuleParameter.Parameter.Value,
    };
    const enableRuleCommand = new EnableRuleCommand(params);
    return eventBridgeClient.send(enableRuleCommand)
}

module.exports = startFBCrawler()