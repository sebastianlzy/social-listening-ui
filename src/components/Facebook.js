
/*global FB, a*/
import {useEffect, useState} from "react";
import {API} from "aws-amplify";

export default function Facebook() {


    const [accessToken, setAccessToken] = useState([]);

    useEffect(() => {
        window.fbAsyncInit = function () {
            FB.init({
              appId            : '579539346533486', //TODO: Change this to take from variable if possible
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v11.0'
            });
            
            FB.getLoginStatus(async function(response) {
                console.log("--------------------response-----------------------------")
                console.log(response)
                console.log("--------------------response----------------------------")
                if (response.status === 'connected') {
                    const accessToken = response.authResponse.accessToken;
                    console.log(accessToken)
                    setAccessToken(accessToken)
                    await setAccessTokenToLambda(accessToken)
                }
            } );
        }
    }, [])

    const setAccessTokenToLambda = () => {
        const apiName = 'nvsocial';
        const path = '/settings/facebook/accesstoken';
        const config = {
            response: true,
        };

        return API.get(apiName, path, config)
    }


    return (
        <div>
            Facebook settings
            <div>{accessToken}</div>
            <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
        </div>
    )
}