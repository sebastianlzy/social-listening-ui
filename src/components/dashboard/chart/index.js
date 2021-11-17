import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../../common/Title';

// Generate Sales Data
import moment from 'moment'
import set from 'lodash/set'
import get from 'lodash/get'

function createData(time, amount) {
    return { time, amount };
}

const aggregateMentions = (mentions) => {
    return mentions.reduce((acc, mention) => {
        const createdAt = moment(mention.created_at).format("YYYY-MM-DD")
        const currVal = get(acc, `${createdAt}`, 0)
        set(acc, `${createdAt}`, currVal + 1)
        return acc
    }, {})
}

const convertToChartData = (aggregatedMentions) => {
    return Object.keys(aggregatedMentions)
        .sort((dateA, dateB) => moment(dateA).isAfter(dateB) ? 1 : -1 )
        .map((date) => {
            return createData(moment(date).format("MMM DD"), aggregatedMentions[date])
        }
    )
}

export default function Chart(props) {
    const {recentMentions} = props
    const theme = useTheme();

    const recentMentionsData = convertToChartData(aggregateMentions(recentMentions))
    
    return (
        <React.Fragment>
            <Title>Recent mentions this month</Title>
            <ResponsiveContainer>
                <LineChart
                    data={recentMentionsData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label
                            angle={270}
                            position="left"
                            style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                        >
                            Recent Mentions
                        </Label>
                    </YAxis>
                    <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}