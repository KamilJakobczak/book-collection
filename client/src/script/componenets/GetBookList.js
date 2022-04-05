import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { LOAD_BOOKS } from '../GraphQL/Queries';

function GetBookList() {
  const { error, loading, data } = useQuery(LOAD_BOOKS);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
  }, [data]);
  console.log(books);
  // books.sort(function (a, b) {
  //   if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  //   if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  //   return 0;
  // });
  return (
    <div className='bookList'>
      {books.map((book, id) => (
        <div key={id}>
          <p>
            {book.title}-{book.author.name}-{book.publisher.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default GetBookList;
