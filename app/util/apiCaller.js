import 'whatwg-fetch';
import Config from './config';

const API_URL = Config.API_URL;

export default function callApi(endpoint, method = 'get', body) {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    method,
    body: JSON.stringify(body),
  })
  .then(response => {
	  response.json().then(json => ({ json, response }))
  })
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  })
  .then(
    response => response,
    error => error
  );
}
