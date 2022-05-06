const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coverSchema = new Schema({
  bookId: String,
  name: String,
  imgPath: String,
});

module.exports = mongoose.model('Cover', coverSchema);
