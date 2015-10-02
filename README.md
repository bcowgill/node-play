node-play asyncRus Jonathan's Team
==================================

Production Team Goal
"...produce a nodjs based location microservice that can substitute the current Java implementation in production"

## Overview

A node play area while working from the book Express in Action: Node applications with Express and its companion tools

##Current state:

- Location microservice implemented handles multiple ip addresses.
- Uses forever/nodemon to keep the server up always.
  * 'forever' to start the app and keep it running in production.
  * The dev startup uses 'nodemon' instead of 'forever' to restart when changes are made to the code. 'forever' will also do this but nodemon shows app log on stdout and forever saves to log files. So nodemon better for dev. 
- Uses cluster module to maximise performance on multi-cpu servers.
- Detects when the server is blocking so that the issue can be resolved (uses module 'blocked')
- package.json/Gruntfile.js has been tooled up for jshint, jsdoc, mocha/chai/sinon unit testing and istanbul coverage reporting.

## Installation

```bash
  git clone https://github.com/bcowgill/node-play.git
  cd node-play
  sudo npm install -g forever istanbul jsdoc mocha
  npm install
```

## Usage

```bash
  grunt jshint:single --check-file lib/single-file.js
  grunt all watch --reporter landing
  grunt watch --also jsdoc
  npm run-script coverage-view
  npm run-script doc-view
  npm run-script edit
  npm start
  npm run-script production
  npm stop
  wget http://localhost:5508/ping/
  wget http://localhost:5508/api/countries.json/:iplist
  wget http://localhost:5508/slow/
  wget http://localhost:5508/error/
  wget http://localhost:5508/die/
```

## Tests

```bash
  npm test
  grunt test --reporter nyan
```

## Performance

```bash
siege -c100 -t1M http://localhost:5508/slow
```

Results before using node clustering

** SIEGE 3.0.8
** Preparing 100 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:		          16 hits
Availability:		       13.91 %
Elapsed time:		       59.91 secs
Data transferred:	        0.00 MB
Response time:		       16.03 secs
Transaction rate:	        0.27 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		        4.28
Successful transactions:          16
Failed transactions:	          99
Longest transaction:	       30.01
Shortest transaction:	        0.00

Results after clustering (8 cpus)

Transactions:		          40 hits
Availability:		       29.85 %
Elapsed time:		       59.36 secs
Data transferred:	        0.00 MB
Response time:		       19.86 secs
Transaction rate:	        0.67 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       13.38
Successful transactions:          40
Failed transactions:	          94
Longest transaction:	       29.65
Shortest transaction:	        0.00

## Todo

- change logging output to show worker id number
- npm install bunyan for that perhaps
- npm install async to avoid callback hell
- grunt run script plugin
- npm install lodash
- npm install tape # another test framework
- npm install blanket # another coverage framework
- npm i pre-commit --save-dev  # force tests to pass before a commit
- npm install look # for profiling your node server
- supervisord for prod, pm2 other monitoring and restarting options
- node-inspector also good for debugging
- http://eslint.org/docs/rules/ # alternative js linter
- grunt tdd target to watch files and run tests/coverage w/o the jshint business
- ability to run a single test plan so coverage can show isolation

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

https://github.com/bcowgill/node-play
https://github.com/jesuspc/node_club
https://github.com/bbossola/location-service
https://github.com/bbossola/microjs

