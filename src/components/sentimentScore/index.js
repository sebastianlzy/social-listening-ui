import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../Title';
import toLower from 'lodash/toLower'
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import moment from 'moment'

// function preventDefault(event) {
//     event.preventDefault();
// }

const useStyles = makeStyles({
    depositContext: {

    },
    greenColor: {
        color: green[700],
        fontSize: "1.2em"
    },
    redColor: {
        color: red[400],
        fontSize: "1.2em",
    }
});

const countSentiments = (recentMentions) => {

    return recentMentions.reduce((acc, recentMention) => {
        console.log("--------------------20--toLower(recentMention.sentiment)---------------------------")
        console.log(toLower(recentMention.sentiment))
        console.log("--------------------20--toLower(recentMention.sentiment)--------------------------")
        acc[toLower(recentMention.sentiment)] = acc[toLower(recentMention.sentiment)] + 1

        return acc
    }, {positive: 0, neutral: 0, negative: 0})

}


export default function SentimentScore(props) {
    const classes = useStyles();
    const {recentMentions} = props

    const sentimentsCount = countSentiments(recentMentions)

    return (
        <React.Fragment>
            <Title>{moment().format("MMMM")} Score</Title>
            <Typography className={classes.greenColor} component="h1">
                Positive: {sentimentsCount['positive']}
            </Typography>
            <Typography  color="primary" className={classes.redColor} component="h4">
                Negative: {sentimentsCount['negative']}
            </Typography>

            <Typography color="textSecondary" style={{fontSize: "1.2em"}}>
                Neutral: {sentimentsCount['neutral']}
            </Typography>

            {/*<div>*/}
            {/*    <Link color="primary" href="#" onClick={preventDefault}>*/}
            {/*        View balance*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </React.Fragment>
    );
}