"use strict";

/**
 * ip to geo-location microservice application
 * @file
 * */

var toPort = process.env.PORT || 5508,
    docRoot = "doc",
    express = require("express"),
    logger = require("morgan"),
    fs = require("fs"),
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
    /**
     * start the microservice on the configured port environment variable PORT
     * @function app:do.start
     */
    start: function () {
        module.exports = app;

        app.do.checkStartDir();
        app.do.setupLogging();

        /**
         * GET /index.html for documentation of the micro-service
         * @function _api:index
         * */
        app
            .use(express.static(docRoot))

            /**
             * GET /ping/ api endpoint to check that the server is alive
             * @function _api:ping
             * @see app:do.respondWithPong
             * */
            .get("/ping/?", app.do.respondWithPong)

            /**
             * GET /api/countries.json/ip,ip api endpoint to get location by ip address
             * @function _api:"countries.json"
             * @see app:do.respondWithLocation
             * */
            .get("/api/countries.json/:iplist", app.do.respondWithLocation)
            .get("/error/?", app.do.invokeErrorHandler)
            .get("*", app.do.respondWithNotFound)
            .listen(toPort, app.do.thenLogStartup);
    },


    /**
     * ensure app was started in the correct directory so that static content is available
     * @function app:do.checkStartDir
     */
    checkStartDir: function (dir)
    {
        dir = dir || docRoot;
        fs.stat(dir, function(error)
        {
            if (error)
            {
                app.do.throwError(new Error("Application startup in wrong directory. Directory " +
                    dir + " must exist with read permissions. " + error));
            }
        });
    },

    /**
     * install logging middleware unless logging turned off by env var NOLOGGING
     * @function app:do.startLogging
     */
    setupLogging: function () {
        if (!process.env.NOLOGGING)
        {
            app.use(logger("dev", { // combined, common, dev, short, tiny
                immediate: false // true=log at start in case of crash
            }));
        }
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
     * location service api handler
     * @function app:do.respondWithLocation
     * @param request {Request} the http request made by the user agent
     * @param response {Response} the outgoing http response to be modified by the handler
     */
    respondWithLocation: function (request, response)
    {
        void request;
        response
            .type("application\/json")
            .send([
                {
                    host: "192.168.0.2",
                    error: "The address 192.168.0.2 is not in the database."
                }
            ]);
    },

    /**
     * used to simulate an error to see how error handling works. enabled
     * only in non-production environment
     * @function app:do.invokeErrorHandler
     */
    invokeErrorHandler: function (request, response)
    {
        if (process.env.NODE_ENV !== "production")
        {
            app.do.throwError(new Error("Error simulation"));
        }
        else
        {
            app.do.respondWithNotFound(request, response);
        }
    },

    /**
     * the only way to 'test' that something is thrown. Never actually
     * throw in place, use app.do.throwError so that you can stub it out in a
     * test plan.
     * @function app:do.throwError
     */
    throwError: function (error)
    {
        throw error;
    },

    /**
     * unknown api endpoint handler
     * @function app:do.respondWithNotFound
     * @param request {Request} the http request made by the user agent
     * @param response {Response} the outgoing http response to be modified by the handler
     */
    respondWithNotFound: function (request, response)
    {
        void request;
        response
            .type("text")
            .status(404)
            .send("404. Existence Exists, but that endpoint does not.");
    },

    /**
     * initial log message when the application starts
     * @function app:do.thenLogStartup
     */
    thenLogStartup: function ()
    {
        console.log("App started on port " + app.get("port") +
            " " + (process.env.NODE_ENV || "development"));
    },

    "app": app
};

app.do.start();
