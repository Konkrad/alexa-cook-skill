var AWS = require('aws-sdk')
var data = require('./recipes').recipes
var dynamodb = new AWS.DynamoDB();

Promise.all(data.map((recipe, key) => {
    const params = {
        Item: {
            "id": {
                S: String(key)
            },
            "name": {
                S: recipe.title.toLowerCase()
            },
            "steps": {
                S: JSON.stringify(recipe.steps)
            }
        },
        "TableName": "recipe"
    }
    return new Promise((resolve, error) => {
        dynamodb.putItem(params, function(err, data) {
            if (err) error(err, err.stack); // an error occurred
            else     resolve(data);           // successful response
        })
    })
}))
.then((sucess) => {
    console.log('alles funktioniert')
})
.catch((err) => {
    console.log('fehler', err)
})
