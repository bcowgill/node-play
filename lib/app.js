"use strict";

var express = require("express"),
    app = express(),
    toPort = process.env.PORT || 5508;

app.set("port", toPort);

function respondWithPong (request, response)
{
    void request;
    response
        .type("text")
        .send("pong");
}

function thenLogStartup ()
{
    console.log("App started on port " + app.get("port"));
}

module.exports = app.get("/ping/?", respondWithPong)
    .listen(toPort, thenLogStartup);

