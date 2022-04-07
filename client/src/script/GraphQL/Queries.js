import { gql } from '@apollo/client';

export const LOAD_BOOKS = gql`
  {
    books {
      title
      id
      author {
        name
      }
      publisher {
        name
      }
    }
  }
`;

export const LOAD_AUTHORS = gql`
  {
    authors {
      name
      id
    }
  }
`;

export const LOAD_PUBLISHERS = gql`
  {
    publishers {
      name
      id
    }
  }
`;
