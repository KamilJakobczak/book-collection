import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Book from './Book';
import { LOAD_BOOKS } from '../GraphQL/Queries';

function Collection() {
  // console.log(books);
  // books.sort(function (a, b) {
  //   if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  //   if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  //   return 0;
  // });
  const { error, loading, data, refetch } = useQuery(LOAD_BOOKS);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
  }, [data]);
  // const handleBookClick = ids => console.log(ids);
  // const {
  //   err: errorB,
  //   loading: loadingB,
  //   data: dataB,
  //   refetch: refetchB,
  // } = useQuery(LOAD_BOOK, {
  //   variables: { handleBookClick },
  // });
  // useEffect(() => {
  //   if (dataB) {
  //     setBook(dataB);
  //   }
  // });
  // console.log(dataB);
  return (
    <div className='collection'>
      {books.map((book, id) => (
        <div className='singleBookTile' key={id}>
          <Link
            to={'/collection/' + book.id}
            element={<Book bookId={book.id} />}
            // onClick={handleBookClick(book.id)}
          >
            {book.title} - {book.author.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Collection;
