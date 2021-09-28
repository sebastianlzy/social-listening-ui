const axios = require('axios')

const installApp = (pages) => {
    var processes = []
    var validPages = []
    for(const i in pages){
        const pageID = pages[i].id;
        const pageAccessToken = pages[i].access_token;
        processes.push(
            axios({
                url: "https://graph.facebook.com/"+ pageID +"/subscribed_apps?subscribed_fields=mention,feed&access_token=" + pageAccessToken,
                method: "POST"
            })
            .then((resp) => {
                validPages.push({id: pageID, access_token: pageAccessToken})
            })
            .catch((err) => {
                console.log("1 page ignored for no access")
            })
        )
    }
    return Promise.all(processes).then(() => { return validPages })

}

module.exports = installApp