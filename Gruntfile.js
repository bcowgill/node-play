/*jshint indent: 4, smarttabs: true, maxcomplexity: 6, maxstatements: 25, maxlen: 140 */
/*global module:false */
/**
	@file Gruntfile.js
	@author Brent S.A. Cowgill
	@see {@link module:Gruntfile}
	@description
	Grunt build configuration.

	@example

	# TDD mode, skip jshint, just run coverage+tests or tests alone
	grunt tdd --watch coverage
	grunt tdd --watch test

	# build all, then watch for changes use the airplane test reporter
	grunt all watcher --reporter landing --force

	# watch file changes to rerun tests and also build the documentation
	grunt watcher --also jsdoc

	# jshint check a single file
	grunt jshint:single --check-file filename.js

	# run tests with a chosen reporter style
	grunt test --reporter spec

	@see {@link http://usejsdoc.org/ JSDoc Documentation}
*/

/**
	Grunt build configuration.
	@module Gruntfile
*/

function getOptions (grunt) {
	'use strict';
	var also = grunt.option('also') || [];
	var watch = grunt.option('watch') || ['jshint:gruntfile', 'jshint:lib', 'jshint:test', 'coverage'];
	watch = Array.isArray(watch) ? watch : [watch];
	also = Array.isArray(also) ? also : [also];
	if (also.length) {
		watch.push(also);
	}
	return watch;
}

