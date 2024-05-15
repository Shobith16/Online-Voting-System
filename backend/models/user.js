const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  age: Number,
  v_id: String,
  phone: Number,
  State:String,
  District:String,
  Taluk:String,
  password: String
});

module.exports = mongoose.model('voters', UserSchema);