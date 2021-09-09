
const axios = require('axios')
const get = require('lodash/get')

const installApp = (getPageAccessTokenResponse) => {
    const pageID = get(getPageAccessTokenResponse, 'data.data[0].id');
    const pageAccessToken = get(getPageAccessTokenResponse, 'data.data[0].access_token');
    return axios({
        url: "https://graph.facebook.com/"+ pageID +"/subscribed_apps?subscribed_fields=mention&access_token=" + pageAccessToken,
        method: "POST"
    })

}

module.exports = installApp