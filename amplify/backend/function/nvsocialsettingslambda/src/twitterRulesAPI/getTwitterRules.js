
const axios = require('axios')

const apiURL = {
    streamRules: "https://api.twitter.com/2/tweets/search/stream/rules",
    bearerToken: process.env.TW_BEARER_TOKEN
}

const getTwitterRules = (value, tag) => {

    return axios({
        url: apiURL.streamRules,
        headers: {'Authorization': `Bearer ${apiURL.bearerToken}`},
        data: {
            add: {
                value,
                tag
            }
        }
    })

}

module.exports = getTwitterRules