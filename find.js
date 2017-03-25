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
//const recipe = Recipe.find({title: regex})

// recipe.exec().then((val) => {
//     console.log(val[0]._id)
//     mongoose.disconnect();
// })

const id = Recipe.find({"_id": "58c5b93ba201dc3778c606f5"})

id.exec().then((val) => {
    console.log(val[0].steps[0]);
    mongoose.disconnect();
})