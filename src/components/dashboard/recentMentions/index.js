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
                        <TableCell>Text</TableCell>
                        <TableCell>Language</TableCell>
                        <TableCell>Sentiment</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recentMentions.map((row, idx) => (
                        <TableRow key={`recentMentions-${idx}`}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                            <TableCell>{row.source}</TableCell>
                            <TableCell>{row.text}</TableCell>
                            <TableCell>{row.language_code}</TableCell>
                            <TableCell>{row.sentiment}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}