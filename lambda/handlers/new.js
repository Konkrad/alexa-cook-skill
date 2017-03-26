const states = require('./../states')

module.exports = {
  "NewSession"() {
    console.log('new session')
    this.handler.state = 'SearchIntent';
    this.emit('search');
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
    this.emit(':tell', 'Sie sind fertig. Tschau')
  },
  "SearchIntent"() {
    console.log('SearchIntent newSession');
    this.emit('search');
  }
}