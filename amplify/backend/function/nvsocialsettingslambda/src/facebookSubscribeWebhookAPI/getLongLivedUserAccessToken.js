const axios = require('axios')

const getLongLivedUserAccessToken = (fbAppId, fbAppSecret, userAccessToken) => {
    return axios({
        url: `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${fbAppId}&client_secret=${fbAppSecret}&fb_exchange_token=${userAccessToken}`,
        method: "GET"
    })
};



module.exports = getLongLivedUserAccessToken