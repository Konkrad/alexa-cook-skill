const mongoose = require('mongoose');
      mongoose.Promise = global.Promise
const Schema = mongoose.Schema;
const RecipeSchema = new Schema({
  title:  String,
  steps: { type: [String], index: true }
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe