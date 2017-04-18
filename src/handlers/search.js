const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.SEARCHMODE, {
  "SearchIntent"() {
    console.log('searchHandler SearchIntent')
    this.emit('search');
  },
  "LaunchRequest"() {
    console.log('searchHandler LaunchRequest');
    this.emit(':ask', 'Was möchtest du kochen?', 'Nenne bitte ein Gericht.');
  },
  "AMAZON.StopIntent"() {
    console.log('searchHandler StopIntent')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('searchHandler Unhandled')
    this.emit('error');
  },
  "AMAZON.HelpIntent"() {
    console.log('searchHandler HelpIntent')
    this.emit(':tell', 'Frage den Skill was du kochen möchtest.')
  }
})