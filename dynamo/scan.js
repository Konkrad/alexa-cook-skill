var AWS = require('aws-sdk')
var dynamodb = new AWS.DynamoDB();

var params = {
  ExpressionAttributeValues: {
   ":val": {
     S: "käsespätzle"
    }
  }, 
  ExpressionAttributeNames: {
    "#nam": "name"
  },
  FilterExpression: "contains(#nam, :val )",
  TableName: "recipe"
 };
 dynamodb.scan(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);
 })