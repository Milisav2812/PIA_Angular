// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const animalSchema = mongoose.Schema({
  // _id: { type: mongoose.Types.ObjectId, require: true },
  word: { type: String, require: true, unique: true }
});

// Adding a username validation to our schema
animalSchema.plugin(mongooseUniqueValidator);

// Connecting the schema to a database collection
animalSchema.set('collection', 'animal');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('Animal', animalSchema);
