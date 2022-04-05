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
