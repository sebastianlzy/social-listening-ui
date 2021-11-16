import React from 'react';
import moment from "moment"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../../common/Title';


export default function RecentMentions(props) {

    const {recentMentions} = props
    return (
        <React.Fragment>
            <Title>Recent Mentions</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Url</TableCell>
                        <TableCell>Text</TableCell>
                        <TableCell>Reply</TableCell>
                        <TableCell>Language</TableCell>
                        <TableCell>Sentiment</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recentMentions.map((row, idx) => (
                        <TableRow key={`recentMentions-${idx}`}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                            <TableCell>{row.data_source}</TableCell>
                            <TableCell><a href={row.url}>{row.url == "" ? "" : "view"}</a></TableCell>
                            <TableCell>{row.text}</TableCell>
                            <TableCell><a href={row.reply_link}>{row.reply_link == "" ? "" : "reply"}</a></TableCell>
                            <TableCell>{row.language_code}</TableCell>
                            <TableCell>{row.sentiment}</TableCell>
                            <TableCell>{row.score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}