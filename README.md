node-play
=========

A node play area while working from the book Express in Action: Node applications with Express and its companion tools

package.json/Gruntfile.js has been tooled up for jshint, jsdoc, mocha/chai/sinon unit testing and istanbul coverage reporting.

## Installation

```bash
  git clone https://github.com/bcowgill/node-play.git
```

## Usage

```bash
  npm install
  grunt jshint:single --check-file lib/single-file.js
  grunt all watch --reporter landing
  npm run-script coverage-view
  npm run-script doc-view
```

## Tests

```bash
  npm test
  grunt test --reporter nyan
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

