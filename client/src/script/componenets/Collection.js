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
  // const promise = new Promise(function (resolve, reject) {
  //   resolve();
  // });
  const [search, setSearch] = useState('');
  const { error, loading, data, refetch } = useQuery(LOAD_BOOKS);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (data) {
      setBooks(data.books);
    }
  }, [data]);
  if (loading) return <p>loading</p>;
  // useEffect(() => {
  //   (async () => {
  //     setBooks(data);
  //     console.log(books);
  //   })();

  //   return () => {
  //     console.log('componenet unmounted');
  //   };
  // });

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
  // const booksAToZ = books;
  // console.log(booksAToZ);
  // const booksAToZ = books.sort();
  if (books.length !== 0) {
    let booksSort = [...books];

    if (search !== '') {
      let bookSearch = [];
      booksSort.forEach(book => {
        if (book.title.toLowerCase().includes(search)) {
          bookSearch.push(book);
        }
      });
      booksSort = bookSearch;
    } else {
      booksSort.sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
    }

    return (
      <div className='collection'>
        <div className='searchEngine'>
          <input
            className='searchEngine_input'
            type='text'
            placeholder='Looking for a specific book?'
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className='bookTiles'>
          {booksSort.map((book, id) => (
            <div className='singleBookTile' key={id}>
              <Link
                to={'/collection/' + book.id}
                element={<Book bookId={book.id} />}
                // onClick={handleBookClick(book.id)}
              >
                {book.title} -{' '}
                {book.author.name === undefined ? null : book.author.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Collection;
