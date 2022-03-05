// Includes
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

// Creating a blueprint
const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  surname: { type: String, require: true },
  email: { type: String, require: true },
  occupation: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  gender: { type: Number, require: true },
  jmbg: { type: String, require: true },
  imagePath: { type: String, require: true },
  question: { type: String, require: true },
  answer: { type: String, require: true },
  type: {type: Number, require: true  },
  registered: { type: Boolean, require: true }
});

// Adding a username validation to our schema
userSchema.plugin(mongooseUniqueValidator);

// Connecting the schema to a database collection
userSchema.set('collection', 'users');

// To bypass Deprecation Error
mongoose.set('useCreateIndex', true);

// Creating a model out of our blueprint
module.exports = mongoose.model('Users', userSchema);
