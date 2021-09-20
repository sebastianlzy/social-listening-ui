import {API} from 'aws-amplify';
import get from 'lodash/get'

export async function updateMLConfiguration(webhookURL) {
    const configuration = await getMLConfiguration()
    await postFBConfiguration({
        ...configuration,
        webhookURL
    })
}

export async function getMLConfiguration() {
    const apiName = 'nvsocial';
    const path = '/settings/ml/configuration';
    const config = {
        response: true,
    };

    const configuration = await API.get(apiName, path, config)
    return get(configuration, 'data.body')
}


export default async function postFBConfiguration(configuration) {
    const apiName = 'nvsocial';
    const path = '/settings/ml/configuration';
    const config = {
        response: true,
        body: {
            configuration,
        }
    };

    return API.post(apiName, path, config)

}