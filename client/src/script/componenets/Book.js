import React from 'react';
import BookData from './BookData';

function Book(props) {
  return (
    <div className='singleBookPage'>
      <div className='cover'></div>
      <BookData bookId={props.bookId} />
      <div className='bookQuotes'></div>
    </div>
  );
}

export default Book;
