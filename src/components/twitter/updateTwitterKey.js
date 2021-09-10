import { API } from 'aws-amplify';


export default function addTwitterRule(apiKey) {
    const apiName = 'nvsocial';
    const path = '/settings/twitter/twitterKey';
    const config = {
        response: true,
        body: {
            apiKey,
        }
    };

    return API.post(apiName, path, config)

}