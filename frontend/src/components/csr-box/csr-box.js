import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Grid } from '@material-ui/core';

import CSRInfo from '../csr-info';
import CSREdit from '../csr-edit';
import { useStyles } from './csr-box-styles';

export default function CSRBox(props) {
  const classes = useStyles();
  return (
      <Grid item xs={4}>
        <Paper className={classes.root}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <CSRInfo csr={props.csr}/>
              </Grid>
              <CSREdit csr={props.csr} setOpError={props.setOpError} setOpCorrect={props.setOpCorrect} onCSRUpdate={props.onCSRUpdate}/>
          </Grid>
        </Paper>
      </Grid>
  )
}

CSRBox.propTypes = {
  csr: PropTypes.object,
  onCSRUpdate: PropTypes.func.isRequired,
  setOpError: PropTypes.func,
  setOpCorrect: PropTypes.func
};