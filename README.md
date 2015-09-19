node-play
=========

A node play area while working from the book Express in Action: Node applications with Express and its companion tools

package.json/Gruntfile.js has been tooled up for jshint, jsdoc, mocha/chai/sinon unit testing and istanbul coverage reporting.

## Installation

```bash
  git clone https://github.com/bcowgill/node-play.git
  cd node-play
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
  npm production
  wget http://localhost:5508/ping/
```

## Tests

```bash
  npm test
  grunt test --reporter nyan
```

## Todo

- in progress - use supertests to spec the location microservice api
- write code to implement the api
- grunt run script plugin
- [15:25:57] Bruno Bossola: Error response:
http://microservices.qa.workshare.com:10002/api/countries.json/192.168.1.1
- [15:26:05] Bruno Bossola: Valid response:
http://microservices.qa.workshare.com:10002/api/countries.json/24.24.24.24
- [15:26:23] Bruno Bossola: .
- npm install forever
- npm install lodash

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

