module.exports = {
  getSteps(id) {
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
}