module.exports = function(grunt) {
	'use strict';

	var watch = getOptions(grunt);

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		// Task configuration.
		/**
			clean up files on disk before build.
			@see {@link https://github.com/gruntjs/grunt-contrib-clean About clean grunt plugin}
		*/
		clean: {
			jsdoc: {
				src: ['doc/']
			}
		},
		/**
			jshint validation of javascript code.
			@see {@link https://github.com/gruntjs/grunt-contrib-jshint About jshint grunt plugin}
			@see {@link http://jshint.com/docs/options/ jshint options}
			@see {@link https://github.com/jshint/jshint/blob/master/src/messages.js Warning codes for jshint}
		*/
		jshint: {
			options: {
				jshintrc: '.jshintrc-node',
				globals: {},
			},
			gruntfile: {
				options: {
					jshintrc: '.jshintrc-gruntfile',
					globals: {}
				},
				src: ['package.json', '.jshintrc*', 'Gruntfile.js']
			},
			single: {
				// grunt jshint:single --check-file filename
				src: [grunt.option('check-file') || 'package.json']
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				options: {
					jshintrc: '.jshintrc-mocha-chai-sinon',
					globals: {}
				},
				spec: ['test/**/*.spec.js'], // for coverage
				src: ['test/**/*.js']
			}
		},
		/**
			Running tests in the console using mocha/chai/sinon.
			@see {@link https://github.com/thepeg/grunt-mocha-chai-sinon Grunt plugin for mocha, chai, and sinon}
			@see {@link http://visionmedia.github.io/mocha/ mocha documentation}
			@see {@link http://chaijs.com/api/ chai documentation}
		 	@see {@link http://sinonjs.org/docs/ sinon documentation}
		*/
		'mocha-chai-sinon': {
			test: {
				src: '<%= jshint.test.spec %>',
				options: {
					ui:  '<%= mocha_istanbul.coverage.options.ui %>',
					// spec, list, tap, nyan, progress, dot, min, landing, doc, markdown, html-cov, json-cov, json, json-stream, xunit
					reporter:  '<%= mocha_istanbul.coverage.options.reporter %>',
					bail: false, // true to bail after first test failure
					//grep: '.*', // invert: true, // filter to run subset of tests
					sort: true, // sort order of test files
					trace: true, // trace function calls
					'check-leaks': true, // check for global variable leaks
					'expose-gc': true,
					//timeout: 10, slow: 10, // async ms timeout and slow test threshold
					'inline-diffs': false// show actual/expected diffs inline
				}
			}
		},
		/**
			Generate code coverage reports using istanbul.
			@see {@link https://www.npmjs.com/package/grunt-mocha-istanbul Grunt plugin for mocha istanbul coverage}
			@see {@link http://gotwarlost.github.io/istanbul/ istanbul documentation}
		 	@see {@link https://github.com/nickmerwin/node-coveralls coveralls documentation}
			@see {@link http://tbusser.net/articles/js-unit-testing-part-02/#disqus_thread coverage under the hood}
		 */
		mocha_istanbul: {
			// use your browser to view this url for coverage report
			coverageUrl: '<%= mocha_istanbul.coverage.options.coverageFolder %>/index.html',
			coverage: {
				src: '<%= jshint.test.spec %>',
				options: {
					dryRun: false, // to debug the istanbul command line
					coverageFolder: 'doc/coverage',
					excludes: [],  // use istanbul help cover to see how excludes work
					reportFormats: [
						// html, lcovonly, lcov, cobertura, text-summary, text, teamcity
						'html',
						'text'
					],

					// Mocha options
					reporter: grunt.option('reporter') || 'spec',
					ui: 'bdd',

					// check percentage coverage to be a good build
					check: {
						functions:   95,
						branches:    80,
						lines:       85,
						statements:  85
					}
				}
			},
			coveralls: {
				src: '<%= jshint.test.spec %>',
				options: {
					coverage: true, // this will make the grunt.event.on('coverage') event listener to be triggered
					check: {
						functions:   75,
						branches:    75,
						lines:       75,
						statements:  75
					},
					root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
					reportFormats: ['cobertura','lcovonly']
				}
			}
		},

		/**
			Generate application documentation with jsdoc
			@see {@link https://github.com/krampstudio/grunt-jsdoc Grunt jsdoc plugin}
			@see {@link http://usejsdoc.org/ jsdoc documentation tags}
			@see {@link http://usejsdoc.org/about-commandline.html jsdoc command line options}
		*/
		jsdoc: {
			docs : {
				dest: 'doc',
				src: [
					'test/**/*.js',
					'lib/**/*.js',
					'Gruntfile.js',
					'README.md'
				],
				options: {
					configure: 'jsdoc.conf.json'
				}
			}
		},
		/**
			Watch files and run build targets on change
			@see {@link https://github.com/gruntjs/grunt-contrib-watch Grunt watch plugin}
		*/
		watch: {
			tdd: {
				files: [
					'<%= jshint.gruntfile.src %>',
					'<%= jshint.lib.src %>',
					'<%= jshint.test.src %>'
				],
				tasks: watch
			},
			all: {
				files: '<%= watch.tdd.files %>',
				tasks: watch
			}
		}
	});

	// These plugins provide necessary tasks.
	[
		'grunt-contrib-clean',
		'grunt-contrib-jshint',
		'grunt-jsdoc',
		'grunt-mocha-chai-sinon',
		'grunt-mocha-istanbul',
		'grunt-contrib-watch'
	].forEach(function (task) {
		grunt.loadNpmTasks(task);
	});

	// Important not to remove this if coveralls.options.coverage:true or grunt will hang
	grunt.event.on('coverage', function (lcovFileContents, done) {
		void lcovFileContents;
		done();
	});

	// Default task.
	grunt.registerTask('default', ['all']);
	grunt.registerTask('all', ['windows', 'docs', 'coverage']);
	grunt.registerTask('docs', ['clean:jsdoc', 'jsdoc']);
	grunt.registerTask('test', [
		// hyphens in name make the config section annoying
		// as template lookup with <%= mocha-chai-sinon %> won't work
		'mocha-chai-sinon'
	]);
	grunt.registerTask('tests', ['test']);
	grunt.registerTask('tdd', ['watch:tdd']);
	grunt.registerTask('watcher', ['watch:all']);
	grunt.registerTask('coverage', [
		'mocha_istanbul:coverage'
	]);
	grunt.registerTask('coveralls', [
		'mocha_istanbul:coveralls'
	]);
	grunt.registerTask('windows', [
		'jshint:gruntfile',
		'jshint:lib',
		'jshint:test'
	]);
	grunt.registerTask('single', ['jshint:single']);
};
