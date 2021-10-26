const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const axios = require("axios")

const ssmClient = new SSMClient({
    region: "ap-southeast-1"
});

const storeIgToFbPageMapping = (pages) => {
    for(var i in pages){
        const getCurrentMappingPromise = new Promise((resolve, reject) => {
            const getSecretValueCommand = new GetParameterCommand({
                Name: process.env.IG_TO_FB_PAGE,
            });
            return ssmClient.send(new GetParameterCommand({ Name: process.env.IG_TO_FB_PAGE}));
        })
        const getIDPromise = new Promise((resolve, reject) => {
            return axios({
                url: `https://graph.facebook.com/v12.0/${pages[i].id}?fields=instagram_business_account&access_token=${pages[i].access_token}`,
                method: "GET"
            }).catch((err) => {
                console.log(err)
                resolve({})
            })
        })
        
        return Promise.all([getCurrentMappingPromise, getIDPromise]).then((resps) => {
            const mapping = JSON.parse(resps[0])
            const fbApiResp = resps[1]
            if("instagram_business_account" in fbApiResp){
                mapping[fbApiResp["instagram_business_account"]] = fbApiResp["id"]
            }
            const putSecretValueCommand = new PutParameterCommand({
                Name: process.env.IG_TO_FB_PAGE,
                Overwrite: true,
                Value: mapping
            });
            return ssmClient.send(putSecretValueCommand);
        })
    }
};

module.exports = storeIgToFbPageMapping
   
   

        
         
    