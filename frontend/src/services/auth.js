import React from 'react';
import uuid from 'react-uuid';
import { Redirect, Route } from 'react-router-dom';

const protocol = process.env.REACT_APP_KEYCLOAK_PROTOCOL;
const host = process.env.REACT_APP_KEYCLOAK_HOST;
const port = process.env.REACT_APP_KEYCLOAK_PORT;
const realm = process.env.REACT_APP_KEYCLOAK_REALM;
const clientId = process.env.REACT_APP_KEYCLOAK_CLIENT_ID;

const url = protocol + "://" + host + ":" + port + "/auth";

let initOptions = {
  url: url, realm: realm, clientId: clientId, onLoad: 'login-required'
};

var keycloak = null;

export function initKeycloak() {
  keycloak = new window.Keycloak({
    url: initOptions.url,
    realm: initOptions.realm,
    clientId: initOptions.clientId,
  });
  return keycloak.init({onLoad: initOptions.onLoad});
}

export function updateKeycloakToken() {
  return keycloak.updateToken(30);
}

export function getKeycloakToken() {
  return keycloak.token;
}

export function goToProfile() {
  return protocol + "://" + host + ":" + port + "/auth/realms/" + realm + "/account/";
}

export function isAuthorized(roles) {
  if (keycloak && roles) {
    return roles.some(r => {
      const realm = keycloak.hasRealmRole(r);
      const resource = keycloak.hasResourceRole(r);
      return realm || resource;
    });
  }
}

export function AuthorizedElement({ roles, children }) {
  return isAuthorized(roles) && children;
}

export function PrivateRoute({ component: Component, roles, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return isAuthorized(roles)
          ? <Component key={uuid()} {...props}/>
          : <Redirect to={{ pathname: '/', }} />
      }}
    />
  )
}