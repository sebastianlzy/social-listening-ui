import { API } from 'aws-amplify';


export default function getTwitterRules() {
    const apiName = 'nvsocial';
    const path = '/settings/twitter/rules';
    const config = { // OPTIONAL
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    };

   return API.get(apiName, path, config)
}