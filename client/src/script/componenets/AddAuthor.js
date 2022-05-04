import { useQuery, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { ADD_AUTHOR } from '../GraphQL/Mutations';
import { LOAD_AUTHORS } from '../GraphQL/Queries';

function AddAuthor(props) {
  const [name, setName] = useState(props.authorName);
  const [nationality, setNationality] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [authors, setAuthors] = useState('');
  const [addedAuthor, setAddedAuthor] = useState('');

  const [visible, setVisible] = useState(true);

  const { error, loading, data, refetch } = useQuery(LOAD_AUTHORS);
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
      refetch();
      setAddedAuthor(data.addAuthor.name);
      setVisible(false);
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

    addAuthor({
      variables: {
        name: isAuthor > 0 ? alert('This author already exists!') : name,
        nationality: nationality,
        birthDate: isNaN(birthDate) ? alert('') : birthDate,
      },
    });
  };

  const form = () => {
    return (
      <form className='addAuthor'>
        <div className='form_element'>
          <label htmlFor='name'>Name: </label>
          <input
            id='name'
            type='text'
            autoComplete='off'
            value={name}
            required
            onChange={e => handleAuthor(e)}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='nationality'>Nationality: </label>
          <input
            id='nationality'
            type='text'
            autoComplete='off'
            value={nationality}
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
            autoComplete='off'
            value={birthDate}
            minLength='1'
            maxLength='5'
            onChange={e => handleBirthDate(e)}
          />
        </div>
        <button onClick={handleSubmit}>Add author!</button>
      </form>
    );
  };

  const uploadedAuthor = () => {
    setTimeout(() => {
      setVisible(true);
    }, 3000);
    return (
      <div className='mutation_announcement'>
        <h3>{addedAuthor} successfully added!</h3>
      </div>
    );
  };

  return visible === true ? form() : uploadedAuthor();
}
export default AddAuthor;
