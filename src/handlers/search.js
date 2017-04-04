const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.SEARCHMODE, {
  "SearchIntent"() {
    console.log('SearchIntent searchHandler')
    this.emit('search');
  },
  "LaunchRequest"() {
    console.log('LaunchRequest searchHandler');
    this.emit(':ask', 'Was möchtest du kochen?');
  },
  "AMAZON.StopIntent"() {
    console.log('StopIntent searchHandler')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('Unhandled searchHandler')
    this.emit('error');
  },
  "AMAZON.HelpIntent"() {
    console.log('HelpIntent searchHandler')
    this.emit(':tell', 'Frage den Skill was du kochen möchtest.')
  }
})