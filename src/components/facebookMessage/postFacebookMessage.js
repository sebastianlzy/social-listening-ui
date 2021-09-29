import { API } from 'aws-amplify';


export default function postFacebookMessage(message) {
    const apiName = 'nvsocial';
    const path = '/settings/facebook/message';
    const config = {
        response: true,
        body: {
            message,
        }
    };

    return API.post(apiName, path, config)

}