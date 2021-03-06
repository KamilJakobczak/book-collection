const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const Book = require('../models/book');
const Author = require('../models/author');
const Publisher = require('../models/publisher');

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    nationality: { type: GraphQLString },
    birthDate: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({
          authorId: parent.id,
        });
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    language: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      },
    },
    genre: { type: GraphQLString },
    pages: { type: GraphQLInt },
    publisher: {
      type: PublisherType,
      resolve(parent, args) {
        return Publisher.findById(parent.publisherId);
      },
    },
    rating: { type: GraphQLInt },
    cover: { type: GraphQLString },
    isbn: { type: GraphQLString },
    firstEdition: { type: GraphQLInt },
    myEdition: { type: GraphQLInt },
    status: { type: GraphQLString },
    currency: { type: GraphQLString },
    buyPrice: { type: GraphQLInt },
  }),
});

const PublisherType = new GraphQLObjectType({
  name: 'Publisher',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    city: { type: GraphQLString },
    website: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({
          publisherId: parent.id,
        });
      },
    },
  }),
});
module.exports = { BookType, AuthorType, PublisherType };
