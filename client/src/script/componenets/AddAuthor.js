import { useQuery, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { ADD_AUTHOR } from '../GraphQL/Mutations';
import { LOAD_AUTHORS } from '../GraphQL/Queries';

function AddAuthor() {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [authors, setAuthors] = useState('');

  const { error, loading, data } = useQuery(LOAD_AUTHORS);
  useEffect(() => {
    if (data) {
      setAuthors(data.authors);
    }
  }, [data]);

  const [addAuthor, { err }] = useMutation(ADD_AUTHOR, {
    onCompleted(data) {
      setName('');
      setNationality('');
      setBirthDate('');
    },
  });

  const handleAuthor = e => {
    setName(e.target.value);

    const isAuthor = authors.findIndex(
      author => author.name.toLowerCase() === e.target.value.toLowerCase()
    );

    isAuthor < 0
      ? e.target.classList.remove('invalid')
      : e.target.classList.add('invalid');
  };

  const handleBirthDate = e => {
    const value = parseInt(e.target.value);

    isNaN(value)
      ? e.target.classList.add('invalid')
      : e.target.classList.remove('invalid');

    if (e.target.value === '') {
      e.target.classList.remove('invalid');
    }
    setBirthDate(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // name, nationality, birthDate

    const isAuthor = authors.findIndex(
      author => author.name.toLowerCase() === name.toLowerCase()
    );
    console.log(isAuthor);
    addAuthor({
      variables: {
        name: isAuthor > 0 ? alert('This author already exists!') : name,
        nationality: nationality,
        birthDate: isNaN(birthDate) ? alert('') : birthDate,
      },
    });
  };

  return (
    <form className='addAuthor'>
      <div className='form_element'>
        <label htmlFor='name'>Name: </label>
        <input id='name' type='text' required onChange={e => handleAuthor(e)} />
      </div>
      <div className='form_element'>
        <label htmlFor='nationality'>Nationality: </label>
        <input
          id='nationality'
          type='text'
          onChange={e => {
            setNationality(e.target.value);
          }}
        />
      </div>
      <div className='form_element'>
        <label htmlFor='birthDate'>Year of birth: </label>
        <input
          id='birthDate'
          type='text'
          minLength='1'
          maxLength='5'
          onChange={e => handleBirthDate(e)}
        />
      </div>
      <button onClick={handleSubmit}>Add author!</button>
    </form>
  );
}
export default AddAuthor;
