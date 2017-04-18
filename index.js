const Alexa = require('alexa-sdk');
var appId = 'amzn1.ask.skill.860aea0d-6f37-46d0-8d64-cf711f74caa9';

var Recipe = require('recipe_model')

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context    );
        alexa.appId = appId; 

    alexa.registerHandlers({
        NewSession() {
            this.emit(':tell', 'Servus')
        },
        SearchIntent() {
            const query = this.event.request.intent.slots.query.value
            if(query) {
                console.log(query)
                const regex = new RegExp(query,"i");
                const recipe = Recipe.find({title: regex})
                recipe.exec().then((val) => {
                    console.log(val)
                    this.emit(':tell', 'Schritt 1 ' + val[0].steps[0]);
                    mongoose.disconnect();
                })
            } else {
                this.emit(':ask', 'Wie bitte?', 'Nenne bitte ein Gericht.')
                mongoose.disconnect();
            }
        }
    });
    alexa.execute();
};