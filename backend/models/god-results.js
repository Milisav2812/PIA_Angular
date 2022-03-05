// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const godResultsSchema = mongoose.Schema({
  username: { type: String, require: true },
  gameDate: { type: Date, require: true },
  result: { type: Number, require: true },
  verified: { type: Boolean, require: true }, // Did the supervisor inspect all input data on nat Geo
  finished: { type: Boolean, require: true } // Has the game been finished
});

// Connecting the schema to a database collection
godResultsSchema.set('collection', 'god-results');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('GODResults', godResultsSchema);
