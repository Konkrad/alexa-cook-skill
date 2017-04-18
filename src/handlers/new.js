const states = require('./../states')

module.exports = {
  "NewSession"() {
    console.log('newSessionHandler NewSession')
    this.handler.state = 'SearchIntent';
    this.emit('search');
  },
  "LaunchRequest"() {
    console.log('newSessionHandler LaunchRequest');
    this.emit(':ask', 'Willkommen. Was möchtest du kochen?', 'Nenne bitte ein Gericht.');
  },
  "AMAZON.StopIntent"() {
    console.log('newSessionHandler StopIntent')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('newSessionHandler Unhandled')
    this.emit('error');
  },
  "SessionEndedRequest"() {
    console.log('newSessionHandler SessionEndedRequest')
    this.emit(':tell', 'Du bist fertig. Bis zum nächsten mal.')
  },
  "SearchIntent"() {
    console.log('newSessionHandler SearchIntent');
    this.emit('search');
  },
  "AMAZON.HelpIntent"() {
    console.log('newSessionHandler HelpIntent')
    this.emit(':tell', 'Nenne das Gericht das du kochen möchtest beim Namen')
  }
}