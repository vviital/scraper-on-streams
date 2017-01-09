const scrap = require('./lib/bot');

scrap({
  baseurl: 'http://db.chgk.info/tour/vorost13',
  limit: 10,
  filename: 'results',
});
