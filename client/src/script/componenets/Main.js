import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Routes, Route } from 'react-router-dom';

import { LOAD_BOOKS_ID } from '../GraphQL/Queries';
import Collection from './Collection';
import Book from './Book';
import AddBook from './AddBook';
import AddAuthor from './AddAuthor';
import AddPublisher from './AddPublisher';

function Main() {
  const { error, loading, data, refetch } = useQuery(LOAD_BOOKS_ID);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
  }, [data]);

  return (
    <main>
      <Routes>
        <Route
          path=''
          element={
            <p>
              Don't really know what I'll put in a homepage so a placeholder for
              now.
            </p>
          }
        />
        <Route path='/collection' element={<Collection />} />
        <Route path='/newbook' element={<AddBook />} />
        <Route path='/newauthor' element={<AddAuthor />} />
        <Route path='/newpublisher' element={<AddPublisher />} />
        {books.map((book, id) => (
          <Route
            key={id}
            path={'/collection/' + book.id}
            element={<Book bookId={book.id} />}
          />
        ))}
      </Routes>
    </main>
  );
}
export default Main;
