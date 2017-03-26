module.exports = {
  findRecipe(value) {
    console.log('get value for', value.toLowerCase())
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
}