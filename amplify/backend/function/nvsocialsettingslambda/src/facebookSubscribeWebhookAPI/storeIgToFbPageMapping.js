const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const axios = require("axios")
const ssmClient = new SSMClient();

const storeIgToFbPageMapping = (pages) => {
    var processes = []
    for(var i in pages){
        processes.push(getAndUpdateMapping(pages[i]))
    }
    return Promise.all(processes)
};

function getAndUpdateMapping(page){
    const getCurrentMappingPromise = new Promise((resolve, reject) => {
        const mapping = ssmClient.send(new GetParameterCommand({ Name: process.env.IG_TO_FB_PAGE}));
        resolve(mapping)
    })
    const getIDPromise = new Promise((resolve, reject) => {
        const fbResponse = axios({
            url: `https://graph.facebook.com/v12.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`,
            method: "GET"
        }).catch((err) => {
            console.log(err)
            resolve({})
        })
        resolve(fbResponse)
    })
    
    return Promise.all([getCurrentMappingPromise, getIDPromise]).then((resps) => {
        console.log("inside all ok")
        console.log(resps[0])
        console.log(resps[1])
        const mapping = JSON.parse(resps[0]['Parameter']['Value'])
        const fbApiResp = resps[1]
        if("data" in fbApiResp){
            if("instagram_business_account" in fbApiResp['data']){
                mapping[fbApiResp["data"]["instagram_business_account"]["id"]] = fbApiResp["data"]["id"]
            }
        }
        const storeParameterCommand = new PutParameterCommand({
            Name: process.env.IG_TO_FB_PAGE,
            Overwrite: true,
            Value: JSON.stringify(mapping)
        });
        return ssmClient.send(storeParameterCommand);
    })
}

module.exports = storeIgToFbPageMapping
   
   

        
         
    