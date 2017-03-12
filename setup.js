var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;

var data = require('./recipes')

var RecipeSchema = new Schema({
  title:  String,
  steps: { type: [String], index: true }
});

var Recipe = mongoose.model('Rcipe', RecipeSchema);

data.recipes.forEach((recipe) => {
    const tmp = new Recipe({
        title: recipe.title,
        steps: recipe.steps
    })
    tmp.save();
})

