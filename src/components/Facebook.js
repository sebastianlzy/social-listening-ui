
/*global FB, a*/
import {useState} from "react";
import {API} from "aws-amplify";
import Button from '@material-ui/core/Button';

export default function Facebook() {


    const [webhookSubscriptionResult, setWebhookSubscriptionResult] = useState([]);

    const getUserAccessToken = (e) => {
        e.preventDefault()
        FB.getLoginStatus(async function(response) {
            if (response.status === 'connected') {
                const userAccessToken = response.authResponse.accessToken;
                const userID = response.authResponse.userID
                const webhookSubscriptionResponse = await postUserAccessTokenToLambda(userID, userAccessToken)
                setWebhookSubscriptionResult(webhookSubscriptionResponse.data.body)
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
                 data-layout="default" data-auto-logout-link="false" data-use-continue-as="false" data-scope="pages_manage_metadata,pages_messaging">

            </div>
            <Button variant="contained" color="primary" onClick={getUserAccessToken}>
                Subscribe to mentions from the Facebook page
            </Button>
            <div>{webhookSubscriptionResult}</div>
        </div>
    )
}