/* jshint maxcomplexity: 2 */
"use strict";

/**
 * application api test suite
 * @file
 * @see {@link https://github.com/visionmedia/supertest#readme supertest api documentation}
 * */

var app = require("../lib/app"),
    supertest = require("supertest"),
    textShouldBe = function(expected) {
        return function (response) {
            if (response.text !== expected) {
                throw new Error("Response should be " + expected +
                    " but got " + response.text);
            }
        };
    };

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

describe("app api /countries.json", function ()
{
    beforeEach(function () {
        this.response = supertest(app)
            .set("User-Agent", "test app.spec.js")
            .set("Accept", "text/plain");
    });

    it.skip("returns error for private ip address", function (fnAsyncDone)
    {
        this.response
            .get("/countries.json/192.168.0.2")

        this.response
            .expect("Content-Type", /application\/json/)
            .expect(404)
            .end(fnAsyncDone);
    });

    it.skip("returns error for non-ip address", function (fnAsyncDone)
    {
        this.response
            .get("/countries.json/google.com")

        this.response
            .expect("Content-Type", /text\/plain/)
            .expect(404)
            .end(fnAsyncDone);
    });

    it.skip("returns content type and success code for ip address", function (fnAsyncDone)
    {
        this.response
            .get("/countries.json/82.25.22.100")

        this.response
            .expect("Content-Type", /application\/json/)
            .expect(200)
            .end(fnAsyncDone);
    });

    it.skip("returns country name for ip address", function (fnAsyncDone)
    {
        this.response
            .get("/countries.json/82.25.22.100")

        this.response
            .expect(this.response.body.country, /^\w+$/)
            .end(fnAsyncDone);
    });

    it.skip("returns country name for ipv6 address", function (fnAsyncDone)
    {
        this.response
            .get("/countries.json/82.25.22.100.12.67")

        this.response
            .expect(this.response.body.country, /^\w+$/)
            .end(fnAsyncDone);
    });

    it.skip("returns country name for multiple ip addresses", function (fnAsyncDone)
    {
        this.response
            .get("/countries.json/82.25.22.100,82.25.22.100.12.67")

        this.response
            .expect(this.response.body.country, /^\w+$/)
            .end(fnAsyncDone);
    });

});
