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

const data = [
    createData('Aug 23', 25),
    createData('Aug 24', 1),
    createData('Aug 25', -25),
    createData('Aug 26', 3),
    createData('Aug 27', 100),
    createData('Aug 28', 50),
    createData('Aug 29', 40),
    createData('Aug 30', 10),
    createData('Aug 31', -20),
];

const aggregateMentions = (mentions) => {
    return mentions.reduce((acc, mention) => {
        const createdAt = moment(mention.created_at).format("MMM DD")
        const currVal = get(acc, `${createdAt}`, 0)
        set(acc, `${createdAt}`, currVal + 1)
        return acc
    }, {})
}

const convertToChartData = (aggregatedMentions) => {
    return Object.keys(aggregatedMentions).map((date) => {
        return createData(date, aggregatedMentions[date])
    })
}

export default function Chart(props) {
    const {recentMentions} = props
    const theme = useTheme();

    const recentMentionsData = convertToChartData(aggregateMentions(recentMentions))
    
    return (
        <React.Fragment>
            <Title>Last 7 days</Title>
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