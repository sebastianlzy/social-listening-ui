import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../Title';

// function preventDefault(event) {
//     event.preventDefault();
// }

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function SentimentScore() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Title>Avg. Sentiment Score</Title>
            <Typography component="p" variant="h4">
                30
            </Typography>
            <Typography color="textSecondary" className={classes.depositContext}>
                as of Aug 31, 2021
            </Typography>
            {/*<div>*/}
            {/*    <Link color="primary" href="#" onClick={preventDefault}>*/}
            {/*        View balance*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </React.Fragment>
    );
}