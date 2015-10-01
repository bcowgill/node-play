/* nocluster.js

	mock the cluster object as a worker to allow clustered apps to be unit tested.
*/

var cluster = {
	worker: {
		id: 0 // make read-only
	}
};

module.exports = cluster;