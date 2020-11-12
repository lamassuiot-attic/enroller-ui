import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Grid, Button } from '@material-ui/core';

import CSRModal from '../csr-modal';
import AlertBar from '../alert-bar';
import { downloadCRT, downloadCSR } from '../../services/api/enroller';
import { AuthorizedElement, updateKeycloakToken } from '../../services/auth';
import { useStyles } from './csr-edit-styles';

export default function CSREdit(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleDetailsChange = () => {
    setIsModalOpen(true);
  }

  const handleModalChange = () => {
    setIsModalOpen(false);
  }

  const handleDownloadCSRChange = () => {
    updateKeycloakToken().success(() =>
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
    )
  }

  const handleDownloadCRTChange = () => {
    updateKeycloakToken().success(() =>
      downloadCSR(props.csr)
        .then(
        (response) => {
          if (response.ok) {
            response.blob().then(
              (blob) => {
                setError(null);
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute('download', `csr-${props.csr.id}.csr` );
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
    )
  }
  
  const classes = useStyles();

  return(
    <React.Fragment>
      { error !== null && <AlertBar setMessage={setError} message={error} type= "error"/>}
      <Grid item xs={12}>
        <AuthorizedElement roles={["admin"]}>
          <Grid container spacing={2}>
              <Grid item xs={6}>
                <AuthorizedElement roles={["admin"]}><Button variant="contained" color="primary" onClick={handleDetailsChange} className={classes.button}>Details</Button></AuthorizedElement>
                <CSRModal csr={props.csr} open={isModalOpen} onModalChange={handleModalChange} setOpError={props.setOpError} setOpCorrect={props.setOpCorrect} onCSRUpdate={props.onCSRUpdate}/>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="primary" onClick={handleDownloadCSRChange} className={classes.button}>Download</Button>
              </Grid>
          </Grid>
        </AuthorizedElement>
        <AuthorizedElement roles={["operator"]}>
          <Button variant="contained" color="primary" fullWidth disabled={props.csr.status !== "APPROBED"} onClick={handleDownloadCRTChange} className={classes.button}>Download Certificate</Button>
        </AuthorizedElement>
      </Grid>
    </React.Fragment>
  )
}

CSREdit.propTypes = {
  csr: PropTypes.object,
  onCSRUpdate: PropTypes.func.isRequired,
  setOpError: PropTypes.func,
  setOpCorrect: PropTypes.func
};