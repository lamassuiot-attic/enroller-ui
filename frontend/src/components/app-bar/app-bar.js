import React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Typography, Toolbar, Button, Avatar } from '@material-ui/core';

import { goToProfile } from '../../services/auth';
import { useStyles } from './app-bar-styles';

import { AuthorizedElement } from '../../services/auth';

export default function LamassuAppBar() {

  const handleProfileChange = () => {
    const accountUrl = goToProfile();
    window.open(accountUrl, "_blank");
  } 
  const classes = useStyles();
  
  return(
      <div className={classes.root}>
        <AppBar position="static" color="inherit" elevation={0}>
          <Toolbar className={classes.toolbar}>
            <Avatar variant="square" alt="Lamassu Logo" src="lamassu_logo.png"></Avatar>
            <Typography variant="h6" noWrap className={classes.typoAppBarTitle}>Lamassu Enroller (RA)</Typography>
            <AuthorizedElement roles={["admin"]}><Button component={Link} to="/" replace variant="text">Home</Button></AuthorizedElement>
            <Button component={Link} to="/cas" replace variant="text">CAs</Button>
            <Button component={Link} to="/new" replace variant="text">New</Button>
            <AuthorizedElement roles={["admin"]}><Button component={Link} to="/certs" replace variant="text">Certificates list</Button></AuthorizedElement>
            <Button variant="text" onClick={handleProfileChange}>Account</Button>
          </Toolbar>
        </AppBar>
      </div>
  );
}
