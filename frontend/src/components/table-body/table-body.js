import React from 'react';
import PropTypes from 'prop-types';

import { TableBody, TableRow, TableCell, Checkbox } from '@material-ui/core';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function CertsTableBody(props) {

    const handleClick = (event, property) => {
        props.onHandleClick(event, property);
    }

    const isSelected = (name) => {
       return props.isSelected(name);
    }

    return (
        <TableBody>
            {stableSort(props.crts, getComparator(props.order, props.orderBy))
                .slice(props.page * props.rowsPerPage, props.page * props.rowsPerPage + props.rowsPerPage)
                .map((crt, index) => {
                    const crtClick = crt.status === "V" ? handleClick : () => {};
                    const isItemSelected = isSelected(crt.dn);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const expirationDate = crt.expirationDate.replace(/^(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)Z$/,"$1/$2/$3 $4:$5:$6");
                    const revocationDate = crt.revocationDate !== "" && crt.revocationDate.replace(/^(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)Z$/,"$1/$2/$3 $4:$5:$6");
                    return (
                        <TableRow
                            hover
                            onClick={(event) => crtClick(event, crt.dn)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={crt.dn}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{'aria-labelledby': labelId}}
                                        disabled={crt.status === "R"}
                                        indeterminate={crt.status === "R"}
                                    />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                {crt.dn}
                            </TableCell>
                            <TableCell align="left">{crt.status === "V" ? "Valid" : "Revoked"}</TableCell>
                            <TableCell align="left">{expirationDate}</TableCell>
                            <TableCell align="left">{revocationDate}</TableCell>
                            <TableCell align="right">{crt.serial}</TableCell>
                            <TableCell align="left">{crt.key}</TableCell>
                            <TableCell align="right">{crt.keySize}</TableCell>
                            <TableCell align="left">{crt.crtpath}</TableCell>
                        </TableRow>
                    );
                    })}
                    {props.emptyRows > 0 && (
                        <TableRow style={{ height: 33 * props.emptyRows}}>
                            <TableCell colSpan={6}/>
                        </TableRow>
                    )}
        </TableBody>
    );
}

CertsTableBody.propTypes = {
    onHandleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    emptyRows: PropTypes.number.isRequired,
    crts: PropTypes.array.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};