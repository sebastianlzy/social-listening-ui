
const axios = require('axios')
const get = require('lodash/get')

const getLongLivedUserAccessToken = (fbAppSecret, userAccessToken) => {
    return axios({
        url: `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=579539346533486&client_secret=${fbAppSecret}&fb_exchange_token=${userAccessToken}`,
        method: "GET"
    })
};



module.exports = getLongLivedUserAccessToken