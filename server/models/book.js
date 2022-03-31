const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  language: String,
  authorId: String,
  genre: String,
  publisher: String,
  rating: Number,
  ebook: Boolean,
  isbn: Number,
  firstEdition: Number,
  myEdition: Number,
  read: Boolean,
});

module.exports = mongoose.model('Book', bookSchema);
