const {S3Client, GetObjectCommand, ListObjectsV2Command} = require("@aws-sdk/client-s3");
const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const moment = require('moment')
const get = require("lodash/get")
const isEmpty = require("lodash/isEmpty")
const client = new S3Client();
const ssmClient = new SSMClient();
const ddbClient = new DynamoDBClient();

const queryMentionsFromDDB = async (tableName, partitionKey, results, exclusiveStartKey = null) => {
    const params = {
      KeyConditionExpression: "#n = :d",
      ExpressionAttributeNames: { "#n": "date" },
      ExpressionAttributeValues: {
        ":d": { S: partitionKey }
      },
      TableName: "sentiments", // TODO: Change to use dynamic naming
      Limit: 200,
      ScanIndexForward: false
    };
    if(exclusiveStartKey != null) params['ExclusiveStartKey'] = exclusiveStartKey
    
    const queryResponse = await ddbClient.send(new QueryCommand(params))
    if(queryResponse.Count == 0) return results;
    results = results.concat(queryResponse.Items)

    if(typeof queryResponse.LastEvaluatedKey !== "undefined"){
        return queryMentionsFromDDB(tableName, partitionKey, results, queryResponse.LastEvaluatedKey)
    }

    return results
}

const getMostRecentWeekMentionsFromDDB = async (tableName) => {
    var currentDate = new Date;
    var firstDay = currentDate.getUTCDate() - currentDate.getUTCDay() + 1;
    var firstShardStart = currentDate
    if(firstDay > 0){
      firstShardStart = new Date(currentDate.setUTCDate(firstDay))
    }else{
      firstShardStart = new Date(currentDate.setUTCDate(1))
    }
    const firstShardStartString = `${firstShardStart.getUTCFullYear()}-${firstShardStart.getUTCMonth()+1}-${('0' + firstShardStart.getUTCDate()).slice(-2)}`
    return queryMentionsFromDDB(tableName, firstShardStartString, [])
}
const getRestOfMentionsThisMonthFromDDB = async (tableName) => {
    var dates = []
    const baseCurrentDate = new Date;
    var firstDayOfWeek = baseCurrentDate.getUTCDate() - baseCurrentDate.getUTCDay() + 1
    while((firstDayOfWeek - 7) > 0){
        dates.push(firstDayOfWeek - 7)
        firstDayOfWeek -= 7
    }
    if((firstDayOfWeek + 7) != 1) dates.push(1)
    dates = [...new Set(dates)]
    
    const calls = dates.map(function(date) { 
        const currentDate = new Date;
        const shardStart = new Date(currentDate.setUTCDate(date))
        const shardStartString = `${shardStart.getUTCFullYear()}-${shardStart.getUTCMonth()+1}-${('0' + shardStart.getUTCDate())}`
        return new Promise((resolve, reject) => {
            resolve(queryMentionsFromDDB(tableName, shardStartString, []))
        })
    })

    return await Promise.all(calls)
}

const getRecentMentions = async (noOfMentions) => {
    
    const ssmCommand = new GetParameterCommand({
        Name: process.env.SENTIMENT_DDB_NAME
    });
    
    const ssmResponse = await ssmClient.send(ssmCommand);
    const tableName = get(ssmResponse, "Parameter.Value", {})
    
    // CODE FOR FETCHING FROM S3
    //const command = listObjectCommand(bucketName)
    //const limitNumberOfRecentMentions = noOfMentions
    
    try {
        // CODE FOR FETCHING FROM S3
        //const fileNames = await executeCommand(command, async (resp) => filterByCurrMonth(resp.Contents))
        var responses = []
        responses.push(getMostRecentWeekMentionsFromDDB(tableName))
        responses = await Promise.all(responses)
        if(responses[0].length < 100) {
            responses = responses.concat( await getRestOfMentionsThisMonthFromDDB(tableName) )
        }
        responses = responses.flat()
        
        const records = responses.map(function (element) {
            var data = {
                created_at: element.created_at.S,
                english_text: element.english_text.S,
                text: element.text.S,
                url: element.url.S,
                language_code: element.language_code.S,
                reply_link: element.reply_link.S,
                sentiment: element.sentiment.S,
                id: element.id.S,
                data_source: element.data_source.S
            }
            switch(element.sentiment.S){ 
                case "POSITIVE":
                    data['score'] = parseFloat(element.sentimentposscore.N).toFixed(2);
                    break;
                case "NEGATIVE":
                    data['score'] =  parseFloat(element.sentimentnegscore.N).toFixed(2);
                    break;
                case "NEUTRAL":
                    data['score'] =  parseFloat(element.sentimentneuscore.N).toFixed(2);
                    break;
                case "MIXED":
                    data['score'] =  parseFloat(element.sentimentmixedscore.N).toFixed(2);
                    break;
            }
            return data
        });
        return records
        /* CODE FOR FETCHING FROM S3
        const messages = await fileNames.reduce(async (accPromise, fileName) =>  {
            const acc = await accPromise
            if (acc.length >= limitNumberOfRecentMentions) {
                return acc
            }

            const command = getObjectCommand(bucketName, fileName.Key)
            const texts = await executeCommand(command, async (resp) => parseBody(await streamToString(resp.Body)))
            return [
                ...acc,
                ...texts.filter((text) => text.sentiment !== undefined).map((text) => ({...text, source: text.data_source, reply_link: ('reply_link' in text) ? text.reply_link : ""}))
            ]
        }, Promise.resolve([]))
    
        return messages
        */

    } catch (err) {
        console.log(err)
    }


    return []

}

/* CODE FOR FETCHING FROM S3 

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

*/
module.exports = getRecentMentions