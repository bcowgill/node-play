/* nocluster.js

	mock the cluster object as a worker to allow clustered apps to be unit tested.
*/
"use strict";

var cluster = {
	worker: {
		id: 0 // make read-only
	}
};

module.exports = cluster;