
const axios = require('axios')

const apiURL = {
    streamRules: process.env.TW_STREAM_RULES_API_URL,
    bearerToken: process.env.TW_SECRET_ID
}

const addTwitterRule = (value, tag) => {

    return axios({
        url: apiURL.streamRules,
        headers: {'Authorization': `Bearer ${apiURL.bearerToken}`},
        method: "POST",
        data: {
            add: [{value, tag}]
        }
    })

}

module.exports = addTwitterRule