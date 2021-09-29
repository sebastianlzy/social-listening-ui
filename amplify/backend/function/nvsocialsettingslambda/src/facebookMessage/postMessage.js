

const postMessage = async (facebookMessage) => {

    try {

      console.log("--------------------7-postMessage-facebookMessage---------------------------")
      console.log(facebookMessage)
      console.log("--------------------7-postMessage-facebookMessage--------------------------")

    } catch (err) {
        console.log(err)
    }


    return "Success"

}

module.exports = postMessage