
const axios = require('axios')
const get = require('lodash/get')

const installApp = (getPageAccessTokenResponse) => {
    const pages = get(getPageAccessTokenResponse, 'data.data');
    var processes = []
    for(const i in pages){
        console.log(pages[i])
        const pageID = pages[i].id;
        const pageAccessToken = pages[i].access_token;
        processes.push(axios({
            url: "https://graph.facebook.com/"+ pageID +"/subscribed_apps?subscribed_fields=mention&access_token=" + pageAccessToken,
            method: "POST"
        }))
    }
    return Promise.all(processes)

}

module.exports = installApp