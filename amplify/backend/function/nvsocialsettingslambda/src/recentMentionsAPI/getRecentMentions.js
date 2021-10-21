const {S3Client, GetObjectCommand, ListObjectsV2Command} = require("@aws-sdk/client-s3");
const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const moment = require('moment')
const get = require("lodash/get")
const isEmpty = require("lodash/isEmpty")
const client = new S3Client({region: "ap-southeast-1"});
const ssmClient = new SSMClient({region: "ap-southeast-1"});


const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

const parseBody = (bodyContents) => {
    const contents = bodyContents.split(/\r?\n/)
        .map((content, idx) => {
            try {
                return JSON.parse(content)

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

    if (isEmpty(contents)){
        return []
    }

    return contents
        .filter((res) => {
            return moment().diff(moment(res.LastModified), 'month') < 6
        })
}

const getRecentMentions = async (noOfMentions) => {
    
    const ssmCommand = new GetParameterCommand({
        Name: process.env.RESULT_BUCKET_NAME
    });
    
    const ssmResponse = await ssmClient.send(ssmCommand);
    const bucketName = get(ssmResponse, "Parameter.Value", {})

    const command = listObjectCommand(bucketName)
    const limitNumberOfRecentMentions = noOfMentions
    
    try {

        const fileNames = await executeCommand(command, async (resp) => filterByCurrMonth(resp.Contents))

        const messages = await fileNames.reduce(async (accPromise, fileName) =>  {
            const acc = await accPromise
            if (acc.length >= limitNumberOfRecentMentions) {
                return acc
            }

            const command = getObjectCommand(bucketName, fileName.Key)
            const texts = await executeCommand(command, async (resp) => parseBody(await streamToString(resp.Body)))
            return [
                ...acc,
                ...texts.filter((text) => text.sentiment !== undefined).map((text) => ({...text, source: text.data_source}))
            ]
        }, Promise.resolve([]))

        return messages

    } catch (err) {
        console.log(err)
    }


    return []

}

module.exports = getRecentMentions