/* nocluster.spec.js */

"use strict";

var nocluster = require("../lib/nocluster"),
	chai = require("chai"),
	expect = chai.expect;

function expectReadOnly (obj, prop) {
	var now = obj[prop];

	expect(function () {
		obj[prop] = 42;
	}).to.not.change(obj, prop);
	expect(obj[prop]).to.be.equal(now);
}

describe("nocluster", function () {

	it("should have isMock setting true", function () {
		expect(nocluster.isMock).to.be.true;
	});

	it("should be readonly for isMock", function () {
		expectReadOnly(nocluster, "isMock");
	});

	it("should have isMaster readonly false", function () {
		expect(nocluster.isMaster).to.be.false;
		expectReadOnly(nocluster, "isMaster");
	});

	it("should have isWorker readonly true", function () {
		expect(nocluster.isWorker).to.be.true;
		expectReadOnly(nocluster, "isWorker");
	});

	it("should have worker id readonly 0", function () {
		expect(nocluster.worker.id).to.be.equal(0);
		expectReadOnly(nocluster.worker, "id");
	});

});