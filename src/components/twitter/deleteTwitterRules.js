import { API } from 'aws-amplify';


export default function deleteTwitterRules(ids) {
    const apiName = 'nvsocial';
    const path = '/settings/twitter/rules';
    const config = {
        response: true,
        body: [...ids]
    };

    console.log("--------------------12-deleteTwitterRules-ids---------------------------")
    console.log(config)
    console.log("--------------------12-deleteTwitterRules-ids--------------------------")

    return API.del(apiName, path, config)

}