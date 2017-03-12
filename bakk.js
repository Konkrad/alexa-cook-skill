const Alexa = require('alexa-sdk');
var appId = 'amzn1.ask.skill.860aea0d-6f37-46d0-8d64-cf711f74caa9';

var states = {
    SEARCHMODE: '_SEARCHMODE', // search for a recepie
    ACCEPTMODE: '_ACCEPTMODE',  // Prompt the user to approve the search result.
    COOKMODE: '_COOKMODE' // User is trying to cook a recepie
};

var searchHandler = Alexa.CreateStateHandler(states.SEARCHMODE, {
    "SearchIntent"() {      
        const query = this.event.request.intent.slots.query.value
        const recepie = await
        
        this.attributes["meal"] = //dbId

        this.handler.state = states.ACCEPTMODE;
        this.emit(':ask', `Willst du ${query} zubereiten`);
    },
    "AMAZON.StopIntent"() {

        this.emit(':tell', "Tschau")
    }

})

var acceptHandler = Alexa.CreateStateHandler(states.ACCEPTMODE, {
    "AMAZON.YesIntent"() {

        this.handler.state = states.COOKMODE;
        this.attributes["lastStep"] = 0//dbId

        this.emit(':tell', `Super. Es geht gleich loss. Schritt 1: ${step}`)
    },
    "AMAZON.NoIntent"() {

        this.handler.state = states.SEARCHMODE;
        this.emit(':tell', 'Ok, Was möchtest du kochen?')
    }
})

var recepieHandler = Alexa.CreateStateHandler(states.COOKMODE, {
    "AMAZON.RepeatIntent"() {

        this.emit(':tell', `Schritt ${step + 1}. `)
    },
    "AMAZON.NextIntent"() {
        const step = this.attributes["lastStep"]++;
        this.attributes["lastStep"] = step;

        this.emit(':tell', `Schritt ${step + 1}. `)
    },
    "AMAZON.StopIntent"() {
        this.handler.state = "SEARCHMODE";
    }
})