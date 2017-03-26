const { getSteps } = require('./../getSteps')
const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.ACCEPTMODE, {
  "AMAZON.YesIntent"() {
    console.log('YesIntent acceptHandler')
    this.attributes["lastStep"] = 0

    getSteps(this.attributes["meal"])
      .then((steps) => {
        console.log('step 1')
        this.handler.state = states.COOKMODE;
        this.emit(':tell', `Super. Es geht gleich loss. Schritt 1: ${steps[0]}`)
      })
  },
  "AMAZON.NoIntent"() {
    console.log('NoIntent acceptHandler')
    this.handler.state = states.SEARCHMODE;
    this.emit(':ask', 'Ok, Was möchtest du kochen?')
  },
  "Unhandled"() {
    console.log('Unhandled acceptHandler')
    this.emit('error');
  },
  "AMAZON.StopIntent"() {
    console.log('StopIntent acceptHandler')
    this.emit('stop')
  }
})