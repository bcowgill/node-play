"use strict";

/**
 * ip to geo-location microservice application
 * @file
 * */

var toPort = process.env.PORT || 5508,
    docRoot = "doc",
    cluster,
    express,
    logger,
    rest,
    util,
    app,
    main;

/**
 * pseudo module to document the api endpoint url's
 *  @module _api
 */

/**
 * app.do application handler functions
 * @module app:do
 */
main =
{
    /**
     * initialise cluster or non-clustered server
     * @function app:do.clusterInit
     */
    clusterInit: function () {
        if (process.env.NOCLUSTER)
        {
            main.checkStartDir();
            cluster = {
                worker: {
                    id: 0
                }
            };
            main.start();
        }
        else
        {
            cluster = require("cluster");
            main.master();
            main.worker();
        }
    },

    /**
     * master process creates a worker for each CPU
     * @function app:do.master
     */
    master: function () {
        if (cluster.isMaster)
        {
            main.checkStartDir();

            var cpu, cpuCount = require("os").cpus().length;

            // Create a worker for each CPU
            for (cpu = 0; cpu < cpuCount; cpu += 1)
            {
                cluster.fork();
            }

            // Listen for dying workers
            cluster.on("exit", function (worker) {
                main.log("worker#" + worker.id + " died :(");
                cluster.fork();
            });
        }
    },

    /**
     * worker process handler to do the real work
     * @function app:do.worker
     */
    worker: function () {
        if (!cluster.isMaster)
        {
            main.start();
        }
    },

    /**
     * ensure app was started in the correct directory so that static content is available
     * @function app:do.checkStartDir
     */
    checkStartDir: function (dir)
    {
        dir = dir || docRoot;
        var fs = require("fs");

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
     * start the microservice on the configured port environment variable PORT
     * @function app:do.start
     */
    start: function () {
        express = require("express");
        logger = require("morgan");
        rest = require("unirest");
        util = require("util");

        /**
         * ip to geo-location microservice application
         * @module app
         * */
        app = express().set("port", toPort);
        app.do = main;

        module.exports = app;

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

            /**
             * GET /api/error dev endpoint to check thrown errors
             * @function _api:error
             * @see app:do.invokeErrorHandler
             * */
            .get("/error/?", app.do.invokeErrorHandler)

            /**
             * GET /api/die dev endpoint to kill the server for forever testing
             * @function _api:die
             * @see app:do.invokeDieHandler
             * */
            .get("/die/?", app.do.invokeDieHandler)

            /**
             * GET /api/slow dev endpoint to respond slowly for siege testing
             * @function _api:slow
             * @see app:do.invokeSlowHandler
             * */
            .get("/slow/?", app.do.invokeSlowHandler)

            .get("*", app.do.respondWithNotFound)
            .listen(toPort, app.do.thenLogStartup);
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
     * location service api handler performs multiple lookups of host location
     * information and returns a list of results
     * @function app:do.respondWithLocation
     * @param request {Request} the http request made by the user agent
     * @param response {Response} the outgoing http response to be modified by the handler
     */
    respondWithLocation: function (request, response)
    {
        var iplist = request.params.iplist.split(/\s*,\s*/);

        response.locals.responses = [];
        response.locals.numHosts = iplist.length;

        iplist.forEach(function (host) {
            rest.get("http://ip-api.com/json/" + host)
                .header("Accept", "application/json")
                .end(function (restResponse) {
                    app.do.handleLookupResponse(host, response, restResponse);
                });
        });
    },

    /**
     * handle a single host lookup response
     * @function app:do.handleLookupResponse
     */
    handleLookupResponse: function (ip, response, lookupResponse)
    {
        if (lookupResponse.error || lookupResponse.body.status !== "success")
        {
            response.locals.responses.push(
                app.do.getLocationErrorResponse(ip, lookupResponse)
            );
        }
        else
        {
            response.locals.responses.push(
                app.do.getLocationResponse(lookupResponse)
            );
        }

        // all responses received, send the assembled response
        if (response.locals.responses.length >= response.locals.numHosts)
        {
           response.json(response.locals.responses);
        }
    },

    /**
     * construct an error location response object from the rest response
     * @function app:do.getLocationErrorResponse
     */
    getLocationErrorResponse: function (ip, response)
    {
        ip = (response.body && response.body.query) ?
            response.body.query : ip;
        return {
            host: ip,
            error: ip.match(/[^0-9\.]/) ?
                "Unknown host: " + ip :
                "The address " + ip + " is not in the database."
        };
    },

    /**
     * construct the location response object from the rest response
     * @function app:do.getLocationResponse
     */
    getLocationResponse: function (response)
    {
        //app.do.log("\n#" + cluster.worker.id + ":MUSTDO from rest " +
        // app.do.inspect(response.body));
        var result = {
            host: response.body.query,
            country: {
                name: response.body.country,
                iso_code: response.body.countryCode
            }
        };
        //app.do.log("\n#" + cluster.worker.id + ":MUSTDO result " +
        // app.do.inspect(result));
        return result;
    },

    /**
     * used to simulate an error to see how error handling works. enabled
     * only in non-production environment
     * @function app:do.invokeErrorHandle  r
     */
    invokeErrorHandler: function (request, response)
    {
        app.do.devOnly(request, response,
            function () {
                app.do.throwError(new Error("Error simulation"));
            });
    },

    /**
     * used to terminate the server so that forever can restart it.
     * @function app:do.invokeDieHandler
     */
    invokeDieHandler: function (request, response)
    {
        app.do.devOnly(request, response,
            function () {
                process.exit(11);
            });
    },

    slowLoops: 15000000,

    /**
     * used to slow down responses a bit to check performance
     * @function app:do.invokeSlowHandler
     * @param request {Request} the http request made by the user agent
     * @param response {Response} the outgoing http response to be modified by the handler
     */
    invokeSlowHandler: function (request, response)
    {
        app.do.devOnly(request, response,
            function (request, response) {
                void request;

                app.do.log("worker#" + cluster.worker.id + " going slow.");

                var idx, result = "";
                for (idx = 0; idx < app.do.slowLoops; idx += 1)
                {
                    result += idx;
                }

                response
                    .type("text")
                    .send("what? " + result.length);

        });
    },

    /**
     * provide a response in development only.
     * @function app:do.devOnly
     */
    devOnly: function (request, response, fnDevOnly)
    {
        if (process.env.NODE_ENV !== "production")
        {
            fnDevOnly(request, response);
        }
        else
        {
            app.do.respondWithNotFound(request, response);
        }
    },

    /**
     * the only way to 'test' that something is thrown asynchronously. Never
     * actually throw at the error place, use app.do.throwError so that you
     * can stub it out in a test plan.
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
        app.do.log("App started worker#" + cluster.worker.id + " on port " + app.get("port") +
            " " + (process.env.NODE_ENV || "development"));
    },

    /**
     * application console log. needs to wrap console.log for test plan
     * @function app:do.log
     */
    log: function (message)
    {
        console.log(message);
    },

    /**
     * shallowly inspect an object with ANSI color sequences
     * @function app:do.inspect
     */
    inspect: function (object, options)
    {
        return util.inspect(object, options || {
            depth: 1,
            colors: true,
            showHidden: false
        });
    },

    "app": app
};

main.clusterInit();
