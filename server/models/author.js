const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  nationality: String,
  birthDate: Number,
});

module.exports = mongoose.model('Author', authorSchema);
