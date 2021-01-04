import React, { useState } from 'react';

import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import { postCSR } from '../../services/api/enroller';
import { updateKeycloakToken } from '../../services/auth/auth';
import AlertBar from '../../components/alert-bar';

export default function NewCSR() {
  const [CSRValue, setCSRValue] = useState('');
  const [error, setError] = useState(null);
  const [correct, setCorrect] = useState(null);

  const handleValueChange = (event) => {
    setCSRValue(event.target.value);
  };

  const handleValueSubmit = (event) => {
    updateKeycloakToken()
      .then(() => {
        postCSR(CSRValue)
          .then((response) => {
            if (response.ok) {
              setCSRValue('');
              setError(null);
              setCorrect('CSR successfully submmited');
            } else {
              response.text().then((text) => {
                setCSRValue('');
                setError(text);
                setCorrect(null);
              });
            }
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => setError(error.message));
    event.preventDefault();
  };

  return (
    <React.Fragment>
      {error !== null && (
        <AlertBar setMessage={setError} message={error} type="error" />
      )}
      {correct !== null && (
        <AlertBar setMessage={setCorrect} message={correct} type="success" />
      )}
      <Container maxWidth="sm">
        <form onSubmit={handleValueSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                Insert your CSR (Certificate Signing Request)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Insert here"
                multiline
                fullWidth
                rows={20}
                onChange={handleValueChange}
                value={CSRValue}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Insert
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
}
