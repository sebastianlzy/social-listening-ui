
const axios = require('axios')

const apiURL = {
    streamRules: process.env.TW_STREAM_RULES_API_URL,
    bearerToken: process.env.TW_BEARER_TOKEN
}

const deleteTwitterRules = (ids) => {

    return axios({
        url: apiURL.streamRules,
        headers: {'Authorization': `Bearer ${apiURL.bearerToken}`},
        method: "POST",
        data: {
            delete: {
                ids: [...ids]
            }
        }
    })

}

module.exports = deleteTwitterRules