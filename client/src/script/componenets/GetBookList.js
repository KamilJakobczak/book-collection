import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Book from './Book';
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
  // console.log(books);
  // books.sort(function (a, b) {
  //   if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  //   if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  //   return 0;
  // });

  return (
    <div className='collection'>
      {books.map((book, id) => (
        <div className='singleBookTile' key={id}>
          <Link to={'/' + book.id} element={<Book bookId={book.id} />}>
            {book.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default GetBookList;
