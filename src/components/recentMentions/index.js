import React, {useEffect, useState} from 'react';
import moment from "moment"
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Title';
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import getRecentMentions from "./getRecentMentions";


function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function Orders() {
    const classes = useStyles();

    const [recentMentions, setRecentMentions] = useState([]);

    useEffect(() => {
        fetchRecentMentions()
    })

    const fetchRecentMentions = () => {
        return getRecentMentions()
            .then((resp) => {

                let newRecentMentions = get(resp, 'data.body')
                if (!isEqual(newRecentMentions, recentMentions)) {
                    setRecentMentions(newRecentMentions)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

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
                        <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                            <TableCell>{row.source}</TableCell>
                            <TableCell>{row.originaltext}</TableCell>
                            <TableCell>{row.language}</TableCell>
                            <TableCell>{row.sentiment}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}