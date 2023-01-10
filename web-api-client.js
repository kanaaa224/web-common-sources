/*
    (c) 2022 kanaaa224. All rights reserved.
*/

import HTTPClient from './http-client.js';

export default class WebAPIClient extends HTTPClient {

    constructor(defaultBaseURL = '') {
        super(defaultBaseURL);

        this.history = [];
    }

    async call(request = {}) {
        this.history.push({ request, timestamp: new Date() });

        return await super.request(request);
    }

}