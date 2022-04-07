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
    $read: String!
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
      read: $read
      buyPrice: $buyPrice
    ) {
      title
    }
  }
`;
