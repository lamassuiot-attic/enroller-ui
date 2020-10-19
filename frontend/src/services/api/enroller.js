import { getKeycloakToken } from '../auth';

const protocol = process.env.REACT_APP_ENROLLER_PROTOCOL;
const host = process.env.REACT_APP_ENROLLER_HOST;
const port = process.env.REACT_APP_ENROLLER_PORT;
const path = process.env.REACT_APP_ENROLLER_PATH;


export function acceptCSR(csr) {
  const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + csr.id;
  csr.status = "APPROBED"
  return fetch(fetchUrl, {
    method: "PUT",
    body: JSON.stringify(csr),
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}

export function denyCSR(csr) {
  const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + csr.id;
  csr.status = "DENIED"
  return fetch(fetchUrl, {
    method: "PUT",
    body: JSON.stringify(csr),
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}

export function removeCSR(csr){
  const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + csr.id;
  return fetch(fetchUrl, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}

export function downloadCSR(csr) {
  const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + csr.id + "/file";
  return fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}

export function getCSRs() {
  const fetchUrl = protocol + "://" + host + ":" + port + path;
  return fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}

export function postCSR(data) {
  const fetchUrl = protocol + "://" + host + ":" + port + path;
  return fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + getKeycloakToken(),
      "Content-Type": "application/pkcs10"
    },
    body: data
  });
}

export function downloadCRT(csr) {
  const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + csr.id + "/crt";
  return fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}