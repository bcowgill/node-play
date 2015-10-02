/*
	something.spec.js

	handy place to test something about node/javascript
*/

"use strict";

var chai = require("chai"),
	expect = chai.expect;

describe("what happens when", function () {

	it("cannot parse an integer", function () {
		var number = parseInt("hello");
		expect(number < 6).to.be.falsy;
	});
});
