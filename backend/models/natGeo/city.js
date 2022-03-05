// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const citySchema = mongoose.Schema({
  // _id: { type: mongoose.Types.ObjectId, require: true },
  word: { type: String, require: true, unique: true }
});

// Adding a username validation to our schema
citySchema.plugin(mongooseUniqueValidator);

// Connecting the schema to a database collection
citySchema.set('collection', 'city');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('City', citySchema);
