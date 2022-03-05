// Includes
const mongoose = require('mongoose');

// Creating a blueprint
const natGeoSchema = mongoose.Schema({
  username: { type: String, require: true },
  gameDate: { type: String, require: true },
  country: { type: String, require: false },
  city: { type: String, require: false },
  lake: { type: String, require: false },
  mountain: { type: String, require: false },
  river: { type: String, require: false },
  animal: { type: String, require: false },
  plant: { type: String, require: false },
  band: { type: String, require: false },
  verified: { type: Boolean, require: true }
});

// Connecting the schema to a database collection
natGeoSchema.set('collection', 'nat-geo-supervisor');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('NatGeo', natGeoSchema);
