const { getSteps } = require('./../getSteps')
const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.ACCEPTMODE, {
  "AMAZON.YesIntent"() {
    console.log('YesIntent acceptHandler')
    this.attributes["lastStep"] = 0

    getSteps(this.attributes["meal"])
      .then((steps) => {
        if(steps.length == 0) {
          this.handler.state = states.SEARCHMODE;
          console.log('step 0 recipe')
          this.emit(':tell', 'Das war es. Bis zum nächsten mal.')
        } else {
	        console.log('step 1')
	        this.handler.state = states.COOKMODE;
	        this.emit(':tell', `Super. Es geht gleich los. Schritt 1: ${steps[0]}`)
	      }
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
  },
  "AMAZON.HelpIntent"() {
    console.log('HelpIntent acceptHandler')
    this.emit(':tell', 'Sage Ja um das Gericht zu bestätigen ode Nein um ein neues auszuwählen')
  }
})
