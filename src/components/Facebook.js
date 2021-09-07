
/*global FB, a*/
import {useEffect, useState} from "react";

export default function Facebook() {


    const [accessToken, setAccessToken] = useState([]);

    useEffect(() => {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                const accessToken = response.authResponse.accessToken;
                console.log(accessToken)
                setAccessToken(accessToken)
            }
        } );
    }, [])




    return (
        <div>
            Facebook settings
            <div>{accessToken}</div>
        </div>
    )
}