import React, { useState, useEffect } from 'react';

import {
  Table,
  TableContainer,
  TablePagination,
  Paper,
  CircularProgress,
  Container,
  Button,
  Box,
} from '@material-ui/core';

import CertsTableToolbar from '../../components/table-toolbar';
import CertsTableHeader from '../../components/table-header';
import CertsTableBody from '../../components/table-body';
import AlertBar from '../../components/alert-bar';
import { getCRTs, revokeCRT } from '../../services/api/scep';
import { useStyles } from './certs-table-styles';
import { updateKeycloakToken } from '../../services/auth/auth';

export default function CertsTable() {
  const classes = useStyles();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('dn');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const [revokeError, setRevokeError] = useState(null);
  const [correctRevoke, setCorrectRevoke] = useState(null);
  const [crts, setCRTs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getCRTS = () => {
    updateKeycloakToken()
      .then(() => {
        getCRTs()
          .then((response) => {
            if (response.ok) {
              response.json().then((result) => {
                if (result.CRTs !== undefined) {
                  setIsLoaded(true);
                  setCRTs(result.CRTs.CRTs);
                } else {
                  setIsLoaded(false);
                  setError('Database is empty');
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
      })
      .catch((error) => setError(error.message));
  };

  const revokeCRTS = (crt) => {
    updateKeycloakToken()
      .then(() => {
        revokeCRT(crt)
          .then((response) => {
            if (response.ok) {
              response.json().then((result) => {
                getCRTS();
                setRevokeError(null);
                setCorrectRevoke('Certificate successfully revoked');
              });
            } else {
              response.text().then((text) => {
                getCRTS();
                setRevokeError(text);
                setCorrectRevoke(null);
              });
            }
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => setError(error.message));
  };

  useEffect(() => {
    getCRTS();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    if (selectedIndex !== -1) {
      setSelected([]);
    } else {
      setSelected([name]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRevokeClick = () => {
    const selectedCRT = crts.find((crt) => crt.dn === selected[0]);
    revokeCRTS(selectedCRT);
    setSelected([]);
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, crts.length - page * rowsPerPage);

  return (
    <React.Fragment>
      {error !== null && (
        <AlertBar setMessage={setError} message={error} type="error" />
      )}
      {correctRevoke !== null && (
        <AlertBar
          setMessage={setCorrectRevoke}
          message={correctRevoke}
          type="success"
        />
      )}
      {revokeError !== null && (
        <AlertBar
          setMessage={setRevokeError}
          message={revokeError}
          type="error"
        />
      )}
      {error === null && !isLoaded && crts !== null && <CircularProgress />}
      {error === null && isLoaded && crts !== null && (
        <Container maxWidth="lg">
          <Paper className={classes.paper}>
            <CertsTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size="medium"
                aria-label="enhanced table"
              >
                <CertsTableHeader
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={crts.length}
                />
                <CertsTableBody
                  onHandleClick={handleClick}
                  isSelected={isSelected}
                  emptyRows={emptyRows}
                  crts={crts}
                  order={order}
                  orderBy={orderBy}
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={crts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <Box textAlign="center">
              <Button
                color="secondary"
                variant="contained"
                onClick={handleRevokeClick}
                disabled={selected.length === 0}
              >
                Revoke
              </Button>
            </Box>
          </Paper>
        </Container>
      )}
    </React.Fragment>
  );
}
