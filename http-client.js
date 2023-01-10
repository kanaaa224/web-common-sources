/*
    (c) 2022 kanaaa224. All rights reserved.
*/

export default class HTTPClient {

    constructor(defaultBaseURL = '') {
        this.defaultBaseURL = defaultBaseURL;
    }

    async request(request = {}) {
        const {
            baseURL = this.defaultBaseURL,
            path    = '/',
            query   = {},
            headers = {},
            body    = null,
            method  = body !== null ? 'POST' : 'GET'
        } = request;

        const endpoint = new URL(baseURL);

        endpoint.pathname = `${endpoint.pathname.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

        for(const [ key, value ] of Object.entries(query)) endpoint.searchParams.set(key, value);

        const options = { method, headers: { ...headers } };

        if(body !== null) {
            options.headers['Content-Type'] ??= 'application/json';
            options.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, options);
        const text     = await response.text();

        const data   = text ? (response.headers.get('content-type')?.includes('json') ? JSON.parse(text) : text) : null;
        const result = { status: response.status, headers: Object.fromEntries(response.headers.entries()), data: data };

        if(!response.ok) throw new Error(JSON.stringify(result));

        return result;
    }

}