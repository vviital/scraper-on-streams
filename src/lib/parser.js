const cheerio = require('cheerio');
const url = require('url');

const extractLinks = $ => Array.from(new Set($('a')
  .map((i, elem) => $(elem).attr('href'))
  .toArray()
  .filter((link) => {
    const parsedLink = url.parse(link);
    return !parsedLink.hostname && parsedLink.pathname;
  })));

const getQuestion = ($, elem) =>
  $('strong.Question', elem)
    .parent()
    .contents()
    .last()
    .text()
    .replace('\n', ' ')
    .trim();

const getAnswer = ($, elem) =>
  $('strong.Answer', elem)
    .parent()
    .contents()
    .last()
    .text()
    .replace('\n', ' ')
    .trim();

function extractQuestions($) {
  const questions = $('.question')
    .map((i, elem) => ({
      question: getQuestion($, elem),
      answer: getAnswer($, elem),
    }))
    .toArray();

  return questions
    .filter(({ answer }) => answer && !answer.includes(' '));
}


module.exports = function (body) {
  const $ = cheerio.load(body);

  const urls = extractLinks($);
  const questions = extractQuestions($);

  return { questions, urls };
};

