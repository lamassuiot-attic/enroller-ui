import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';
import AlertBar from '../alert-bar';

import { acceptCSR, denyCSR, removeCSR } from '../../services/api/enroller';
import { useStyles } from './csr-modal-edit-styles';

import { downloadCRT } from '../../services/api/enroller';

export default function CSRModalEdit(props) {

  const [error, setError] = useState(null);
  
  const handleAcceptChange = () => {
    props.onCSRStatusChange(acceptCSR);
  }

  const handleDenyChange = () => {
    props.onCSRStatusChange(denyCSR);
  }

  const handleRemoveChange = () => {
    props.onCSRStatusChange(removeCSR);
  }

  const handleDownloadCert = () => {
    downloadCRT(props.csr)
      .then(
        (response) => {
          if (response.ok) {
            response.blob().then(
              (blob) => {
                setError(null);
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute('download', `crt-${props.csr.id}.crt` );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
              }
            )
          }else{
            response.text().then(
              (text) => {
                setError(text);
              }
            )
          }
        }).catch( error => setError(error.message))
  }

  const classes = useStyles();

  const newOptions = 
      <React.Fragment>   
        { error !== null && <AlertBar setMessage={setError} message={error} type= "error"/>}   
        <Grid item xs={4}>
          <Button color="default" variant="contained" onClick={handleAcceptChange} className={classes.button}>Accept</Button>
        </Grid>
        <Grid item xs={4}>
          <Button color="primary" variant="contained" onClick={handleDenyChange} className={classes.button}>Deny</Button>
        </Grid>
        <Grid item xs={4}>
          <Button color="secondary" variant="contained" onClick={handleRemoveChange} className={classes.button}>Remove</Button>
        </Grid>
      </React.Fragment>

  const deniedOptions =
    <React.Fragment>
      { error !== null && <AlertBar message={error} type= "error"/>}
      <Grid item xs={12}>
          <Button color="secondary" variant="contained" onClick={handleRemoveChange} className={classes.button}>Remove</Button>
      </Grid>
    </React.Fragment>

  const approbedOptions = 
    <React.Fragment>
      { error !== null && <AlertBar message={error} type= "error"/>}
      <Grid item xs={7}>
          <Button color="default" variant="contained" onClick={handleDownloadCert} className={classes.button}>Download Certificate</Button>
      </Grid>
      <Grid item xs={5}>
          <Button color="secondary" variant="contained" onClick={handleRemoveChange} className={classes.button}>Remove</Button>
      </Grid>
    </React.Fragment>


  switch(props.csr.status) {
    case "NEW":
      return newOptions;
    case "APPROBED":
      return approbedOptions;
    case "DENIED":
      return deniedOptions;
    default:
      return newOptions;
  }
}

CSRModalEdit.propTypes = {
  csr: PropTypes.object,
  onCSRStatusChange: PropTypes.func.isRequired
};