import { API } from 'aws-amplify';


export default function updateYoutubeClientId(ytClientSecret) {
    const apiName = 'nvsocial';
    const path = '/settings/youtube/youtubeClientSecret';
    const config = {
        response: true,
        body: {
            ytClientSecret
        }
    };

    return API.post(apiName, path, config)

}