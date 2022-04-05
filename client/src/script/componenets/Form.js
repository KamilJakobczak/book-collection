import React, { useState } from 'react';
import { ADD_BOOK } from '../GraphQL/Mutations';
import { useMutation } from '@apollo/client';

function Form() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [pages, setPages] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [rating, setRating] = useState('');
  const [ebook, setEbook] = useState('');
  const [isbn, setIsbn] = useState('');
  const [firstEdition, setFirstEdition] = useState('');
  const [myEdition, setMyEdition] = useState('');
  const [read, setRead] = useState('');
  const [currency, setCurrency] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const [addBook, { error }] = useMutation(ADD_BOOK);

  const createBook = () => {
    addBook({
      variables: {
        title: title,
        language: language,
        genre: genre,
        pages: pages,
        author: author,
        publisher: publisher,
        rating: rating,
        ebook: ebook,
        isbn: isbn,
        firstEdition: firstEdition,
        myEdition: myEdition,
        read: read,
        currency: currency,
        buyPrice: buyPrice,
      },
    });
    if (error) console.log(error);
  };

  return (
    <form className='form_addBook'>
      <label for='title'>Title: </label>
      <input
        id='title'
        type='text'
        placeholder='title'
        onChange={e => {
          setTitle(e.target.value);
        }}
      />
      <label for='language'>Language: </label>
      <input
        id='language'
        type='text'
        placeholder='language'
        onChange={e => {
          setLanguage(e.target.value);
        }}
      />
      <label for='genre'>Genre: </label>
      <input
        id='genre'
        type='text'
        placeholder='genre'
        onChange={e => {
          setGenre(e.target.value);
        }}
      />
      <label for='pages'>Pages: </label>
      <input
        id='pages'
        type='text'
        placeholder='pages'
        onChange={e => {
          setPages(e.target.value);
        }}
      />
      <label for='author'>Author: </label>
      <input
        id='author'
        type='text'
        placeholder='author'
        onChange={e => {
          setAuthor(e.target.value);
        }}
      />
      <label for='publisher'>Publisher: </label>
      <input
        id='publisher'
        type='text'
        placeholder='publisher'
        onChange={e => {
          setPublisher(e.target.value);
        }}
      />

      <label for='rating'>Rating:</label>
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
      <label for='ebook'>Ebook?</label>
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
      <label for='isbn'>ISBN/ISSN: </label>
      <input
        id='isbn'
        type='text'
        placeholder='isbn'
        onChange={e => {
          setIsbn(e.target.value);
        }}
      />
      <label for='firstEdition'>First edition: </label>
      <input
        id='firstEdition'
        type='text'
        placeholder='first edition'
        onChange={e => {
          setFirstEdition(e.target.value);
        }}
      />
      <label for='myEdition'>My edition:</label>
      <input
        id='myEdition'
        type='text'
        placeholder='my edition'
        onChange={e => {
          setMyEdition(e.target.value);
        }}
      />
      <label for='read'>Read or not?</label>
      <select
        id='read'
        name='read'
        onChange={e => {
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
        <label for='usd'>USD</label>
        <input
          type='radio'
          name='currency'
          id='pln'
          onClick={e => {
            setCurrency(e.target.value);
          }}
        />
        <label for='usd'>PLN</label>
        <input
          type='radio'
          name='currency'
          id='eur'
          onClick={e => {
            setCurrency(e.target.value);
          }}
        />
        <label for='usd'>EUR</label>
        <br></br>
        <label for='value'>Value: </label>
        <input
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

export default Form;
