const Alexa = require('alexa-sdk');
const appId = 'amzn1.ask.skill.860aea0d-6f37-46d0-8d64-cf711f74caa9';

const states = {
  SEARCHMODE: '_SEARCHMODE',
  ACCEPTMODE: '_ACCEPTMODE',  // Prompt the user to approve the search result.
  COOKMODE: '_COOKMODE' // User is trying to cook a recepie
};

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log('caught uncaughtException', err)
})

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = appId;
  alexa.dynamoDBTableName = 'bakk';
  alexa.registerHandlers(search, newSession, searchHandler, acceptHandler, recipeHandler);
  alexa.execute();
};

var newSession = {
  "NewSession"() {
    console.log('new session')
    this.handler.state = 'SearchIntent';
    this.emit('search');
  },
  "AMAZON.StopIntent"() {
    console.log('newSession', 'stop')
    this.emit(':tell', "Tschau")
  },
  "Unhandled"() {
    console.log('Unhandled newSession')
  },
  "SessionEndedRequest"() {
    console.log('SessionEndedRequest newSession')
    this.emit(':tell', 'Sie sind fertig. Tschau')
  },
  "SearchIntent"() {
    console.log('SearchIntent newSession');
    this.emit('search');
  }
}

var searchHandler = Alexa.CreateStateHandler(states.SEARCHMODE, {
  "SearchIntent"() {
    console.log('SearchIntent searchHandler')
    this.emit('search');
  },
  "AMAZON.StopIntent"() {
    console.log('StopIntent searchHandler')
    this.handler.state = states.SEARCHMODE;
    this.emit(':tell', 'tschau')
  },
  "Unhandled"() {
    console.log('Unhandled searchHandler')
  },
})

var acceptHandler = Alexa.CreateStateHandler(states.ACCEPTMODE, {
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
    this.emit(':tell', 'Ok, Was möchtest du kochen?')
  },
  "Unhandled"() {
    console.log('Unhandled acceptHandler')
  },
  "AMAZON.StopIntent"() {
    console.log('StopIntent acceptHandler')
    this.handler.state = states.SEARCHMODE;
    this.emit(':tell', 'tschau')
  },
})

var recipeHandler = Alexa.CreateStateHandler(states.COOKMODE, {
  "SearchIntent"() {
    console.log('SearchIntent recipeHandler')
    this.emit('search');
  },
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
    this.handler.state = states.SEARCHMODE
    this.emit(':tell', 'stop')
  },
  "Unhandled"() {
    console.log('Unhandled recipeHandler')
  }
})

var search = {
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
        console.log('accept recipie')
        this.emit(':ask', `Willst du ${recipe.name} zubereiten`);
      })
      .catch((err) => {
        console.log('error', err)
        this.emit(':tell', 'Leider gab es einen Fehler')
      })
  }
}

function getSteps(id) {
  console.log("get steps for ", id)
  const AWS = require('aws-sdk')
  const dynamodb = new AWS.DynamoDB();
  const params = {
    Key: {
      "id": {
        S: String(id)
      }
    },
    "TableName": "recipe"
  }
  return new Promise((resolve, error) => {
    dynamodb.getItem(params, function (err, data) {
      if (err) error(err);
      else resolve(JSON.parse(data.Item.steps.S));
    })
  })
}

function findRecipe(value) {
  const AWS = require('aws-sdk')
  const dynamodb = new AWS.DynamoDB();
  const params = {
    ExpressionAttributeValues: {
      ":val": {
        S: value.toLowerCase()
      }
    },
    ExpressionAttributeNames: {
      "#nam": "name"
    },
    FilterExpression: "contains(#nam, :val )",
    TableName: "recipe"
  };
  return new Promise((resolve, error) => {
    dynamodb.scan(params, function (err, data) {
      if (data.Items.length === 0) {
        error('nothing found')
      } else if (err) {
        error(err)
      } else {
        resolve({
          id: data.Items[0].id.S,
          name: data.Items[0].name.S
        });
      }
    })
  })
}