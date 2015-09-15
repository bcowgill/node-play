"use strict";

var capitalize = require("../lib/capitalize");

var chai = require("chai");
var expect = chai.expect;

describe("capitalize", function() {

    it("capitalizes single words", function() {
        expect(capitalize("express")).to.equal("Express");
        expect(capitalize("cats")).to.equal("Cats");
    });

});