import { API } from 'aws-amplify';
import get from 'lodash/get'

export default async function getYoutubeClientId() {
    const apiName = 'nvsocial';
    const path = '/settings/youtube/youtubeClientId';
    const config = {
        response: true,
    };

    const configuration = await API.get(apiName, path, config)
    return get(configuration, 'data.body')

}