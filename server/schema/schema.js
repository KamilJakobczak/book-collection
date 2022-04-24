const graphql = require('graphql');

const Book = require('../models/book');
const Author = require('../models/author');
const Publisher = require('../models/publisher');

const { AuthorType, BookType, PublisherType } = require('./types');
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
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
    publisher: {
      type: PublisherType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Publisher.findById(args.id);
      },
    },
    publishers: {
      type: new GraphQLList(PublisherType),
      resolve(parent, args) {
        return Publisher.find({});
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
        title: { type: new GraphQLNonNull(GraphQLString) },
        language: { type: GraphQLString },
        genre: { type: GraphQLString },
        pages: { type: new GraphQLNonNull(GraphQLInt) },
        authorId: { type: GraphQLID },
        publisherId: { type: GraphQLID },
        rating: { type: GraphQLInt },
        cover: { type: GraphQLString },
        isbn: { type: GraphQLString },
        firstEdition: { type: GraphQLInt },
        myEdition: { type: GraphQLInt },
        status: { type: GraphQLString },
        currency: { type: GraphQLString },
        buyPrice: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let book = new Book({
          title: args.title,
          language: args.language,
          genre: args.genre,
          pages: args.pages,
          authorId: args.authorId,
          publisherId: args.publisherId,
          rating: args.rating,
          cover: args.cover,
          isbn: args.isbn,
          firstEdition: args.firstEdition,
          myEdition: args.myEdition,
          status: args.status,
          currency: args.currency,
          buyPrice: args.buyPrice,
        });
        return book.save();
      },
    },
    // updateBook: {},
    addPublisher: {
      type: PublisherType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        website: { type: GraphQLString },
      },
      resolve(parent, args) {
        let publisher = new Publisher({
          name: args.name,
          address: args.address,
          city: args.city,
          website: args.website,
        });
        return publisher.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
