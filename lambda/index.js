const Alexa = require('alexa-sdk');
const appId = 'amzn1.ask.skill.860aea0d-6f37-46d0-8d64-cf711f74caa9';

const Recipe= require('./recipe_model');

const mongoose = require('mongoose');

const states = {
    SEARCHMODE: '_SEARCHMODE',
    ACCEPTMODE: '_ACCEPTMODE',  // Prompt the user to approve the search result.
    COOKMODE: '_COOKMODE' // User is trying to cook a recepie
};

process.on('uncaughtException', function(err) {
    // handle the error safely
    mongoose.disconnect();
    console.log(err)
})
console.log('I AM ALWAYS CALLED')

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'bakk';
    alexa.registerHandlers(searchHandler, acceptHandler, recepieHandler);
    alexa.execute();
};

var newSession = {
    "NewSession"() {
        this.handler.state = 'SearchIntent';
        this.emit('SearchIntent');
    },
    "AMAZON.StopIntent"() {
        console.log('Suche', 'stop')
        this.emit(':tell', "Tschau")
    },
    "Unhandled"() {
        console.log('OMG Search')
    },
    "SessionEndedRequest"() {
        console.log('destroy session')
        this.emit(':tell', 'Sie sind fertig. Tschau')
    }
}

var searchHandler = Alexa.CreateStateHandler(states.SEARCHMODE, {
    "SearchIntent"() { 
        const query = this.event.request.intent.slots.query.value
        console.log('Eingabe', query)
        if(!query) {
            console.log('Suche', 'Nichts verstanden')
            this.emit(':ask', 'Wie bitte?')
            return;
        }

        const regex = new RegExp(query,"i");
        mongoose.connect('mongodb://localhost/test');
        const mongo = Recipe.find({title: regex})
        mongo.exec().then((val) => {
            mongoose.disconnect()
            this.attributes["meal"] = val[0]._id;
            this.handler.state = states.ACCEPTMODE;
            console.log('Suche', 'Bestätigen')
            this.emit(':ask', `Willst du ${val[0].title} zubereiten`);
        })
        .catch((err) => {
            mongoose.disconnect()
            console.log('Fehler', err)
            this.emit(':tell', 'Leider gab es einen Fehler')
        })
    }, 
    "AMAZON.StopIntent"() {
        console.log('stop')
        this.handler.state = states.SEARCHMODE;
        this.emit(':tell', 'tschau')
    },
    "Unhandled"() {
        console.log('OMG SEARCHMODE')
    },
})

var acceptHandler = Alexa.CreateStateHandler(states.ACCEPTMODE, {
    "AMAZON.YesIntent"() {
        console.log('YES')
        this.attributes["lastStep"] = 0
        
        mongoose.connect('mongodb://localhost/test');
        const mongo = Recipe.find({"_id": this.attributes["meal"]})
        mongo.exec().then((val) => {
            mongoose.disconnect();
            console.log('Schritt 1')
            this.handler.state = states.COOKMODE;
            this.emit(':tell', `Super. Es geht gleich loss. Schritt 1: ${val[0].steps[0]}`)
        })
    },
    "AMAZON.NoIntent"() {
        console.log('NO')
        this.handler.state = states.SEARCHMODE;
        this.emit(':tell', 'Ok, Was möchtest du kochen?')
    },
    "Unhandled"() {
        console.log('OMG ACCEPTMODE')
    },
    "AMAZON.StopIntent"() {
        console.log('stop')
        this.handler.state = states.SEARCHMODE;
        this.emit(':tell', 'tschau')
    },
})

var recepieHandler = Alexa.CreateStateHandler(states.COOKMODE, {
    "AMAZON.RepeatIntent"() {
        console.log('Repeat')
        mongoose.connect('mongodb://localhost/test');
        const mongo = Recipe.find({"_id": this.attributes["meal"]})
        mongo.exec().then((val) => {
            mongoose.disconnect();
            const step = this.attributes["lastStep"];
            this.emit(':tell', `Schritt ${step + 1}. ${val[0].steps[step]}`)
        })
    },
    "AMAZON.NextIntent"() {
        console.log('next', this.attributes["lastStep"])
        let step = this.attributes["lastStep"];
        step = step + 1;
        this.attributes["lastStep"] = step;
        console.log('set to ', step)

        mongoose.connect('mongodb://localhost/test');
        const mongo = Recipe.find({"_id": this.attributes["meal"]})
        mongo.exec().then((val) => {
            console.log('gefunden, next')
            mongoose.disconnect();
            console.log(val[0].steps.length)
            if(step < val[0].steps.length) {
                this.emit(':tell', `Schritt ${step + 1}. ${val[0].steps[step]}`)
            } else {
                console.log('aus')
                this.handler.state = states.SEARCHMODE
                this.emit(':tell', 'tschau')
            }
        })
    },
    "AMAZON.StopIntent"() {
        console.log('stop')
        this.handler.state = states.SEARCHMODE
        this.emit(':tell', 'stop')
    },
    "Unhandled"() {
        console.log('OMG COOKED')
    }
})