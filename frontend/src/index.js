import React from 'react';
import uuid from 'react-uuid';
import 'typeface-roboto';
import { render } from 'react-dom';
import { Switch, Route, HashRouter } from 'react-router-dom';
import dotenv from 'dotenv';

import { CssBaseline } from '@material-ui/core';

import { initKeycloak } from './services/auth';
import CertsTable from './routes/certs';
import CSRsList from './routes';
import NewCSR from './routes/new';
import CAsList from './routes/ca-list';
import ScrollToTop from './utils/scroll-to-top';
import LamassuAppBar from './components/app-bar';

import { PrivateRoute } from './services/auth';

dotenv.config();

initKeycloak().success( (auth) => {
  if(!auth) {
    window.location.reload();
  } else {
    render((
      <HashRouter>
        <CssBaseline/>
        <LamassuAppBar/>
        <ScrollToTop/>
        <Switch>
            <Route exact path="/" render={(props) => (<CSRsList key={uuid()}{...props}/>)}/>
            <Route exact path="/new" render={(props) => (<NewCSR key={uuid()}{...props}/>)}/>
            <Route exact path="/cas" render={(props) => (<CAsList key={uuid()}{...props}/>)}/>
            <PrivateRoute component={CertsTable} path="/certs" roles={["admin"]}/>
        </Switch>
      </HashRouter>
    ), document.getElementById('root'));
  }
});

