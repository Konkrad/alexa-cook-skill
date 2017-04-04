const states = require('./../states')

module.exports = {
  "NewSession"() {
    console.log('new session')
    this.handler.state = 'SearchIntent';
    this.emit('search');
  },
  "LaunchRequest"() {
    console.log('new request');
    this.emit(':ask', 'Willkommen. Was möchtest du kochen?');
  },
  "AMAZON.StopIntent"() {
    console.log('newSession', 'stop')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('Unhandled newSession')
    this.emit('error');
  },
  "SessionEndedRequest"() {
    console.log('SessionEndedRequest newSession')
    this.emit(':tell', 'Du bist fertig. Bis zum nächsten mal.')
  },
  "SearchIntent"() {
    console.log('SearchIntent newSession');
    this.emit('search');
  },
  "AMAZON.HelpIntent"() {
    console.log('HelpIntent newSession')
    this.emit(':tell', 'Nenne das Gericht das du kochen möchtest beim Namen')
  }
}