import { API } from 'aws-amplify';


export default function getRecentMentions() {
    const apiName = 'nvsocial';
    const path = '/settings/twitter/recentMentions';
    const config = {
        response: true,
        queryStringParameters: {  // OPTIONAL
            limit: '200',
        },
    };

    return API.get(apiName, path, config)

}