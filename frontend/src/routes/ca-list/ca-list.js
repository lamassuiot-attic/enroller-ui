import React, { useState, useEffect } from 'react';

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Typography,
  Divider,
  Container,
  Button,
} from '@material-ui/core';

import { deleteCA, getCAInfo, getCAs } from '../../services/api/ca';
import { updateKeycloakToken } from '../../services/auth/auth';
import AlertBar from '../../components/alert-bar';

import { useStyles } from './ca-list-styles';

export default function CAsList() {
  const [CAInfo, setCAInfo] = useState(null);
  const [CAs, setCAs] = useState(null);
  const [selectedCA, setSelectedCA] = useState(null);
  const [error, setError] = useState(null);
  const [correct, setCorrect] = useState(null);

  const classes = useStyles();

  const getCAS = () => {
    updateKeycloakToken()
      .then(() => {
        getCAs()
          .then((response) => {
            if (response.ok) {
              response.json().then((result) => {
                if (result.CAs !== undefined) {
                  setCAs(result.CAs.CAs);
                  setError(null);
                }
              });
            } else {
              response.text().then((text) => {
                setError(text);
              });
            }
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => setError(error.message));
  };

  const handleCAChange = (CA) => {
    setSelectedCA(CA);
    updateKeycloakToken()
      .then(() => {
        getCAInfo(CA)
          .then((response) => {
            if (response.ok) {
              response.json().then((result) => {
                if (result.CAInfo !== undefined) {
                  setCAInfo(result.CAInfo);
                  setError(null);
                }
              });
            } else {
              response.text().then((text) => {
                setError(text);
              });
            }
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => setError(error.message));
  };

  const handleRegister = (CA) => {
    setCorrect(CA + ' successfully registered');
  };

  const handleRevoke = (CA) => {
    updateKeycloakToken()
      .then(() => {
        deleteCA(CA)
          .then((response) => {
            if (response.ok) {
              setCorrect(selectedCA + ' successfully revoked');
              getCAS();
              setSelectedCA(null);
              setCAInfo(null);
            } else {
              response.text().then((text) => {
                setError(text);
              });
            }
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => setError(error.message));
  };

  useEffect(() => {
    getCAS();
  }, []);

  return (
    <Container maxWidth="md">
      {error !== null && (
        <AlertBar setMessage={setError} message={error} type="error" />
      )}
      {correct !== null && (
        <AlertBar setMessage={setCorrect} message={correct} type="success" />
      )}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">List of registered CAs</Typography>
            </Grid>
            {CAs !== null && (
              <Grid item xs={12}>
                <List component="nav" className={classes.list}>
                  {CAs.map((ca, i) => (
                    <React.Fragment key={ca.ca_name}>
                      <ListItem
                        key={ca.ca_name}
                        button
                        onClick={() => handleCAChange(ca.ca_name)}
                      >
                        <ListItemText key={ca.ca_name} primary={ca.ca_name} />
                      </ListItem>
                      {i + 1 < CAs.length && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            {CAInfo !== null && (
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant="h6">CA detailed information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" className={classes.card}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        CN: {CAInfo.cn}
                        <br />
                        Key Type: {CAInfo.key_type}
                        <br />
                        Key Bits: {CAInfo.key_bits}
                      </Typography>
                      <Typography variant="body1">
                        C: {CAInfo.c}
                        <br />
                        ST: {CAInfo.st}
                        <br />
                        L: {CAInfo.l}
                        <br />
                        O: {CAInfo.o}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={selectedCA == null}
            onClick={() => handleRegister(selectedCA)}
          >
            Register into Cloud provider
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            disabled={selectedCA == null}
            onClick={() => handleRevoke(selectedCA)}
          >
            Revoke CA
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
