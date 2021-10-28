import { API } from 'aws-amplify';


export default function updateYoutubeQuery(ytQuery) {
    const apiName = 'nvsocial';
    const path = '/settings/youtube/youtubeQuery';
    const config = {
        response: true,
        body: {
            ytQuery
        }
    };

    return API.post(apiName, path, config)

}