/*
	clusterFactory.js

	a factory for starting a cluster of workers or a nocluster
	to allow unit testing of your app.
*/

"use strict";

var clusterFactory = {},
	initNoCluster, initWithCluster,
	initMaster, initWorker,
	_getBoolean,
	_getMethod,
	_getMaxWorkers;

function init (options) {
	var cluster;
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
		master = _getMethod(options.master),
		worker = _getMethod(options.worker);

	master.call({});
	worker.call(cluster);

	return cluster;
};

initWithCluster = function (options) {
	var cluster = options.mockCluster || require("cluster");
	if (cluster.isMaster) {
		initMaster(cluster, options);
	}
	else {
		initWorker(cluster, options);
	}
	return cluster;
};

initMaster = function (cluster, options) {
	var cpuCount = require("os").cpus().length,
		workers = _getMaxWorkers(options.workers, cpuCount),
		master = _getMethod(options.master);
	void workers;
	// TODO fork off the workers and listen to death
	// callback for before fork/after fork
	master.call(cluster);
};

initWorker = function (cluster, options) {
	var worker = _getMethod(options.worker);
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
	return (typeof fn === "function") ? fn : function () {};
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

clusterFactory.init = init;
clusterFactory._getBoolean = _getBoolean;
clusterFactory._getMethod = _getMethod;
clusterFactory._getMaxWorkers = _getMaxWorkers;

module.exports = clusterFactory;
