/*
	clusterFactory.js

	a factory for starting a cluster of workers or a nocluster
	to allow unit testing of your app.

	var clusterFactory = require("./clusterFactory");

	cluster = clusterFactory.init({
		nocluster: process.env.NOCLUSTER,
		workers: process.env.WORKERS,
		master: main.master,
		worker: main.worker,
		workforce: main.workforce
	});

*/

"use strict";

var clusterFactory = {},
	debug = require("debug")("clusterFactory"),
	initNoCluster, initWithCluster,
	initMaster, initWorker,
	_getBoolean,
	_getMethod,
	_startWorkers,
	_restartWorker,
	_getMaxWorkers;

function init (options) {
	var cluster;
	debug("init", options);
	if (_getBoolean(options.nocluster))
	{
		cluster = initNoCluster(options);
	}
	else
	{
		cluster = initWithCluster(options);
	}
	return cluster;
}

initNoCluster = function (options) {
	var cluster = require("./nocluster"),
		masterCluster = {}, // TODO mock?
		master = _getMethod(options.master),
		worker = _getMethod(options.worker),
		workforce = _getMethod(options.workforce);

	debug("initNoCluster");
	master.call(masterCluster);
	worker.call(cluster);
	workforce.call(masterCluster);

	return cluster;
};

initWithCluster = function (options) {
	var cluster = options.mockCluster || require("cluster");
	debug("initWithCluster");
	if (cluster.isMaster) {
		initMaster(cluster, options);
	}
	else {
		initWorker(cluster, options);
	}
	return cluster;
};

initMaster = function (cluster, options) {
	var master = _getMethod(options.master),
		workforce = _getMethod(options.workforce),
		workerExit = _getMethod(options.workerExit);

	debug("initMaster");
	master.call(cluster);
	_startWorkers(cluster, options.workers, workerExit);
	workforce.call(cluster);
};

initWorker = function (cluster, options) {
	var worker = _getMethod(options.worker);
	debug("initWorker");
	worker.call(cluster);
};

// get a boolean i.e. from process.env.NOCLUSTER which will be a string!
_getBoolean = function (value) {
	if (typeof value === "string") {
		if (value === "true") {
			value = true;
		}
		else {
			value = parseInt(value);
		}
	}
	return !!value;
};

_getMethod = function (fn) {
	return (typeof fn === "function") ? fn : function () { return true; };
};

_startWorkers = function (cluster, workers, workerExit) {
	var cpu, cpuCount = require("os").cpus().length;

	debug("_startWorkers " + workers);
	workers = _getMaxWorkers(workers, cpuCount);

	for (cpu = 0; cpu < workers; cpu += 1)
	{
		cluster.fork();
	}

	// Listen for dying workers
	cluster.on("exit", function (worker) {
		_restartWorker(cluster,  worker, workerExit);
	});
};

// get number of workers i.e. from process.env.WORKERS or max cpus
_getMaxWorkers = function (value, cpuCount) {
	if (value) {
		var workers = parseInt(value);
		cpuCount = workers < cpuCount ? workers : cpuCount;
		cpuCount = cpuCount || 1;
	}
	return cpuCount;
};

_restartWorker = function (cluster, worker, workerExit) {
	debug("_restartWorker ", worker);
	if (workerExit.call(cluster,  worker))
	{
		cluster.fork();
	}
};

clusterFactory.init = init;
clusterFactory._getBoolean = _getBoolean;
clusterFactory._getMethod = _getMethod;
clusterFactory._getMaxWorkers = _getMaxWorkers;

module.exports = clusterFactory;
