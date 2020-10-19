import React from 'react';
import PropTypes from 'prop-types';

import { FilterList as FilterListIcon } from '@material-ui/icons';
import { Typography, IconButton, Toolbar, Tooltip } from '@material-ui/core';

import { useStyles } from './table-toolbar-styles';

export default function CertsTableToolbar(props) {
    const classes = useStyles();
    const { numSelected } = props;

    return (
        <Toolbar className={classes.root}>
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Signed Certificates
            </Typography>

            {numSelected <= 0 && (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    )
}

CertsTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};