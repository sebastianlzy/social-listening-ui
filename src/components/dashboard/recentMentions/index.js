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
                        <TableCell>Date</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Url</TableCell>
                        <TableCell>Text</TableCell>
                        <TableCell>English Text</TableCell>
                        <TableCell>Reply</TableCell>
                        <TableCell>Sentiment</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Lang</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recentMentions.map((row, idx) => (
                        <TableRow key={`recentMentions-${idx}`}>
                            <TableCell>{moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                            <TableCell>{row.data_source}</TableCell>
                            <TableCell><a href={row.url} target="_blank">{row.url == "" ? "" : "view"}</a></TableCell>
                            <TableCell>{row.text}</TableCell>
                            <TableCell>{row.english_text}</TableCell>
                            <TableCell><a href={row.reply_link} target="_blank">{row.reply_link == "" ? "" : "reply"}</a></TableCell>
                            <TableCell>{row.sentiment}</TableCell>
                            <TableCell>{row.score}</TableCell>
                            <TableCell>{row.language_code}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}