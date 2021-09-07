
/*global FB, a*/
import {useState} from "react";
import {API} from "aws-amplify";
import Button from '@material-ui/core/Button';

export default function Facebook() {


    const [userAccessToken, setUserAccessToken] = useState([]);

    const getUserAccessToken = (e) => {
        e.preventDefault()
        FB.getLoginStatus(async function(response) {
            if (response.status === 'connected') {
                const userAccessToken = response.authResponse.accessToken;
                const userID = response.authResponse.userID
                console.log(response.authResponse)
                setUserAccessToken(userAccessToken)
                await postUserAccessTokenToLambda(userID, userAccessToken)
            }
        } );

    }
    const postUserAccessTokenToLambda = (userID, userAccessToken) => {
        const apiName = 'nvsocial';
        const path = '/settings/facebook/subscribeWebhook';
        const config = {
            response: true,
            body: {
                userID: userID,
                userAccessToken: userAccessToken
            }
        };

        return API.post(apiName, path, config)
    }


    return (
        <div style={{padding: "30px"}}>

            <div className="fb-login-button" data-width="" data-size="medium" data-button-type="continue_with"
                 data-layout="default" data-auto-logout-link="false" data-use-continue-as="false" data-scope="pages_manage_metadata">

            </div>
            <Button variant="contained" color="primary" onClick={getUserAccessToken}>
                get access token
            </Button>
            <div>{userAccessToken}</div>
        </div>
    )
}