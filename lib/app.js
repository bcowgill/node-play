"use strict";

/**
 * ip to geo-location microservice application
 * @file
 * */

var toPort = process.env.PORT || 5508,
    express = require("express"),
    /**
     * ip to geo-location microservice application
     * @module app
     * */
    app = express().set("port", toPort);

/**
 * pseudo module to document the api endpoint url's
 *  @module _api
 */

/**
 * app.do application handler functions
 * @module app:do
 */
app.do =
{
    "app": app,

    /**
     * start the microservice on the configured port environment variable PORT
     * @function app:do.start
     */
    start: function () {
        /**
         * GET /ping/ api endpoint to check that the server is alive
         * @function _api:ping
         * @see app:do.respondWithPong
         * */
        module.exports = app.get("/ping/?", app.do.respondWithPong)
            .listen(toPort, app.do.thenLogStartup);
    },

    /**
     * used to check if service is still alive. returns the simple text response 'pong'
     * @function app:do.respondWithPong
     * @param request {Request} the http request made by the user agent
     * @param response {Response} the outgoing http response to be modified by the handler
     */
    respondWithPong: function (request, response)
    {
        void request;
        response
            .type("text")
            .send("pong");
    },

    /**
     * initial log message when the application starts
     * @function app:do.thenLogStartup
     */
    thenLogStartup: function ()
    {
        console.log("App started on port " + app.get("port"));
    }
};

app.do.start();
