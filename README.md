node-play
=========

A node play area while working from the book Express in Action: Node applications with Express and its companion tools

package.json/Gruntfile.js has been tooled up for jshint, jsdoc, mocha/chai/sinon unit testing and istanbul coverage reporting.

It also uses 'forever' to start the app and keep it running. The dev startup will restart when changes are made to the code.

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

- 95% write code to implement the api
- grunt run script plugin
- npm install lodash

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

