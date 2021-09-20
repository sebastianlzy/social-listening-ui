import {API} from 'aws-amplify';
import get from 'lodash/get'


const isNumberBetween =  (min, max) => (val) => {
    return val >= min && val <= max
}

export function updateComprehendConfiguration(positiveSentimentThreshold, negativeSentimentThreshold) {
    return async function() {


        const positiveSentimentThresholdFloat = parseFloat(positiveSentimentThreshold)
        const negativeSentimentThresholdFloat = parseFloat(negativeSentimentThreshold)
        const isNumberBetweenZeroAndOne = isNumberBetween(0, 1)


        if (
            isNaN(positiveSentimentThresholdFloat) ||
            isNaN(negativeSentimentThresholdFloat) ||
            !isNumberBetweenZeroAndOne(positiveSentimentThresholdFloat) ||
            !isNumberBetweenZeroAndOne(negativeSentimentThresholdFloat)
        ) {
            throw new Error("Threshold has to be between 0 and 1")
        }

        const configuration = await getMLConfiguration()
        await postFBConfiguration({
            ...configuration,
            "POSITIVE_SENTIMENT_CONFIDENCE_THRESHOLD": positiveSentimentThreshold,
            "NEGATIVE_SENTIMENT_CONFIDENCE_THRESHOLD": negativeSentimentThreshold
        })
    }
}

export async function getMLConfiguration() {
    const apiName = 'nvsocial';
    const path = '/settings/ml/configuration';
    const config = {
        response: true,
    };

    const configuration = await API.get(apiName, path, config)
    return get(configuration, 'data.body')
}


export default async function postFBConfiguration(configuration) {
    const apiName = 'nvsocial';
    const path = '/settings/ml/configuration';
    const config = {
        response: true,
        body: {
            configuration,
        }
    };

    return API.post(apiName, path, config)

}