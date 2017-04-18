const { getSteps } = require('./../getSteps')
const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports = Alexa.CreateStateHandler(states.ACCEPTMODE, {
  "AMAZON.YesIntent"() {
    console.log('acceptHandler YesIntent')
    this.attributes["lastStep"] = 0

    getSteps(this.attributes["meal"])
      .then((steps) => {
        if(steps.length == 0) {
          this.handler.state = states.SEARCHMODE;
          console.log('acceptHandler YesIntent step 0')
          this.emit(':tell', 'Das war es. Bis zum nächsten mal.')
        } else {
	        console.log('acceptHandler YesIntent step 1')
	        this.handler.state = states.COOKMODE;
	        this.emit(':tell', `Super. Es geht gleich los. Schritt 1: ${steps[0]}`)
	      }
      })
  },
  "AMAZON.NoIntent"() {
    console.log('acceptHandler NoIntent')
    this.handler.state = states.SEARCHMODE;
    this.emit(':ask', 'Ok, Was möchtest du kochen?', 'Nenne bitte ein Gericht.')
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
    console.log('acceptHandler HelpIntent')
    this.emit(':tell', 'Sage Ja um das Gericht zu bestätigen ode Nein um ein neues auszuwählen')
  }
})
