const http = require('http');
const concat = require('concat-stream');
const through = require('through2');
const parse = require('./parser');
const logger = require('./logger');

function sendRequest(url, stream, tryAgain) {
  const request = http.get(url, (res) => {
    res.setEncoding('utf8');
    res.pipe(concat(body => stream.end(parse(body, { url }))));
  })
    .on('error', (error) => {
      logger.error(`${url} - ${error.message}`);
      if (tryAgain) {
        sendRequest(url, stream, tryAgain - 1);
      }
    });
  return request;
}

function scrap(url, fn, tryAgain = 5) {
  const stream = through({ objectMode: true }, fn);

  sendRequest(url, stream, tryAgain);

  return stream;
}

module.exports = scrap;
