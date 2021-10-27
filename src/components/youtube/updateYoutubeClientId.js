import { API } from 'aws-amplify';


export default function updateYoutubeClientId(ytClientId) {
    const apiName = 'nvsocial';
    const path = '/settings/youtube/youtubeClientId';
    const config = {
        response: true,
        body: {
            ytClientId
        }
    };

    return API.post(apiName, path, config)

}