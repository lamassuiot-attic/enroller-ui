import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

import CSRInfo from '../csr-info';
import CSRModalEdit from '../csr-modal-edit';
import { updateKeycloakToken } from '../../services/auth/auth';

export default function CSRModal(props) {
  const [csr, setCSR] = useState(props.csr);

  const handleChange = () => {
    props.onModalChange();
  };

  const handleInputChange = (operation) => {
    updateKeycloakToken().success(() => {
      operation(props.csr)
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data);
              props.onCSRUpdate();
              setCSR(data);
              props.setOpCorrect('Operation successful');
              props.setOpError(null);
            });
          } else {
            response.text().then((text) => {
              setCSR(props.csr);
              props.setOpError(text);
              props.setOpCorrect(null);
            });
          }
        })
        .catch((error) => props.setOpError(error.message));
      handleChange();
    });
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={handleChange}
        aria-labelledby="simple-dialog-title"
        open={props.open}
      >
        <DialogTitle>CSR Details</DialogTitle>
        <DialogContent dividers>
          <CSRInfo csr={csr} />
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2}>
            <CSRModalEdit csr={csr} onCSRStatusChange={handleInputChange} />
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

CSRModal.propTypes = {
  csr: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onModalChange: PropTypes.func.isRequired,
  onCSRUpdate: PropTypes.func.isRequired,
  setOpError: PropTypes.func,
  setOpCorrect: PropTypes.func,
};
