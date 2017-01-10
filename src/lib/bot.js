const fs = require('fs');
const url = require('url');
const scrap = require('./scrap');
const farmhash = require('farmhash');

module.exports = function scrapper({
  baseurl,
  limit,
  filename = 'tmp',
}) {
  const visited = new Set();
  const hashSet = new Set();
  const queue = [];
  const resultFileStream = fs.createWriteStream(filename, { autoClose: false });
  const { hostname, protocol, pathname } = url.parse(baseurl);

  let currentCount = 0;

  queue.push(pathname);

  function startLoad() {
    while (queue.length && currentCount < limit) {
      const currentUrl = url.format({
        pathname: queue.pop(),
        hostname,
        protocol,
      });

      if (!visited.has(currentUrl)) {
        visited.add(currentUrl);

        scrap(currentUrl, write)
          .pipe(resultFileStream, { end: false });

        currentCount += 1;
      }
    }
    if (currentCount === 0 && queue.length === 0) {
      resultFileStream.end();
    }
  }

  function write(object, _, next) {
    Array.prototype.push.apply(queue, object.urls);

    object.questions
      .filter(({ question }) => {
        const hash = farmhash.hash64(question);
        if (hashSet.has(hash)) return false;
        hashSet.add(hash);
        return true;
      })
      .reduce((stream, question) => {
        stream.push(`${JSON.stringify(question)}\n`);
        return stream;
      }, this);

    process.nextTick(() => {
      currentCount -= 1;
      console.log(visited.size);
      startLoad();
    });

    next();
  }

  startLoad();
};
