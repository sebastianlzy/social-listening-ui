import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import AddNewRuleModal from "./AddNewRuleModal"
import deleteTwitterRules from './deleteTwitterRules'
import EnhancedTableToolbar from '../enhanceTable/EnhancedTableToolbar'
import EnhancedTableHead from '../enhanceTable/EnhancedTableHead'
import EnhancedTableBody from '../enhanceTable/EnhancedTableBody'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const headCells = [
    {id: 'id', numeric: false, disablePadding: true, label: 'ID'},
    {id: 'value', numeric: false, disablePadding: false, label: 'Value'},
    {id: 'tag', numeric: false, disablePadding: false, label: 'Tag'},
];

export default function TwitterRules(props) {
    const {rows, fetchTwitterRules} = props
    const classes = useStyles();
    const [selected, setSelected] = React.useState([]);
    const [openAddRuleModal, setOpenAddRuleModal] = React.useState(false);

    const handleOpenAddRuleModal = () => {
        setOpenAddRuleModal(true);
    };

    const handleCloseAddRuleModal = () => {
        setOpenAddRuleModal(false);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleDeleteTwitterRules = () => {
        return deleteTwitterRules(selected)
            .then(() => fetchTwitterRules())
            .catch((err) => {
                console.log(err)
            })
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    handleAdd={handleOpenAddRuleModal}
                    handleDelete={handleDeleteTwitterRules}
                />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='medium'
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rows.length}
                            headCells={headCells}
                        />
                        <EnhancedTableBody
                            rows={rows}
                            isSelected={isSelected}
                            handleClick={handleClick}
                        />
                    </Table>
                </TableContainer>
            </Paper>

            <AddNewRuleModal
                handleCloseAddRuleModal={handleCloseAddRuleModal}
                openAddRuleModal={openAddRuleModal}
                fetchTwitterRules={fetchTwitterRules}
            />
        </div>
    );
}
