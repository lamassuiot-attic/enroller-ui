import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Error as ErrorIcon, CheckCircle as CheckCircleIcon, Close as CloseIcon } from '@material-ui/icons';

import { useStyles } from './alert-bar-styles';
 
export default function AlertBar(props) {
  
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    props.setMessage(null);
  }

  const classes = useStyles();
  const type = props.type;
  const typeClassName = (type === "error") ? classes.error : classes.success;

  return (
      <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <SnackbarContent
          className={typeClassName}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
            {type === "error" ? (
              <ErrorIcon className={classes.icon}/>
            ) : (
              <CheckCircleIcon className={classes.icon}/>
            )}
              {props.message}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon className={classes.icon}/>
            </IconButton>
          ]}/>

      </Snackbar>
  )
}

AlertBar.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}