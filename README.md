node-play
=========

A node play area while working from the book Express in Action: Node applications with Express and its companion tools

package.json/Gruntfile.js has been tooled up for jshint, jsdoc, mocha/chai/sinon unit testing and istanbul coverage reporting.

It also uses 'forever' to start the app and keep it running. The dev startup will restart when changes are made to the code.

## Installation

```bash
  git clone https://github.com/bcowgill/node-play.git
  cd node-play
  npm install
  sudo npm install -g forever istanbul jsdoc mocha
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
```

## Tests

```bash
  npm test
  grunt test --reporter nyan
```

## Todo

- 95% write code to implement the api
- grunt run script plugin
- npm install lodash

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

