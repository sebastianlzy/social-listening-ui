import {API} from 'aws-amplify';
import get from 'lodash/get'

export async function updateFBWebhookURL(webhookURL) {
    const configuration = await getFBConfiguration()
    await updateFBConfiguration({
        ...configuration,
        webhookURL
    })
}

export async function getFBConfiguration() {
    const apiName = 'nvsocial';
    const path = '/settings/facebook/configuration';
    const config = {
        response: true,
    };

    const configuration = await API.get(apiName, path, config)
    return get(configuration, 'data.body')
}


export default async function updateFBConfiguration(configuration) {
    const apiName = 'nvsocial';
    const path = '/settings/facebook/configuration';
    const config = {
        response: true,
        body: {
            configuration,
        }
    };

    return API.post(apiName, path, config)

}