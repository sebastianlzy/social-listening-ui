const axios = require('axios')

const getPageAccessToken = async (userID, longUserAccessToken) => {
    return axios({
        url: "https://graph.facebook.com/"+ userID + "/accounts?access_token=" + longUserAccessToken,
        method: "GET"
    })

}

module.exports = getPageAccessToken