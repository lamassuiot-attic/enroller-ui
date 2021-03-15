import React, { useState, useEffect } from 'react';

import { Grid, CircularProgress } from '@material-ui/core';

import CSRBox from '../components/csr-box';
import AlertBar from '../components/alert-bar';
import { getCSRs } from '../services/api/enroller';
import { updateKeycloakToken } from '../services/auth/auth';

export default function CSRsList() {
  const [error, setError] = useState(null);
  const [csrs, setCSRs] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [opError, setOpError] = useState(null);
  const [opCorrect, setOpCorrect] = useState(null);

  const getCSRS = () => {
    updateKeycloakToken().success(() => {
      getCSRs()
        .then((response) => {
          if (response.ok) {
            response.json().then((result) => {
              if (result._embedded !== undefined) {
                setIsLoaded(true);
                setCSRs(result._embedded.csr);
              }
            });
          } else {
            response.text().then((text) => {
              setIsLoaded(false);
              setError(text);
            });
          }
        })
        .catch((error) => setError(error.message));
    });
  };

  useEffect(() => {
    getCSRS();
  }, []);

  return (
    <React.Fragment>
      {error !== null && (
        <AlertBar setMessage={setError} message={error} type="error" />
      )}
      {opError !== null && (
        <AlertBar setMessage={setOpError} message={opError} type="error" />
      )}
      {opCorrect !== null && (
        <AlertBar
          setMessage={setOpCorrect}
          message={opCorrect}
          type="success"
        />
      )}
      {error === null && !isLoaded && csrs !== null && <CircularProgress />}
      {error === null && isLoaded && csrs !== null && (
        <Grid container spacing={2}>
          {csrs.length > 1 ? (
            csrs.map((csr) => (
              <CSRBox
                key={csr.id.toString()}
                csr={csr}
                setOpError={setOpError}
                setOpCorrect={setOpCorrect}
                onCSRUpdate={getCSRS}
              />
            ))
          ) : (
            <CSRBox
              key={csrs.id.toString()}
              csr={csrs}
              setOpError={setOpError}
              setOpCorrect={setOpCorrect}
              onCSRUpdate={getCSRS}
            />
          )}
        </Grid>
      )}
    </React.Fragment>
  );
}
