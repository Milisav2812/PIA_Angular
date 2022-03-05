// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const plantSchema = mongoose.Schema({
  // _id: { type: mongoose.Types.ObjectId, require: true },
  word: { type: String, require: true, unique: true }
});

// Adding a username validation to our schema
plantSchema.plugin(mongooseUniqueValidator);

// Connecting the schema to a database collection
plantSchema.set('collection', 'plant');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('Plant', plantSchema);
