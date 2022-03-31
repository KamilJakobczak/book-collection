const graphql = require('graphql');
const _ = require('lodash');
// const {
//   Book,
//   Genre,
//   Year,
//   Author,
//   Publisher,
//   Read,
//   ISBN,
//   Ebook,
// } = require('./models');
const Book = require('../models/book');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

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
    publisher: { type: GraphQLString },
    rating: { type: GraphQLInt },
    ebook: { type: GraphQLBoolean },
    isbn: { type: GraphQLString },
    firstEdition: { type: GraphQLInt },
    myEdition: { type: GraphQLInt },
    read: { type: GraphQLBoolean },
  }),
});

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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        nationality: { type: new GraphQLNonNull(GraphQLString) },
        birthDate: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          nationality: args.nationality,
          birthDate: args.birthDate,
        });
        return author.save();
      },
    },

    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        language: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
        publisher: { type: GraphQLString },
        rating: { type: GraphQLInt },
        ebook: { type: GraphQLBoolean },
        isbn: { type: GraphQLString },
        firstEdition: { type: GraphQLInt },
        myEdition: { type: GraphQLInt },
        read: { type: GraphQLBoolean },
      },
      resolve(parent, args) {
        let book = new Book({
          title: args.title,
          language: args.language,
          genre: args.genre,
          authorId: args.authorId,
          publisher: args.publisher,
          rating: args.rating,
          ebook: args.ebook,
          isbn: args.isbn,
          firstEdition: args.firstEdition,
          myEdition: args.myEdition,
          read: args.read,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
