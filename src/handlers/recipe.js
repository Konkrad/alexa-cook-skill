const { getSteps } = require('./../getSteps')
const states = require('./../states')
const Alexa = require('alexa-sdk')

module.exports =  Alexa.CreateStateHandler(states.COOKMODE, {
  "AMAZON.RepeatIntent"() {
    console.log('RepeatIntent recipeHandler')

    getSteps(this.attributes["meal"])
      .then((steps) => {
        this.handler.state = states.COOKMODE;
        const step = this.attributes["lastStep"];
        this.emit(':tell', `Schritt ${step + 1}. ${steps[step]}`)
      })
  },
  "AMAZON.NextIntent"() {
    console.log('NextIntent for', this.attributes["lastStep"], 'recipeHandler')
    let step = this.attributes["lastStep"];
    step = step + 1;
    this.attributes["lastStep"] = step;
    console.log('set to ', step)

    getSteps(this.attributes["meal"])
      .then((steps) => {
        this.handler.state = states.COOKMODE;
        const step = this.attributes["lastStep"];
        if (step < steps.length) {
          this.emit(':tell', `Schritt ${step + 1}. ${steps[step]}`)
        } else {
          console.log('All steps processed, quit, recipeHandler')
          this.handler.state = states.SEARCHMODE
          this.emit(':tell', 'tschau')
        }
      })
  },
  "AMAZON.StopIntent"() {
    console.log('StopIntent recipeHandler')
    this.emit('stop')
  },
  "Unhandled"() {
    console.log('Unhandled recipeHandler')
    this.emit(':ask', 'Ich habe dich leider nicht verstanden. Was möchtest du tun?', 'Sag was du tun möchtest.');
  },
  "AMAZON.HelpIntent"() {
    console.log('HelpIntent recipeHandler')
    this.emit(':tell', 'Frage den Skill wie es weitergeht oder bitte ihn darum den letzten Schritt zu wiederholen.')
  }
})