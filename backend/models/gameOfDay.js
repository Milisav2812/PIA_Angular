// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const gameSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, require: true },
  gameDate: { type: Date, require: true, unique: true },
  anagramPhrase: { type: String, require: true },
  anagramResult: { type: String, require: true }
});

// Adding a username validation to our schema
gameSchema.plugin(mongooseUniqueValidator);

// Connecting the schema to a database collection
gameSchema.set('collection', 'game-of-day');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('GameOfDay', gameSchema);
