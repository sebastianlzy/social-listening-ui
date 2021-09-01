import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import React from "react";
import TableBody from "@material-ui/core/TableBody";
import PropTypes from "prop-types";
import EnhancedTableHead from "./EnhancedTableHead";

function EnhancedTableBody(props) {
    const {rows, isSelected, handleClick} = props;

    return (
        <TableBody>
            {rows
                .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                        <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{'aria-labelledby': labelId}}
                                />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                {row.id}
                            </TableCell>
                            <TableCell>{row.value}</TableCell>
                            <TableCell>{row.tag}</TableCell>
                        </TableRow>
                    );
                })}
        </TableBody>
    );
}

EnhancedTableHead.propTypes = {
    rows: PropTypes.array.isRequired,
    isSelected: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired,
};

export default EnhancedTableBody