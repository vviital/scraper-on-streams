const http = require('http');
const concat = require('concat-stream');
const through = require('through2');
const parse = require('./parser');

function scrap(url, fn) {
  const stream = through({ objectMode: true }, fn);
  http.get(url, (res) => {
    res.setEncoding('utf8');
    res.pipe(concat(body => stream.end(parse(body, { url }))));
  });

  return stream;
}

module.exports = scrap;
