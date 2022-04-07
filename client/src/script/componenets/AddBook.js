import React, { useState, useEffect } from 'react';
import { ADD_BOOK } from '../GraphQL/Mutations';
import { LOAD_AUTHORS, LOAD_PUBLISHERS } from '../GraphQL/Queries';
import { useQuery, useMutation } from '@apollo/client';

function AddBook() {
  // variables
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [pages, setPages] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [rating, setRating] = useState('');
  const [ebook, setEbook] = useState('');
  const [isbn, setIsbn] = useState('');
  const [firstEdition, setFirstEdition] = useState('');
  const [myEdition, setMyEdition] = useState('');
  const [read, setRead] = useState('');
  const [currency, setCurrency] = useState('');
  const [buyPrice, setBuyPrice] = useState(0);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  //loading publishers
  const {
    err: errP,
    loading: loadingP,
    data: dataP,
  } = useQuery(LOAD_PUBLISHERS);

  useEffect(() => {
    if (dataP) {
      setPublishers(dataP.publishers);
    }
  }, [dataP]);

  //loading authors
  const { err, loading, data } = useQuery(LOAD_AUTHORS);

  useEffect(() => {
    if (data) {
      setAuthors(data.authors);
    }
  }, [data]);

  // handle author and publisher changes
  const handleAuthor = e => {
    const name = e.target.value;
    authors.forEach(el => {
      if (name === el.name) setAuthorId(el.id);
    });
  };
  const handlePublisher = e => {
    const name = e.target.value;
    publishers.forEach(el => {
      if (name === el.name) setPublisherId(el.id);
    });
  };

  //add a new book
  const [addBook, { error }] = useMutation(ADD_BOOK, {
    onCompleted(data) {
      setTitle('');
      setLanguage('');
      setGenre('');
      setPages('');
      setAuthorId('');
      setPublisherId('');
      setRating('');
      setEbook('');
      setIsbn('');
      setFirstEdition('');
      setMyEdition('');
      setRead('');
      setCurrency('');
      setBuyPrice('');
    },
  });

  const createBook = e => {
    e.preventDefault();
    setBuyPrice(buyPrice * 100);
    console.log(read);
    console.log(title);
    console.log(pages);

    // if (read === 'true') setRead(true);
    // if (read === 'false') setRead(false);
    // if (read !== Boolean) alert('Pick something');

    addBook({
      variables: {
        title: title === '' ? alert('provide a title') : title,
        language: language === '' ? 'polish' : language,
        genre: genre,
        pages: pages === '' ? 0 : pages,
        authorId: authorId,
        publisherId: publisherId,
        rating: rating > 0 ? rating : 0,
        ebook:
          ebook !== 'true' && ebook !== 'false'
            ? alert('Is it an ebook version?')
            : ebook,
        isbn: isbn,
        firstEdition: firstEdition === '' ? 0 : firstEdition,
        myEdition: myEdition === '' ? 0 : myEdition,
        read:
          read !== 'true' && read !== 'false'
            ? alert('Did you read this book?')
            : read,
        currency: buyPrice > 0 ? currency : '',
        buyPrice: buyPrice,
      },
    });

    if (error) console.log(error);
  };

  return (
    <form id='form_addBook' className='form_addBook'>
      <label htmlFor='title'>Title: </label>
      <input
        id='title'
        type='text'
        placeholder='title'
        onChange={e => {
          setTitle(e.target.value);
        }}
      />
      <label htmlFor='language'>Language: </label>
      <input
        id='language'
        type='text'
        placeholder='language'
        onChange={e => {
          setLanguage(e.target.value);
        }}
      />
      <label htmlFor='genre'>Genre: </label>

      <input
        id='genre'
        type='text'
        placeholder='genre'
        onChange={e => {
          setGenre(e.target.value);
        }}
      />
      <label htmlFor='pages'>Pages: </label>
      <input
        id='pages'
        type='number'
        placeholder='pages'
        onChange={e => {
          setPages(parseInt(e.target.value));
        }}
      />
      <label htmlFor='author'>Author: </label>
      <input
        id='author'
        list='authors-list'
        name='authors-list'
        onChange={e => handleAuthor(e)}
      />
      <datalist id='authors-list'>
        {authors.map(author => (
          <option key={author.id} value={author.name}>
            {author.name}
          </option>
        ))}
      </datalist>

      <label htmlFor='publisher'>Publisher: </label>
      <input
        id='publisher'
        list='publishers-list'
        name='publishers-list'
        onChange={e => {
          handlePublisher(e);
        }}
      />
      <datalist id='publishers-list'>
        {publishers.map(publisher => (
          <option key={publisher.id} value={publisher.name}>
            {publisher.name}
          </option>
        ))}
      </datalist>

      <label htmlFor='rating'>Rating:</label>
      <input
        type='range'
        placeholder='rating'
        id='rating'
        min='0'
        max='10'
        onChange={e => {
          setRating(e.target.value);
        }}
      />
      <label htmlFor='ebook'>Ebook?</label>
      <select
        id='ebook'
        name='ebook'
        onChange={e => {
          setEbook(e.target.value);
        }}
      >
        <option value=''>-choose-</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
      </select>
      <label htmlFor='isbn'>ISBN/ISSN: </label>
      <input
        id='isbn'
        type='text'
        placeholder='isbn'
        onChange={e => {
          setIsbn(e.target.value);
        }}
      />
      <label htmlFor='firstEdition'>First edition: </label>
      <input
        id='firstEdition'
        type='number'
        placeholder='first edition'
        onChange={e => {
          setFirstEdition(parseInt(e.target.value));
        }}
      />
      <label htmlFor='myEdition'>My edition:</label>
      <input
        id='myEdition'
        type='number'
        placeholder='my edition'
        onChange={e => {
          setMyEdition(parseInt(e.target.value));
        }}
      />
      <label htmlFor='readSelect'>Read or not?</label>
      <select
        id='readSelect'
        name='readSelect'
        onChange={e => {
          console.log(e.target.value);
          setRead(e.target.value);
        }}
      >
        <option value=''>-choose-</option>
        <option value='true'>Yes</option>
        <option value='false'>No</option>
      </select>

      <fieldset>
        <legend>Buy Price</legend>
        <input
          type='radio'
          name='currency'
          id='usd'
          onClick={e => {
            setCurrency(e.target.value);
          }}
        />
        <label htmlFor='usd'>USD</label>
        <input
          type='radio'
          name='currency'
          id='pln'
          onClick={e => {
            setCurrency(e.target.value);
          }}
        />
        <label htmlFor='pln'>PLN</label>
        <input
          form='form_addBook'
          type='radio'
          name='currency'
          id='eur'
          onClick={e => {
            setCurrency(e.target.value);
          }}
        />
        <label htmlFor='eur'>EUR</label>
        <br></br>
        <label htmlFor='value'>Value: </label>
        <input
          form='form_addBook'
          type='number'
          id='value'
          step='0.01'
          min='0'
          max='200'
          onChange={e => {
            setBuyPrice(e.target.value);
          }}
        />
      </fieldset>
      <button onClick={createBook}>Add book!</button>
    </form>
  );
}

export default AddBook;
