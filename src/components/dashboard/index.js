import React, {useEffect, useState} from 'react';
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
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import {useBackdropContext} from "../contextProvider/backdropContextProvider";
import getRecentMentions from './getRecentMentions'
import moment from 'moment'

export default function Index() {

    const [recentMentions, setRecentMentions] = useState([]);
    const {setIsBackdropShown, setNotificationMessage} = useBackdropContext()

    useEffect(() => {
        setIsBackdropShown(true)
        fetchRecentMentions()
            .then(() => {
                setIsBackdropShown(false)
            })
    }, [])

    const cacheKey = "recentMentions"

    const fetchRecentMentionsFromLocalStorage = () => {


        const itemStr = localStorage.getItem(cacheKey)
        if (!itemStr) {
            return Promise.reject()
        }
        const item = JSON.parse(itemStr)
        if (moment().isAfter(item.expiry)) {
            localStorage.removeItem(cacheKey)
            return Promise.reject()
        }

        setNotificationMessage("Recent Mentions retrieved from cache")
        return Promise.resolve(item.recentMentions)

    }

    const fetchRecentMentions = () => {

        return fetchRecentMentionsFromLocalStorage()
            .catch(() => {
                return getRecentMentions().then((resp) => {
                    const newRecentMentions = get(resp, 'data.body')
                    const item = {
                        recentMentions: newRecentMentions,
                        expiry: moment().add(5, 'm')
                    }

                    localStorage.setItem(cacheKey, JSON.stringify(item))
                    return newRecentMentions
                })
            })
            .then((newRecentMentions) => {
                if (!isEqual(newRecentMentions, recentMentions)) {
                    setRecentMentions(newRecentMentions ? newRecentMentions : [])
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

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
                        <Chart
                            recentMentions={recentMentions}
                        />
                    </Paper>
                </Grid>
                {/*Overall sentiment*/}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                        <SentimentScore
                            recentMentions={recentMentions}
                        />
                    </Paper>
                </Grid>
                {/*Sentiments*/}
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <RecentMentions
                            recentMentions={recentMentions}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
                <Copyright/>
            </Box>
        </Container>
    )
}
