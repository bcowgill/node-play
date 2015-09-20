/* jshint maxcomplexity: 2 */
"use strict";

/**
 * application api test suite
 * @file
 * @see {@link https://github.com/visionmedia/supertest#readme supertest api documentation}
 * */

// logging during test runs muck up the output
process.env.NOLOGGING = "true";

var app = require("../lib/app"),
    chai = require("chai"),
    expect = chai.expect,
    supertest = require("supertest"),
    textShouldBe = function(expected) {
        return function (response) {
            if (response.text !== expected) {
                throw new Error("Response should be " + expected +
                    " but got " + response.text);
            }
        };
    };

describe("app api /unknown/ tests", function ()
{
    beforeEach(function () {
        this.response = supertest(app)
            .get("/unknown/")
            .set("User-Agent", "test app.spec.js")
            .set("Accept", "text/plain");
    });

    it("error handler check", function (fnAsyncDone)
    {
        this.response
            .expect("Content-Type", /text\/plain/)
            .expect(404)
            .end(fnAsyncDone);
    });
});

describe("app api /ping/ tests", function ()
{
    beforeEach(function () {
        this.response = supertest(app)
            .get("/ping")
            .set("User-Agent", "test app.spec.js")
            .set("Accept", "text/plain");
    });

    it("keepalive ping/pong handler is text/plain", function (fnAsyncDone)
    {
        this.response
            .expect("Content-Type", /text\/plain/)
            .expect(200)
            .end(fnAsyncDone);
    });

    it("keepalive ping/pong handler returns pong", function (fnAsyncDone)
    {
        this.response
            .expect(textShouldBe("pong"))
            .end(fnAsyncDone);
    });
});

function setupApiCall (ips) {
    ips = Array.isArray(ips) ? ips : [ips];

    var response = supertest(app)
        .get("/api/countries.json/" + ips.join(","))
        .set("User-Agent", "test app.spec.js")
        .set("Accept", "text/plain");

    return response;
}

describe("app api /countries.json", function ()
{
    it("returns error information for private ip address", function (fnAsyncDone)
    {
        this.response = setupApiCall("192.168.0.2");

        this.response
            .expect("Content-Type", /application\/json/)
            .expect(200, [
                {
                    host: "192.168.0.2",
                    error: "The address 192.168.0.2 is not in the database."
                }
            ])
            .end(fnAsyncDone);
    });

    it("returns error information for unknown host", function (fnAsyncDone)
    {
        this.response = setupApiCall("barbarians");

        this.response
            .expect("Content-Type", /application\/json/)
            .expect(200, [
                {
                    host: "barbarians",
                    error: "Unknown host: barbarians"
                }
            ])
            .end(fnAsyncDone);
    });

    it.skip("returns location info from hostname", function (fnAsyncDone)
    {
        this.response = setupApiCall("crapola.com");

        this.response
            .expect("Content-Type", /text\/plain/)
            .expect(200, [
                {
                    country: {
                        language: "en",
                        name: "France",
                        geoname_id: 3017382,
                        iso_code: "FR"
                    },
                    host: "217.70.184.38"
                }
            ])
            .end(fnAsyncDone);
    });

    it.skip("returns content type and success code for ip address", function (fnAsyncDone)
    {
        this.response = setupApiCall("82.25.22.100");

        this.response
            .expect("Content-Type", /application\/json/)
            .expect(200)
            .end(fnAsyncDone);
    });

    it.skip("returns country name for ip address", function (fnAsyncDone)
    {
        this.response = setupApiCall("82.25.22.100");

        this.response
            .expect(this.response.body.country, /^\w+$/)
            .end(fnAsyncDone);
    });

    it.skip("returns country name for ipv6 address", function (fnAsyncDone)
    {
        this.response = setupApiCall("82.25.22.100.12.67");

        this.response
            .expect(this.response.body.country, /^\w+$/)
            .end(fnAsyncDone);
    });

    it.skip("returns country name for multiple ip addresses", function (fnAsyncDone)
    {
        this.response = setupApiCall(["82.25.22.100", "82.25.22.100.12.67"]);

        this.response
            .expect(this.response.body.country, /^\w+$/)
            .end(fnAsyncDone);
    });
});

describe("app startup log test", function ()
{
    beforeEach(function() {
        this.save = console.log;
    });

    afterEach(function () {
        console.log = this.save;
        this.save = null;
    });

    it("should log about startup", function ()
    {
        var log;
        console.log = function (message) {
            log = message;
        };

        app.do.thenLogStartup();
        expect(log).to.equal("App started on port 5508 development");
    });
});

describe("app error handler test", function ()
{
    beforeEach(function () {
        this.response = supertest(app)
            .get("/error/")
            .set("User-Agent", "test app.spec.js")
            .set("Accept", "text/plain");
    });

    afterEach(function () {
        process.env.NODE_ENV = "";
    });

    it("should invoke error handler", function ()
    {
        expect(app.do.invokeErrorHandler).to.throw(/^Error simulation$/);
    });

    it("should not invoke error handler in production", function (fnAsyncDone)
    {
        process.env.NODE_ENV = "production";

        this.response
            .expect("Content-Type", /text\/plain/)
            .expect(404)
            .end(fnAsyncDone);
    });

});

describe("inspect unit test", function ()
{
    it("should inspect an object", function ()
    {
        expect(app.do.inspect({})).to.equal("{}");
    });
});

describe("checkStartDir unit test", function ()
{
    beforeEach(function() {
        this.save = app.do.throwError;
    });

    afterEach(function () {
        app.do.throwError = this.save;
        this.save = null;
    });

    it("should throw error if directory not present", function (asyncDone)
    {
        app.do.throwError = function (error) {

            var message = "^Error: Application startup in wrong directory. " +
                "Directory nosuchdirectory must exist with read permissions. " +
                "Error:";
            expect(error).to.match(new RegExp(message));
            asyncDone();
        };

        app.do.checkStartDir("nosuchdirectory");
    });
});
