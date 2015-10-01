"use strict";

var aBase = require("../lib/aBase"),
    aDerived = require("../lib/aDerived"),
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
        var privates = base._privates();
        expect(privates).to.be.deep.equal({
            _inherits: ["aBase"],
            counter: 0,
            name: "unnamed0"
        });
        fnAsyncDone();
    });

    it("should not be able to change private value", function (fnAsyncDone)
    {
        var base = aBase();
        var privates = base._privates();
        privates.counter = 42;

        expect(base.counter()).to.be.deep.equal(0);
        fnAsyncDone();
    });

    it("should have inheritance array", function (fnAsyncDone)
    {
        var base = aBase();

        expect(base._inherits()).to.be.deep.equal(["aBase"]);
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

describe("aBase object special cases for undefined / null / falsy", function () {

    it("should use empty string property if specified", function (fnAsyncDone)
    {
        this.base = aBase({
            counter: 24,
            name: ""
        }, {
            counter: 42,
            name: "private"
        });
        expect(this.base.name()).to.be.equal("");
        fnAsyncDone();
    });

    it("should use zero value property if specified", function (fnAsyncDone)
    {
        this.base = aBase({
            counter: 24,
            name: 0
        }, {
            counter: 42,
            name: "private"
        });
        expect(this.base.name()).to.be.equal(0);
        fnAsyncDone();
    });

    it("should use false value property if specified", function (fnAsyncDone)
    {
        this.base = aBase({
            counter: 24,
            name: false
        }, {
            counter: 42,
            name: "private"
        });
        expect(this.base.name()).to.be.false;
        fnAsyncDone();
    });

    it("should use default value if undefined property given", function (fnAsyncDone)
    {
        this.base = aBase({
            counter: 24,
            name: void 0
        }, {
            counter: 42,
            name: "private"
        });
        expect(this.base.name()).to.be.equal("private");
        fnAsyncDone();
    });

    it("should use default value if null property given", function (fnAsyncDone)
    {
        this.base = aBase({
            counter: 24,
            name: null
        }, {
            counter: 42,
            name: "private"
        });
        expect(this.base.name()).to.be.equal("private");
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

describe("aDerived object with no properties", function () {
    it("should zero the counter for a new object", function (fnAsyncDone)
    {
        var derived = aDerived();
        expect(derived.counter()).to.be.equal(0);
        fnAsyncDone();
    });

    it("should have a default name for a new object", function (fnAsyncDone)
    {
        var derived = aDerived();
        expect(derived.name()).to.be.equal("unnamed0");
        fnAsyncDone();
    });

    it("should have a default mass for a new object", function (fnAsyncDone)
    {
        var derived = aDerived();
        expect(derived.mass()).to.be.equal(0);
        fnAsyncDone();
    });

    it("should have a method summary() for a new object", function (fnAsyncDone)
    {
        var derived = aDerived();
        expect(derived.summary()).to.be.equal("0: unnamed0 is 0kg");
        fnAsyncDone();
    });

    it("should not have access to the private counter property", function (fnAsyncDone)
    {
        var derived = aDerived();
        expect(derived.counter).to.be.function;
        fnAsyncDone();
    });

    it("should be able to peek at privates only", function (fnAsyncDone)
    {
        var derived = aDerived();
        var privates = derived._privates();
        expect(privates).to.be.deep.equal({
            _inherits: ["aDerived"],
            counter: 0,
            name: "unnamed0"
        });
        fnAsyncDone();
    });

    it("should not be able to change private value", function (fnAsyncDone)
    {
        var derived = aDerived();
        var privates = derived._privates();
        privates.counter = 42;

        expect(derived.counter()).to.be.deep.equal(0);
        fnAsyncDone();
    });

    it("should have inheritance array", function (fnAsyncDone)
    {
        var derived = aDerived();

        expect(derived._inherits()).to.be.deep.equal(["aDerived", "aBase"]);
        fnAsyncDone();
    });
});
