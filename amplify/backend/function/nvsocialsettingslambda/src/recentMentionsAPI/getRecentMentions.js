const {S3Client, GetObjectCommand, ListObjectsV2Command} = require("@aws-sdk/client-s3");
const moment = require('moment')
const client = new S3Client({region: "ap-southeast-1"});


const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
const CSVtoArray = (text) => {
    const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    const a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

const parseBody = (bodyContents) => {
    let headers = []

    const contents = bodyContents.split(/\r?\n/)
        .map((content, idx) => {
            try {
                const contentInArray = CSVtoArray(content)
                if (idx === 0) {
                    headers = contentInArray
                    return undefined
                }

                if (contentInArray.length === 0) {
                    return undefined
                }

                const resp = {}
                for (let i = 0; i< headers.length; i ++){
                    resp[headers[i]] = contentInArray[i]
                }
                return resp

            } catch (err) {
                return undefined
            }
        }).filter((content) => content !== undefined)

    return contents
}

const listObjectCommand = (bucketName) => {
    return new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: "sentiment/"
    })
}

const getObjectCommand = (bucketName, key) => {
    return new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });
}

const executeCommand = async (command, callback=async (resp)=> resp ) => {
    const resp = await client.send(command)
    return callback(resp)
}

const filterByCurrMonth = (contents) => {
    return contents
        .filter((res) => {
            return moment().diff(moment(res.LastModified), 'days') < 7
        })
}

const getRecentMentions = async () => {

    const bucketName = process.env.RESULT_BUCKET_NAME

    const command = listObjectCommand(bucketName)

    try {

        const fileNames = await executeCommand(command, async (resp) => filterByCurrMonth(resp.Contents).slice(5))
        
        const messages = await fileNames.reduce(async (accPromise, fileName) =>  {
            const acc = await accPromise
            const command = getObjectCommand(bucketName, fileName.Key)
            const texts = await executeCommand(command, async (resp) => parseBody(await streamToString(resp.Body)))
            return [
                ...acc,
                ...texts.filter((text) => text.sentiment !== undefined).map((text) => ({...text, source: "Twitter"}))
            ]
        }, Promise.resolve([]))

        return messages

    } catch (err) {
        console.log(err)
    }


    return []

}

module.exports = getRecentMentions