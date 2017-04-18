const cheerio = require('cheerio');
const url = require('url');
const _ = require('lodash');

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
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

const getAnswer = ($, elem) =>
  $('strong.Answer', elem)
    .parent()
    .contents()
    .last()
    .text()
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

const getPathCriteria = ($, elem) =>
  $('.PassCriteria', elem)
    .parent()
    .contents()
    .last()
    .text()
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .split(';')
    .filter(value => value);

const getQuestionResources = ($, elem) =>
  $('strong.Question', elem)
    .parent()
    .children('img')
    .map((i, img) => $(img).attr('src'))
    .toArray();

const getAnswerResources = ($, elem) =>
  $('.collapsible', elem)
    .find('img')
    .map((i, img) => $(img).attr('src'))
    .toArray();

function extractQuestions($, { url }) {
  const questions = $('.question')
    .map((i, elem) => ({
      question: getQuestion($, elem),
      answer: _.trimEnd(getAnswer($, elem), '.'),
      pathCriteria: getPathCriteria($, elem),
      questionResources: getQuestionResources($, elem),
      answerResources: getAnswerResources($, elem),
    }))
    .toArray();

  return questions
    .filter(({ answer, question }) => answer && !answer.includes(' ') 
      && answer.length < question.length);
}


module.exports = function (body, options) {
  const $ = cheerio.load(body);

  const urls = extractLinks($);
  const questions = extractQuestions($, options);

  return { questions, urls };
};

