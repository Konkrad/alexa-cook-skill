const { getSteps } = require('./../getSteps')
const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports =  Alexa.CreateStateHandler(states.COOKMODE, {
  "AMAZON.RepeatIntent"() {
    console.log('recipeHandler RepeatIntent')

    getSteps(this.attributes["meal"])
      .then((steps) => {
        this.handler.state = states.COOKMODE;
        const step = this.attributes["lastStep"];
        this.emit(':tell', `Schritt ${step + 1}. ${steps[step]}`)
      })
  },
  "AMAZON.NextIntent"() {
    console.log('recipeHandler NextIntent for step ', this.attributes["lastStep"])
    let step = this.attributes["lastStep"];
    step = step + 1;
    this.attributes["lastStep"] = step;
    console.log('recipeHandler NextIntent next step ', step)

    getSteps(this.attributes["meal"])
      .then((steps) => {
        this.handler.state = states.COOKMODE;
        const step = this.attributes["lastStep"];
        if (step < steps.length) {
          this.emit(':tell', `Schritt ${step + 1}. ${steps[step]}`)
        } else {
          console.log('recipeHandler NextIntent done')
          this.handler.state = states.SEARCHMODE
          this.emit(':tell', 'tschau')
        }
      })
  },
  "AMAZON.StopIntent"() {
    console.log('recipeHandler StopIntent')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('recipeHandler Unhandled')
    this.emit(':ask', 'Ich habe dich leider nicht verstanden. Was möchtest du tun?', 'Sag was du tun möchtest.');
  },
  "AMAZON.HelpIntent"() {
    console.log('recipeHandler HelpIntent')
    this.emit(':tell', 'Frage den Skill wie es weitergeht oder bitte ihn darum den letzten Schritt zu wiederholen.')
  }
})