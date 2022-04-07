const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  language: String,
  authorId: String,
  genre: String,
  pages: Number,
  publisherId: String,
  rating: Number,
  ebook: Boolean,
  isbn: String,
  firstEdition: Number,
  myEdition: Number,
  read: Boolean,
  buyPrice: Number,
});

module.exports = mongoose.model('Book', bookSchema);
