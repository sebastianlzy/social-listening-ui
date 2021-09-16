import { API } from 'aws-amplify';


export default function updateFBAppSecretID(appSecretId) {
    const apiName = 'nvsocial';
    const path = '/settings/facebook/appSecretId';
    const config = {
        response: true,
        body: {
            appSecretId,
        }
    };

    return API.post(apiName, path, config)

}