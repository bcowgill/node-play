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

    it.skip("returns error information for unknown host", function (fnAsyncDone)
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

    it("should invoke error handler", function ()
    {
        expect(app.do.invokeErrorHandler).to.throw(/^Error simulation$/);

    });

});
