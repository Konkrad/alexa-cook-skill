var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;
var RecipeSchema = new Schema({
  title:  String,
  steps: { type: [String], index: true }
});

var Recipe = mongoose.model('Recipe', RecipeSchema);

const query = "schnitzel"
const regex = new RegExp(query,"i");
const recipe = Recipe.find({title: regex})
recipe.exec().then((val) => {
    console.log(val[0].steps[0]);
})