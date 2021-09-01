import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from './chart';
import SentimentScore from './sentimentScore';
import RecentMentions from './recentMentions';
import Copyright from './Copyright'
import clsx from "clsx";

export default function Dashboard() {
    const useDashboardStyles = makeStyles((theme) => ({
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        fixedHeight: {
            height: 240,
        },
        container: {
            padding: theme.spacing(2)
        }
    }))
    const classes = useDashboardStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                {/*Chart*/}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper className={fixedHeightPaper}>
                        <Chart />
                    </Paper>
                </Grid>
                {/*Overall sentiment*/}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                        <SentimentScore />
                    </Paper>
                </Grid>
                {/*Sentiments*/}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <RecentMentions />
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
                <Copyright />
            </Box>
        </Container>
    )
}
