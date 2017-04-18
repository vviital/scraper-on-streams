const scrap = require('./lib/bot');

scrap({
  baseurl: 'http://db.chgk.info/tour/barhat14',
  limit: 200,
  filename: 'results',
});
