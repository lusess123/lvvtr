'use catch';
import $ from 'jquery';
import fetch from 'isomorphic-fetch';



// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call WORKFLOW API');

export function callApi(endpoint, options, params, header) {

   // let token = authToken.get();

    let ts = new Date().getTime();
    let defaultOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           // 'Ml-Auth-Token': token
        }
    };

    if (header && header['Content-Type'] === 'multipart/form-data') {
        delete defaultOptions.headers['Content-Type'];
    }

    defaultOptions = Object.assign({}, defaultOptions, {
        type: options.method || 'GET',
        async: options.async || false,
        url: endpoint
        , ...params
    });
    if (params && params.requestType) {
      delete defaultOptions.method;
      defaultOptions = Object.assign({}, defaultOptions, {
        type: options.method || 'GET',
        async: true,
        url: fullUrl,
         ...params
      });


      return $.ajax(Object.assign({}, defaultOptions, options))
        .then( (json, status, xhr) => {
          return { json, status, xhr };
        });
    }

    return fetch(endpoint, Object.assign({}, defaultOptions, options))
        .then(response => {
            if (response.ok) {
                return response.json().then(json => ({json, response}))
            } else {
                if (response.status === 401) {
                    window.location.href = 'http://' + window.location.host;
                }
                return response.json().then(json => Promise.reject({json, response}))
                // return Promise.reject(response)
            }
        })
        .catch(error => {
            return Promise.reject(error)
        });
}

