import React, { useState, useEffect } from 'react';
import { ADD_BOOK } from '../GraphQL/Mutations';
import { LOAD_AUTHORS, LOAD_PUBLISHERS } from '../GraphQL/Queries';
import { useQuery, useMutation } from '@apollo/client';
import PopUp from './PopUp';

function AddBook() {
  // variables
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [pages, setPages] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [rating, setRating] = useState('');
  const [cover, setCover] = useState('');
  const [isbn, setIsbn] = useState('');
  const [firstEdition, setFirstEdition] = useState('');
  const [myEdition, setMyEdition] = useState('');
  const [status, setStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [buyPrice, setBuyPrice] = useState(0);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [popUpFlag, setPopUpFlag] = useState(1);

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

  // handle functions and validation
  const handleAuthor = e => {
    const name = e.target.value;
    authors.forEach(el => {
      if (name === el.name) {
        setAuthorId(el.id);
      } else setAuthorId('');
    });
    console.log(authorId);
  };
  const handlePublisher = e => {
    const name = e.target.value;
    publishers.forEach(el => {
      if (name === el.name) {
        setPublisherId(el.id);
      } else setPublisherId('');
    });
  };
  const handleNumberFields = e => {
    const value = e.target.value;
    switch (e.target.id) {
      case 'pages':
        setPages(value);
        if (isNaN(value) === true || value <= 0) {
          e.target.classList.add('invalid');
        } else {
          e.target.classList.remove('invalid');
          setPages(parseInt(value));
          console.log();
        }
        break;
      case 'rating':
        setRating(value);
        if (isNaN(value)) {
          e.target.classList.add('invalid');
        } else {
          e.target.classList.remove('invalid');
          setRating(parseInt(value));
        }

        break;
      case 'firstEdition':
        setFirstEdition(value);
        if (isNaN(value) === true || value < -2000 || value > 2100) {
          e.target.classList.add('invalid');
        } else {
          e.target.classList.remove('invalid');
          setFirstEdition(parseInt(value));
        }
        break;
      case 'myEdition':
        setMyEdition(value);
        if (isNaN(value) === true || value < -2000 || value > 2100) {
          e.target.classList.add('invalid');
        } else {
          setMyEdition(parseInt(value));
          e.target.classList.remove('invalid');
        }
        break;
      case 'value':
        setBuyPrice(value);
        if (isNaN(value)) {
          e.target.classList.add('invalid');
        } else {
          setBuyPrice(parseFloat(value) * 100);
          e.target.classList.remove('invalid');
        }
        break;
      default:
        console.log('default');
    }
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
      setCover('');
      setIsbn('');
      setFirstEdition('');
      setMyEdition('');
      setStatus('');
      setCurrency('');
      setBuyPrice('');
    },
  });

  const createBook = e => {
    e.preventDefault();

    const numberValues = [
      { name: 'pages', value: pages },
      { name: 'rating', value: rating },
      { name: 'First edition', value: firstEdition },
      { name: 'Your edition', value: myEdition },
      { name: 'Buy price', value: buyPrice },
    ];
    let errors = [];

    numberValues.forEach(element => {
      if (isNaN(element.value) === true || element.value === '') {
        errors.push(element.name);
      }
    });

    // if (status === 'true') setRead(true);
    // if (status === 'false') setRead(false);
    // if (status !== Boolean) alert('Pick something');
    if (errors.length > 0) {
      const errorsList = errors.join(', ');
      alert(
        `Can't send this form. Correct these errors: ${errorsList} and try again`
      );
      return;
    }
    if (authorId !== '' && publisherId !== '') {
      addBook({
        variables: {
          title: title === '' ? alert('provide a title') : title,
          language: language === '' ? 'polish' : language,
          genre: genre,
          pages: pages === '' ? 0 : pages,
          authorId: authorId,
          publisherId: publisherId,
          rating: rating > 0 ? rating : 0,
          cover: cover === '' ? alert('pick a cover') : cover,
          isbn: isbn,
          firstEdition: firstEdition === '' ? 0 : firstEdition,
          myEdition: myEdition === '' ? 0 : myEdition,
          status: status === '' ? alert('pick a status') : status,
          currency: buyPrice > 0 ? currency : '',
          buyPrice: buyPrice,
        },
      });
    } else {
      document.body.classList.add('blur');
      setPopUpFlag(1);
    }

    if (error) console.log(error);
  };

  return (
    <>
      {popUpFlag === 1 ? <PopUp /> : null}
      <form id='form_addBook' className='form_addBook'>
        <div className='form_element'>
          <label htmlFor='title'>Title: </label>
          <input
            id='title'
            type='text'
            required
            placeholder='title'
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='language'>Language: </label>
          <input
            id='language'
            type='text'
            placeholder='language'
            onChange={e => {
              setLanguage(e.target.value);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='genre'>Genre: </label>
          <input
            id='genre'
            type='text'
            placeholder='genre'
            onChange={e => {
              setGenre(e.target.value);
            }}
          />
        </div>

        <div className='form_element'>
          <label htmlFor='pages'>Pages: </label>
          <input
            id='pages'
            type='text'
            placeholder='pages'
            onChange={e => {
              handleNumberFields(e);
            }}
          />
        </div>

        <div className='form_element'>
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
        </div>

        <div className='form_element'>
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
        </div>

        <div className='form_element'>
          <label htmlFor='rating'>Rating:</label>
          <input
            type='range'
            id='rating'
            min='0'
            max='10'
            step='1'
            onChange={e => {
              setRating(e.target.value);
            }}
          />
          <p id='ratingId'>{rating}</p>
        </div>

        <div className='form_element'>
          <label htmlFor='cover'>Cover type: </label>
          <select
            id='cover'
            name='cover'
            onChange={e => {
              setCover(e.target.value);
            }}
          >
            <option value=''>-choose-</option>
            <option value='Paperback'>Paperback</option>
            <option value='Hardcover'>Hardcover</option>
            <option value='eBook'>eBook</option>
          </select>
        </div>
        <div className='form_element'>
          <label htmlFor='isbn'>ISBN/ISSN: </label>
          <input
            id='isbn'
            type='text'
            placeholder='isbn'
            onChange={e => {
              setIsbn(e.target.value);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='firstEdition'>First edition: </label>
          <input
            id='firstEdition'
            type='text'
            placeholder='first edition'
            onChange={e => {
              handleNumberFields(e);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='myEdition'>My edition:</label>
          <input
            id='myEdition'
            type='text'
            placeholder='my edition'
            onChange={e => {
              handleNumberFields(e);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='readSelect'>Read or not?</label>
          <select
            id='readSelect'
            name='readSelect'
            onChange={e => {
              setStatus(e.target.value);
            }}
          >
            <option value=''>-choose-</option>
            <option value='read'>Read</option>
            <option value='unread'>Unread</option>
            <option value='wanted'>Wanted</option>
          </select>
        </div>

        <div className='form_element'>
          <legend>Buy Price:</legend>
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
          <label htmlFor='value'>Price: </label>
          <input
            form='form_addBook'
            type='text'
            id='value'
            onChange={e => handleNumberFields(e)}
          />
        </div>
        <div className='form_element'>
          <button onClick={createBook}>Add book!</button>
        </div>
      </form>
    </>
  );
}

export default AddBook;
