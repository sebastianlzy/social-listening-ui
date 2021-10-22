import { API } from 'aws-amplify';


export default function addTwitterRule(apiKey, mode) {
    const apiName = 'nvsocial';
    const path = '/settings/twitter/twitterKey';
    const config = {
        response: true,
        body: {
            apiKey,
            mode,
        }
    };

    return API.post(apiName, path, config)

}