function getRecipe(id) {
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
      if (err) error(err); // an error occurred
      else resolve(data);           // successful response
    })
  })
}

getRecipe(1)
.then((result) => {
    console.log(result)
})
.catch((err) => console.error)