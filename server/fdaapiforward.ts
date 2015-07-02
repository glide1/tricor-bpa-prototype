///<reference path="../typings/tsd.d.ts" />
import * as express from 'express';
import * as request from 'request';
import * as _ from 'lodash';

export interface ApiForwardRequest {
	/**
	 * the endpoint e.g. drug/label
	 */
	endpoint: string,
	search?: string,
	count?: number,
	limit?: number,
	skip?: number
}

/**
 * ApiForward which will forward to the given API
 */
export class FdaApiForward {
	private endPointUrl: string;
	private apiKey: string;
	/**
	 * @param {string} endpointUrl the url of the endpoint
	 * @param {string} apiKey the apiKey of the endpoint
	 */
	constructor(endpointUrl: string, apiKey? : string) {
		this.endPointUrl = endpointUrl;
		this.apiKey = apiKey;
	}
	
	handle: express.RequestHandler = (req: express.Request, res: express.Response, next: Function) => {
		let url = this.createGetString(req.body);
		request.get(url).pipe(res);
	};
	
	createGetString(request: ApiForwardRequest) : string {
		if (request == null) {
			throw new Error('need a request');
		}
		var params = new Array<string>();
		if (this.apiKey != null) {
			params.push('api_key=' + this.apiKey);
		}
		if (request.search != null) {
			params.push('search=' + request.search);
		}
		if (request.count != null) {
			params.push('count=' + request.count);
		}
		if (request.limit != null) {
			params.push('limit=' + request.limit);
		}
		if (request.skip != null) {
			params.push('skip=' + request.skip);
		}
		return this.endPointUrl + request.endpoint + '.json?' + params.join('&');
	}
}