var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/test');
    mongoose.Promise = global.Promise
var Schema = mongoose.Schema;
var RecipeSchema = new Schema({
  title:  String,
  steps: { type: [String], index: true }
});
var Recipe = mongoose.model('Recipe', RecipeSchema);

const query = "schnitzel"
const regex = new RegExp(query,"i");
const id = Recipe.find({title: regex})

id.exec().then((val) => {
    console.log(val[0].steps[0]);
    mongoose.disconnect();
})