const Alexa = require('alexa-sdk');
const appId = 'amzn1.ask.skill.860aea0d-6f37-46d0-8d64-cf711f74caa9';

const outsourcedHandlers = require('./handlers/outsourced');
const recipeHandler = require('./handlers/recipe');
const acceptHandler = require('./handlers/accept');
const searchHandler = require('./handlers/search');
const newSession = require('./handlers/new')

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log('caught uncaughtException', err)
})

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  alexa.dynamoDBTableName = 'bakk';
  alexa.registerHandlers(outsourcedHandlers, newSession, searchHandler, acceptHandler, recipeHandler);
  alexa.execute();
};