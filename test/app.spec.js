/* jshint maxcomplexity: 2 */
"use strict";

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

describe("app api tests", function ()
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

    it.skip("returns location information as JSON", function (fnAsyncDone)
    {

        // Act
        var test = supertest(app)
            .get("/countries.json/1.2.3.4")
            .set("User-Agent", "test app.spec.js")
            .set("Accept", "text/plain");

        // Assert
        test
            .expect("Content-Type", /application\/json/)
            .expect(200)
            .end(fnAsyncDone);
    });
});
