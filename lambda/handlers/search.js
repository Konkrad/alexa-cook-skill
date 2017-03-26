const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.SEARCHMODE, {
  "SearchIntent"() {
    console.log('SearchIntent searchHandler')
    this.emit('search');
  },
  "AMAZON.StopIntent"() {
    console.log('StopIntent searchHandler')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('Unhandled searchHandler')
    this.emit('error');
  },
})