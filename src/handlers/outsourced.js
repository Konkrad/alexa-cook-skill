const { findRecipe } = require('./../findRecipe');
const states = require('./../states')

module.exports = {
  'search'() {
    console.log('outSourcedHanlder searchIntent')
    const query = this.event.request.intent.slots.query.value
    console.log('outSourcedHanlder searchIntent query ', query)
    if (!query) {
      console.log('outSourcedHanlder searchIntent empty')
      this.emit(':ask', 'Wie bitte?', 'Nenne bitte ein Gericht')
      return;
    }

    findRecipe(query)
      .then((recipe) => {
        this.attributes["meal"] = recipe.id
        this.handler.state = states.ACCEPTMODE;
        console.log('outSourcedHanlder searchIntent foundRecipe')
        this.emit(':ask', `Willst du ${recipe.name} zubereiten`, 'Sage Ja oder Nein');
      })
      .catch((err) => {
        console.log('outSourcedHanlder searchIntent error ', err)
        this.handler.state = states.SEARCHMODE;
        this.emit(':ask', 'Ich habe dich leider nicht verstanden. Was möchtest du gerne kochen?', 'Nenne bitte ein Gericht.')
      })
  },
  'stop'() {
    console.log('outSourcedHanlder stopIntent')
    this.handler.state = states.SEARCHMODE;
    this.emit(':tell', 'tschau', 'ok', 'bis bald', 'auf wiedersehen')
  },
  'error'() {
    console.log('outSourcedHanlder error')
    this.handler.state = states.SEARCHMODE;
    this.emit(':ask', 'Es ist leider ein Fehler passiert. Wiederhole deine Eingabe!', 'Sag was du tun möchtest.')
  }
}