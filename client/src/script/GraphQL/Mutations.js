import { gql } from '@apollo/client';

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $language: String!
    $genre: String!
    $pages: Number!
    $author: ID!
    $publisher: ID!
    $rating: Number!
    $ebook: Boolean!
    $isbn: String!
    $firstEdition: Number!
    $myEdition: Number!
    $read: Boolean!
    $buyPrice: Number!
  ) {
    addBook(
      title: $title
      language: $language
      genre: $genre
      pages: $pages
      authorId: $author
      publisherId: $publisher
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
