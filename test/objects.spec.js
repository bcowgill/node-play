"use strict";

var aBase = require("../lib/aBase"),
    chai = require("chai"),
    expect = chai.expect;

describe("aBase object with no properties", function () {
    it("should zero the counter for a new object", function (fnAsyncDone)
    {
        var base = aBase();
        expect(base.counter()).to.be.equal(0);
        fnAsyncDone();
    });

    it("should have a default name for a new object", function (fnAsyncDone)
    {
        var base = aBase();
        expect(base.name()).to.be.equal("unnamed0");
        fnAsyncDone();
    });

    it("should not have access to the private counter property", function (fnAsyncDone)
    {
        var base = aBase();
        expect(base.counter).to.be.function;
        fnAsyncDone();
    });

    it("should be able to peek at privates only", function (fnAsyncDone)
    {
        var base = aBase();
        var privates = base.privates();
        expect(JSON.parse(privates)).to.be.deep.equal({
            counter: 0,
            name: "unnamed0"
        });
        fnAsyncDone();
    });

});

describe("aBase object with some properties", function () {
    beforeEach(function () {
        this.base = aBase({
            counter: "ignored",
            name: "used"
        });
    });

    it("should zero the counter for a new object", function (fnAsyncDone)
    {
        expect(this.base.counter()).to.be.equal(0);
        fnAsyncDone();
    });

    it("should have the name passed in for a new object", function (fnAsyncDone)
    {
        expect(this.base.name()).to.be.equal("used");
        fnAsyncDone();
    });

});

describe("aBase object with supplied privates", function () {
    beforeEach(function () {
        this.base = aBase({}, {
            counter: 42,
            name: "private"
        });
    });

    it("should use private counter value for a new object", function (fnAsyncDone)
    {
        expect(this.base.counter()).to.be.equal(42);
        fnAsyncDone();
    });

    it("should use the private name for a new object", function (fnAsyncDone)
    {
        expect(this.base.name()).to.be.equal("private");
        fnAsyncDone();
    });

});

describe("aBase object with supplied properties and privates", function () {
    beforeEach(function () {
        this.base = aBase({
            counter: 24,
            name: "properties"
        }, {
            counter: 42,
            name: "private"
        });
    });

    it("should use private counter value for a new object", function (fnAsyncDone)
    {
        expect(this.base.counter()).to.be.equal(42);
        fnAsyncDone();
    });

    it("should have the name passed in for a new object", function (fnAsyncDone)
    {
        expect(this.base.name()).to.be.equal("properties");
        fnAsyncDone();
    });

});

describe("accidentally using new is no problem", function () {

    beforeEach(function () {
        this.base = new aBase({
            counter: 24,
            name: "properties"
        }, {
            counter: 42,
            name: "private"
        });
    });

    it("should not have global.counter", function (fnAsyncDone)
    {
        expect(global.counter).to.be.undefined;
        fnAsyncDone();
    });

    it("should use private counter value for a new object", function (fnAsyncDone)
    {
        expect(this.base.counter()).to.be.equal(42);
        fnAsyncDone();
    });

    it("should have the name passed in for a new object", function (fnAsyncDone)
    {
        expect(this.base.name()).to.be.equal("properties");
        fnAsyncDone();
    });

});
