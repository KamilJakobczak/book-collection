import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import GetBookList from './GetBookList';
import AddBook from './AddBook';
import AddAuthor from './AddAuthor';
import AddPublisher from './AddPublisher';

function Main() {
  return (
    <main>
      <Routes>
        <Route
          path='/'
          element={
            <p>
              Don't really know what I'll put in a homepage so a placeholder for
              now.
            </p>
          }
        />
        <Route path='/collection' element={<GetBookList />} />
        <Route path='/newbook' element={<AddBook />} />
        <Route path='/newauthor' element={<AddAuthor />} />
        <Route path='/newpublisher' element={<AddPublisher />} />
      </Routes>
    </main>
  );
}
export default Main;
