/* clusterFactory.spec.js */

"use strict";

describe("clusterFactory", function () {

	var clusterFactory = require("../lib/clusterFactory"),
		chai = require("chai"),
		expect = chai.expect,
		CPUS = 8;

	describe("._getBoolean true from string/value", function () {

		it("should be true for string true", function () {
			expect(clusterFactory._getBoolean("true")).to.be.true;
		});
		it("should be true for string 1", function () {
			expect(clusterFactory._getBoolean("1")).to.be.true;
		});
		it("should be true for number 1", function () {
			expect(clusterFactory._getBoolean(1)).to.be.true;
		});
		it("should be true for true", function () {
			expect(clusterFactory._getBoolean(true)).to.be.true;
		});
	});

	describe("._getBoolean false from string/value", function () {
		it("should be false for undefined", function () {
			expect(clusterFactory._getBoolean()).to.be.false;
		});
		it("should be false for null", function () {
			expect(clusterFactory._getBoolean(null)).to.be.false;
		});
		it("should be false for string false", function () {
			expect(clusterFactory._getBoolean("false")).to.be.false;
		});
		it("should be false for string 0", function () {
			expect(clusterFactory._getBoolean("0")).to.be.false;
		});
		it("should be false for number 0", function () {
			expect(clusterFactory._getBoolean(0)).to.be.false;
		});
		it("should be false for false", function () {
			expect(clusterFactory._getBoolean(false)).to.be.false;
		});
		it("should be false for string arbitrary", function () {
			expect(clusterFactory._getBoolean("arbitrary")).to.be.false;
		});
	});

	describe("._getMethod", function () {
		it("should be stub for undefined", function () {
			expect(clusterFactory._getMethod()).to.be.function;
		});
		it("should be the function for a function", function () {
			var fn = function () {};
			expect(clusterFactory._getMethod(fn)).to.be.equal(fn);
		});
	});

	describe("._getMaxWorkers from string/value", function () {
		it("should be cpuCount if undefined", function () {
			expect(clusterFactory._getMaxWorkers(void 0, CPUS)).to.be.equal(CPUS);
		});
		it("should be 1 if string zero", function () {
			expect(clusterFactory._getMaxWorkers("0", CPUS)).to.be.equal(1);
		});
		it("should be the number if string number", function () {
			expect(clusterFactory._getMaxWorkers("2", CPUS)).to.be.equal(2);
		});
		it("should be 1 if string not a number", function () {
			expect(clusterFactory._getMaxWorkers("five", CPUS)).to.be.equal(CPUS);
		});
		it("should be 1 if zero", function () {
			expect(clusterFactory._getMaxWorkers(0, CPUS)).to.be.equal(CPUS);
		});
		it("should be cpuCount if too high", function () {
			expect(clusterFactory._getMaxWorkers(CPUS * 2, CPUS)).to.be.equal(CPUS);
		});
		it("should be the number if less than cpuCount", function () {
			expect(clusterFactory._getMaxWorkers(CPUS - 1, CPUS)).to.be.equal(CPUS - 1);
		});
	});

	describe("clusterFactory without the cluster", function () {
		it("should have isMock setting true", function () {
			var cluster = clusterFactory.init({
				nocluster: true
			});

			expect(cluster.isMock).to.be.true;
		});

		it("should call supplied handler functions", function () {
			var called = [],
				workCluster,
				cluster = clusterFactory.init({
				nocluster: "1",
				master: function () {
					called.push("master");
				},
				worker: function () {
					called.push("worker");
					workCluster = this;
				}
			});

			expect(called).to.be.deep.equal(["master", "worker"]);
			expect(workCluster).to.be.equal(cluster);
		});

	});

	describe("clusterFactory with a cluster", function () {
		beforeEach(function () {
			var self = this;
			self.called = [];
			self.cluster = clusterFactory.init({
				nocluster: "false",
				mockCluster: { isMaster: true },
				master: function () {
					self.called.push("master");
				},
				worker: function () {
					self.called.push("worker");
				}
			});
		});

		it("should NOT have isMock setting", function () {
			expect(this.cluster.isMock).to.be.undefined;
		});
		it("should call master callback for master cluster", function () {
			expect(this.called).to.be.deep.equal(["master"]);
		});
	});

});
