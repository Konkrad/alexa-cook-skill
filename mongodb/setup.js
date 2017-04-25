var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;

var data = require('../recipes')

var RecipeSchema = new Schema({
  title:  String,
  steps: { type: [String], index: true }
});

var Recipe = mongoose.model('Recipe', RecipeSchema);

Promise.all(data.recipes.map((recipe) => {
    const tmp = new Recipe({
        title: recipe.title,
        steps: recipe.steps
    })
    return tmp.save();
})).then(() => {
    mongoose.disconnect();
    console.log('done with populating mongodb');
    })

