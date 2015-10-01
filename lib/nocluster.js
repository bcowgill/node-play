/*
	nocluster.js

	a lightweight mock of the cluster object as a worker to allow clustered apps
	to be unit tested.
*/
'use strict';

var cluster = { worker: { 'process': process } };

function _readonly(obj, name, value) {
	value = value === void 0 ? false : value;

	Object.defineProperty(obj, name, { 'value': value, writable: false });
}

_readonly(cluster, 'isMock', true);
_readonly(cluster, 'isMaster');
_readonly(cluster, 'isWorker', true);
_readonly(cluster.worker, 'id', 0);

module.exports = cluster;
