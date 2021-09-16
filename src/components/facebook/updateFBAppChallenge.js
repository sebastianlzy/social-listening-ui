import { API } from 'aws-amplify';


export default function updateFBAppChallenge(appChallenge) {
    const apiName = 'nvsocial';
    const path = '/settings/facebook/appChallenge';
    const config = {
        response: true,
        body: {
            appChallenge,
        }
    };

    return API.post(apiName, path, config)

}