function getRecipe(id) {
  const AWS = require('aws-sdk')
	AWS.config.update({
	    region: 'eu-west-1'
	});
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
