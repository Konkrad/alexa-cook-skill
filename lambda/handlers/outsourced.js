const { findRecipe } = require('./../findRecipe');
const states = require('./../states')

module.exports = {
  'search'() {
    console.log('search Event in seperate searchHandler')
    const query = this.event.request.intent.slots.query.value
    console.log('Eingabe', query)
    if (!query) {
      console.log('Suche', 'Nichts verstanden')
      this.emit(':ask', 'Wie bitte?')
      return;
    }

    findRecipe(query)
      .then((recipe) => {
        this.attributes["meal"] = recipe.id
        this.handler.state = states.ACCEPTMODE;
        console.log('accept recipe')
        this.emit(':ask', `Willst du ${recipe.name} zubereiten`);
      })
      .catch((err) => {
        console.log('error', err)
        this.handler.state = states.SEARCHMODE;
        this.emit(':ask', 'Ich habe dich leider nicht verstanden. Was möchtest du gerne kochen?')
      })
  },
  'stop'() {
    this.handler.state = states.SEARCHMODE;
    this.emit(':tell', 'tschau', 'ok', 'bis bald', 'auf wiedersehen')
  },
  'error'() {
    this.handler.state = states.SEARCHMODE;
    this.emit(':ask', 'Es ist leider ein Fehler passiert. Wiederhole deine Eingabe!')
  }
}