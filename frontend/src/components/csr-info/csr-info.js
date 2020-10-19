import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';

export default function CSRInfo(props) {
  const ou = props.csr.ou;
  const mail = props.csr.mail;
  const csrPath = props.csr.csrpath;

  return (
      <React.Fragment>
        <Typography variant="subtitle1" component="h2">
          ID: {props.csr.id} CN: {props.csr.cn} Status: {props.csr.status}
        </Typography>
        <Typography variant="body1" component="h3">
          C: {props.csr.c} ST: {props.csr.st} L: {props.csr.l} O: {props.csr.o}
        </Typography>
        <Typography variant="body2" component="h4">
        {ou !== "" && <p>OU: {ou} </p>}{mail !== "" && <p>EMAIL: {mail} </p>}{csrPath !== "" && <p>CSRFilePath: {csrPath}</p>}
        </Typography>
      </React.Fragment>
  )
}

CSRInfo.propTypes = {
  csr: PropTypes.object
};