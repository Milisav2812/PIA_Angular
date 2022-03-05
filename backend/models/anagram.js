// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const anagramSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, require: true },
  phrase: { type: String, require: true },
  result: { type: String, require: true }
});

// Adding a username validation to our schema
anagramSchema.plugin(mongooseUniqueValidator);

// Connecting the schema to a database collection
anagramSchema.set('collection', 'anagram');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('Anagram', anagramSchema);
