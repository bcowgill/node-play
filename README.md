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
  npm run-script coverage-view
  npm run-script doc-view
  npm run-script edit
```

## Tests

```bash
  npm test
  grunt test --reporter nyan
```

## Todo

- use supertests to spec the location microservice api
- write code to implement the api

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

