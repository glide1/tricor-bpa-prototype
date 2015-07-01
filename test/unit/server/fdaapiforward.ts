///<reference path="../../../typings/tsd.d.ts" />
import * as chai from 'chai';
import * as Chance from 'chance';
import * as sinon from 'sinon';
import * as express from 'express';
import * as request from 'request';
import * as proxyquire from 'proxyquire';
import * as fdaApiForward from '../../../server/fdaapiforward';
var expect = chai.expect;
var chance = new Chance();

proxyquire.noCallThru();

describe('FdaApiForward', () => {
	describe('#createGetString', () => {
		let testEndpoint : string;
		let cut : fdaApiForward.FdaApiForward;
		let result : string;
		let request : fdaApiForward.ApiForwardRequest
		beforeEach((action) => {
			testEndpoint = chance.url();
			cut = new fdaApiForward.FdaApiForward(testEndpoint);
			request = { endpoint: chance.string(),
				count: chance.d20(),
				skip: chance.d20(),
				limit: chance.d100(),
				search: chance.string()
			};
			result = cut.createGetString(request);
			action();
		});
		
		it('should return a string', (done) => {
			expect(result).to.be.a('string');
			done();
		});
		
		it('should start contain endpoint', (done) => {
			expect(result).to.contain(testEndpoint);
			done();
		});
		
		it('should contain the endpoint', (done) => {
			expect(result).to.contain(request.endpoint + '.json');
			done();
		});
		
		it('should contain the count', (done) => {
			expect(result).to.contain("count=" + request.count);
			done();
		})
		
		it('should contain skip', (done) => {
			expect(result).to.contain("skip=" + request.skip);
			done();
		});
		
		it ('should contain limit', (done) => {
			expect(result).to.contain("limit=" + request.limit);
			done();
		});
		
		it ('should contain search', (done) => {
			expect(result).to.contain("search=", request.search);
			done();
		});
		context('with api key', () => {
			let testApiKey = chance.string();
			beforeEach((action) => {
				cut = new fdaApiForward.FdaApiForward(testEndpoint, testApiKey);
				result = cut.createGetString(request);
				action();
			})
			it ('should contain api key', (done) => {
				expect(result).to.contain("?api_key=" + testApiKey);
				done();
			});
		});
	});
	
	describe('#handle', () =>{
		let req = sinon.spy();
		let res = sinon.spy;
		let pipeCall = sinon.spy();
		let testEndPoint = chance.url();
		let cut = new fdaApiForward.FdaApiForward(testEndPoint);
		
		(<any> req).body = {request: 'something'};
		
		let requestStub = sinon.stub(request, 'get');
		requestStub.returns({ pipe: pipeCall})
		
		before((done) => {
			proxyquire('request', { request: { get: requestStub }});
			done();
		});
		
		after((done) => {
			(<any>request).get.restore();
			done();
		});
		
		cut.handle(<express.Request> <any> req, <express.Response> <any> res, () => { });
		it ('handle calls request', (done) => {
		 	expect(requestStub.calledOnce).to.be.true;
			expect(pipeCall.calledWith(res)).to.be.true;
			done();
		});
	});
});