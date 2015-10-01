/*
	nocluster.js

	a lightweight mock of the cluster object as a worker to allow clustered apps
	to be unit tested.
*/

var cluster = { worker: { 'process': process } };

function _readonly(name, value) {
	value = value === void 0 ? false : value;
	Object.defineProperty(this, name, { 'value': value, writable: false });
}

_readonly.call(cluster, 'isMock', true);
_readonly.call(cluster, 'isMaster');
_readonly.call(cluster, 'isWorker', true);
_readonly.call(cluster.worker, 'id', 0);

module.exports = cluster;

