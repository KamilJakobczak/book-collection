import { gql } from '@apollo/client';

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $language: String!
    $genre: String!
    $pages: Int!
    $authorId: ID!
    $publisherId: ID!
    $rating: Int!
    $ebook: String!
    $isbn: String!
    $firstEdition: Int!
    $myEdition: Int!
    $cover: String!
    $buyPrice: Int!
  ) {
    addBook(
      title: $title
      language: $language
      genre: $genre
      pages: $pages
      authorId: $authorId
      publisherId: $publisherId
      rating: $rating
      ebook: $ebook
      isbn: $isbn
      firstEdition: $firstEdition
      myEdition: $myEdition
      cover: $cover
      buyPrice: $buyPrice
    ) {
      title
    }
  }
`;
export const ADD_AUTHOR = gql`
  mutation addAuthor($name: String!, $nationality: String!, $birthDate: Int!) {
    addAuthor(name: $name, nationality: $nationality, birthDate: $birthDate) {
      name
    }
  }
`;

export const ADD_PUBLISHER = gql`
  mutation addPublisher(
    $name: String!
    $address: String!
    $city: String!
    $website: String!
  ) {
    addPublisher(
      name: $name
      address: $address
      city: $city
      website: $website
    ) {
      name
    }
  }
`;
