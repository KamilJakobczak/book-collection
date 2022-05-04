import React, { useState, useEffect } from 'react';
import { ADD_BOOK } from '../GraphQL/Mutations';
import { LOAD_AUTHORS, LOAD_PUBLISHERS } from '../GraphQL/Queries';
import { useQuery, useMutation } from '@apollo/client';
import PopUp from './PopUp';

function AddBook(props) {
  const pendingBook = props.pendingBookData;
  const clearBook = props.clearBook;
  const bookId = props.bookId;

  const [visible, setVisible] = useState(true);
  const [addedBook, setAddedBook] = useState('');
  // variables
  const [title, setTitle] = useState(
    pendingBook === undefined ? '' : pendingBook.title
  );
  const [language, setLanguage] = useState(
    pendingBook === undefined ? '' : pendingBook.language
  );
  const [genre, setGenre] = useState('');
  const [pages, setPages] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [rating, setRating] = useState('');
  const [cover, setCover] = useState(props.ebook === true ? 'eBook' : '');
  const [isbn, setIsbn] = useState(
    pendingBook === undefined ? '' : pendingBook.ISBN
  );
  const [firstEdition, setFirstEdition] = useState('');
  const [myEdition, setMyEdition] = useState('');
  const [status, setStatus] = useState('');
  const [currency, setCurrency] = useState('pln');
  const [buyPrice, setBuyPrice] = useState(0);

  const [authorName, setAuthorName] = useState(
    pendingBook === undefined ? '' : pendingBook.author
  );
  const [publisherName, setPublisherName] = useState(
    pendingBook === undefined ? '' : pendingBook.publisher
  );
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  const [popUpFlag, setPopUpFlag] = useState(1);

  //loading publishers
  const {
    err: errP,
    loading: loadingP,
    data: dataP,
    refetch: refetchP,
  } = useQuery(LOAD_PUBLISHERS);

  useEffect(() => {
    if (dataP) {
      setPublishers(dataP.publishers);
    }
  }, [dataP]);

  //loading authors
  const { err, loading, data, refetch } = useQuery(LOAD_AUTHORS);
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
      } else {
        setAuthorId('');
        setAuthorName(name);
      }
    });
    console.log(authorId);
  };
  const handlePublisher = e => {
    const name = e.target.value;
    publishers.forEach(el => {
      if (name === el.name) {
        setPublisherId(el.id);
      } else {
        setPublisherId('');
        setPublisherName(name);
      }
    });
    console.log(publisherId);
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
  const handleReadSelect = e => {
    const rating = document.getElementById('rating');
    if (e.target.value !== '') {
      setStatus(e.target.value);
      rating.disabled = false;
    } else rating.disabled = true;
  };

  // closing popUp
  const popUpClose = () => {
    refetch();
    refetchP();
    setPopUpFlag(0);
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
      setAuthorName('');
      setPublisherName('');

      clearBook(bookId);
      setAddedBook(data.addBook.title);
      refetch();
      refetchP();
      setVisible(false);
    },
  });

  const createBook = e => {
    e.preventDefault();

    const numberValues = [
      { name: 'pages', value: pages },
      // { name: 'rating', value: rating },
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
    // console.log(authorId, publisherId);
    if (authorId !== '' && publisherId !== '') {
      addBook({
        variables: {
          title: title === '' ? alert('provide a title') : title,
          language: language === '' ? 'polish' : language,
          genre: genre,
          pages: pages === '' ? 0 : pages,
          authorId: authorId,
          publisherId: publisherId,
          rating: rating > 0 ? rating : -1,
          cover: cover === '' ? alert('pick a cover') : cover,
          isbn: isbn,
          firstEdition: firstEdition === '' ? 0 : firstEdition,
          myEdition: myEdition === '' ? 0 : myEdition,
          status: status === '' ? alert('pick a status') : status,
          currency: buyPrice > 0 ? currency : '',
          buyPrice: buyPrice,
        },
      });
      // props.clearBook(bookId);
    } else {
      document.body.classList.add('blur');
      setPopUpFlag(1);
    }

    if (error) console.log(error);
  };

  if (loading || loadingP) return 'Loading authors...';
  if (err) return err;
  if (errP) return errP;
  // console.log(authors);
  const form = () => {
    return (
      <form id='form_addBook' className='form_addBook'>
        <div className='form_element'>
          <label htmlFor='title'>Title: </label>
          <input
            id='title'
            autoComplete='off'
            type='text'
            value={title}
            required
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='language'>Language: </label>
          <input
            id='language'
            autoComplete='off'
            type='text'
            value={language}
            onChange={e => {
              setLanguage(e.target.value);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='genre'>Genre: </label>
          <input
            id='genre'
            autoComplete='off'
            type='text'
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
            autoComplete='off'
            onChange={e => {
              handleNumberFields(e);
            }}
          />
        </div>

        <div className='form_element'>
          <label htmlFor='author'>Author: </label>
          <input
            id='author'
            autoComplete='off'
            value={authorName}
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
            autoComplete='off'
            value={publisherName}
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
          <label htmlFor='readSelect'>Read or not?</label>
          <select
            id='readSelect'
            name='readSelect'
            onChange={e => handleReadSelect(e)}
          >
            <option value=''>-choose-</option>
            <option value='read'>Read</option>
            <option value='unread'>Unread</option>
            <option value='wanted'>Wanted</option>
          </select>
        </div>
        <div className='form_element'>
          <label htmlFor='rating'>Rating:</label>
          <input
            type='range'
            id='rating'
            min='0'
            max='10'
            step='1'
            disabled={true}
            onChange={e => handleNumberFields(e)}
          />
          <p id='ratingId'>{rating}</p>
        </div>

        <div className='form_element'>
          <label htmlFor='cover'>Cover type: </label>
          <select
            id='cover'
            name='cover'
            value={cover}
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
            value={isbn}
            onChange={e => {
              setIsbn(e.target.value);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='firstEdition'>First edition: </label>
          <input
            id='firstEdition'
            autoComplete='off'
            type='text'
            onChange={e => {
              handleNumberFields(e);
            }}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='myEdition'>My edition:</label>
          <input
            id='myEdition'
            autoComplete='off'
            type='text'
            onChange={e => {
              handleNumberFields(e);
            }}
          />
        </div>

        <div className='form_element'>
          <legend>Currency:</legend>
          <input
            type='radio'
            name='currency'
            id='usd'
            onClick={e => {
              setCurrency(e.target.id);
            }}
          />
          <label htmlFor='usd'>USD</label>
          <input
            type='radio'
            name='currency'
            id='pln'
            onClick={e => {
              setCurrency(e.target.id);
            }}
          />
          <label htmlFor='pln'>PLN</label>
          <input
            form='form_addBook'
            type='radio'
            name='currency'
            id='eur'
            onClick={e => {
              setCurrency(e.target.id);
            }}
          />
          <label htmlFor='eur'>EUR</label>
        </div>
        <div className='formElement'>
          <label htmlFor='value'>Price: </label>
          <input
            form='form_addBook'
            autoComplete='off'
            type='text'
            id='value'
            onChange={e => handleNumberFields(e)}
          />
        </div>
        <div className='form_element'>
          <button onClick={createBook}>Add book!</button>
        </div>
      </form>
    );
  };
  const uploadedBook = () => {
    setTimeout(() => {
      setVisible(true);
    }, 3000);
    return (
      <div className='mutation_announcement'>
        <h3>{addedBook} successfully added!</h3>
      </div>
    );
  };

  return (
    <>
      {popUpFlag === 1 ? (
        <PopUp
          closePopUp={popUpClose}
          authorName={authorName}
          publisherName={publisherName}
        />
      ) : null}
      {visible === true ? form() : uploadedBook()}
    </>
  );
}

export default AddBook;
