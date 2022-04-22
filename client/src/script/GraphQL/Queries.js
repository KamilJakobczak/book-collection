import { gql } from '@apollo/client';

export const LOAD_BOOKS = gql`
  query Books {
    books {
      title
      id
      author {
        name
      }
    }
  }
`;
export const LOAD_BOOKS_ID = gql`
  query BooksId {
    books {
      id
    }
  }
`;

export const LOAD_BOOK = gql`
  query Book($id: ID!) {
    book(id: $id) {
      title
      language
      author {
        name
      }
      genre
      pages
      publisher {
        name
      }
      rating
      cover
      isbn
      firstEdition
      myEdition
      status
      currency
      buyPrice
    }
  }
`;

export const LOAD_AUTHORS = gql`
  query Authors {
    authors {
      name
      id
    }
  }
`;

export const LOAD_PUBLISHERS = gql`
  query Publishers {
    publishers {
      name
      id
    }
  }
`;
