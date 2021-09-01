import { API } from 'aws-amplify';


export default function addTwitterRule(value, tag) {
    const apiName = 'nvsocial';
    const path = '/settings/twitter/rules';
    const config = {
        response: true,
        body: {
            value,
            tag
        }
    };

    return API.post(apiName, path, config)

}