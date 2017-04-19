const { getSteps } = require('./../getSteps')
const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.ACCEPTMODE, {
  "AMAZON.YesIntent"() {
    console.log('YesIntent acceptHandler')
    this.handler.state = states.SEARCHMODE;
    this.emit(':tell', 'Das war es schon. Tschau.')
  },
  "AMAZON.NoIntent"() {
    console.log('acceptHandler NoIntent')
    this.handler.state = states.SEARCHMODE;
    this.emit(':tell', 'Das war es schon. Tschau.')
  },
  "Unhandled"() {
    console.log('acceptHandler Unhandled')
    this.emit('error');
  },
  "AMAZON.StopIntent"() {
    console.log('acceptHandler StopIntent')
    this.emit('stop')
  },
  "AMAZON.HelpIntent"() {
    console.log('HelpIntent acceptHandler')
    this.emit(':tell', 'Sage Ja wenn es das richtige Gericht war und Nein, falls nicht.')
  }
})
