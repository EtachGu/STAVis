import 'whatwg-fetch';
import Config from './config';

const API_URL = Config.API_URL;


// 解析通过网络响应返回来的JSON字符串
function parseJSON(response) {
	return response.json();
}

// 检查网络响应返回是否正常，如果不正常就抛出一个错误
function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

export default function callApi(endpoint, method = 'get', body) {
  return fetch(`${API_URL}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
	  mode: 'core',
    method,
    body: JSON.stringify(body),
  })
  .then(checkStatus)
  .then(parseJSON)
  .then((data) => ({
	  data,
  }))
  .catch((err) => ({
	  err,
  }));
}
