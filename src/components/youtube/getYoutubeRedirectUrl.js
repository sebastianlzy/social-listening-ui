import { API } from 'aws-amplify';
import get from 'lodash/get'

export default async function getYoutubeRedirectUrl() {
    const apiName = 'nvsocial';
    const path = '/settings/youtube/youtubeRedirectUrl';
    const config = {
        response: true,
    };

    const configuration = await API.get(apiName, path, config)
    return get(configuration, 'data.body')

}