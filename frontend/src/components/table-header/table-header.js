import React from 'react';
import PropTypes from 'prop-types';

import { TableSortLabel, TableHead, TableRow, TableCell } from '@material-ui/core';

import { useStyles } from './table-header-styles';

const headCells = [
    {id: 'dn', numeric: false, disablePadding: true, label: 'Distinguished Name'},
    {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
    {id: 'expirationDate', numeric: false, disablePadding: false, label: 'Expiration Date'},
    {id: 'revocationDate', numeric: false, disablePadding: false, label: 'Revocation Date'},
    {id: 'serial', numeric: false, disablePadding: false, label: 'Serial Number'},
    {id: 'filename', numeric: false, disablePadding: false, label: 'Filename'}
]

export default function CertsTableHeader(props) {
    const { order, orderBy, onRequestSort } = props;
    const classes = useStyles();
    
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"/>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right': 'left'}
                        padding={headCell.disablePadding ? 'none': 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending': 'sorted ascending'}
                                </span>
                            ): null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

CertsTableHeader.propTypes = {
    numSelected: PropTypes.number.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired
};