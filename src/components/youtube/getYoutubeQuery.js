import { API } from 'aws-amplify';
import get from 'lodash/get'

export default async function getYoutubeQuery() {
    const apiName = 'nvsocial';
    const path = '/settings/youtube/youtubeQuery';
    const config = {
        response: true,
    };

    const configuration = await API.get(apiName, path, config)
    return get(configuration, 'data.body')

}