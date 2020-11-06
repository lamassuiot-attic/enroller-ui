import { getKeycloakToken } from '../auth';

const protocol = process.env.REACT_APP_CA_PROTOCOL;
const host = process.env.REACT_APP_CA_HOST;
const port = process.env.REACT_APP_CA_PORT;
const path = process.env.REACT_APP_CA_PATH;


export function getCAs() {
    const fetchUrl = protocol + "://" + host + ":" + port + path;
    return fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + getKeycloakToken()
      }
    });
}

export function getCAInfo(CA) {
    const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + CA;
    return fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + getKeycloakToken()
      }
    });
}

export function deleteCA(CA) {
    const fetchUrl = protocol + "://" + host + ":" + port + path + "/" + CA;
    return fetch(fetchUrl, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + getKeycloakToken()
      }
    });
}