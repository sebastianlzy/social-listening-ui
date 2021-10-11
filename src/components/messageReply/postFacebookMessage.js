import { API } from 'aws-amplify';


export default function postFacebookMessage(platform, data) {
    const apiName = 'nvsocial';
    const path = `/settings/${platform}/message`;
    const config = {
        response: true,
        body: {
            data,
        }
    };

    return API.post(apiName, path, config)

}