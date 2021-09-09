
const axios = require('axios')

const getPageAccessToken = (userID, userAccessToken) => {
    return axios({
        url: "https://graph.facebook.com/"+ userID + "/accounts?access_token=" + userAccessToken,
        method: "GET"
    })

}

module.exports = getPageAccessToken