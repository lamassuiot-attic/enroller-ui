import { getKeycloakToken } from '../../services/auth';

const protocol = process.env.REACT_APP_SCEP_PROTOCOL;
const host = process.env.REACT_APP_SCEP_HOST;
const port = process.env.REACT_APP_SCEP_PORT;
const path = process.env.REACT_APP_SCEP_PATH;

export function revokeCRT(crt) {
  const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + crt.serial;
  return fetch(fetchUrl, {
    method: "PUT",
    body: JSON.stringify(crt),
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}

export function getCRTs() {
  const fetchUrl = protocol + "://" + host + ":" + port + path;
  return fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + getKeycloakToken()
    }
  });
}
