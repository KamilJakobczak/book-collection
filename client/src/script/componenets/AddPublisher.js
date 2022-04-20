import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { LOAD_PUBLISHERS } from '../GraphQL/Queries';
import { ADD_PUBLISHER } from '../GraphQL/Mutations';

function AddPublisher(props) {
  const [name, setName] = useState(props.publisherName);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');

  const [publishers, setPublishers] = useState('');

  const { error, loading, data } = useQuery(LOAD_PUBLISHERS);
  useEffect(() => {
    if (data) {
      setPublishers(data.publishers);
    }
  }, [data]);

  const [addPublisher, { err }] = useMutation(ADD_PUBLISHER, {
    onCompleted(data) {
      setName('');
      setAddress('');
      setCity('');
      setWebsite('');
    },
  });

  const handleName = e => {
    setName(e.target.value);
    const isPublisher = publishers.findIndex(
      publisher => publisher.name.toLowerCase() === e.target.value.toLowerCase()
    );
    isPublisher < 0
      ? e.target.classList.remove('invalid')
      : e.target.classList.add('invalid');
  };

  const handleSubmit = e => {
    e.preventDefault();
    const isPublisher = publishers.findIndex(
      publisher => publisher.name.toLowerCase() === name.toLowerCase()
    );
    if (name !== '') {
      if (isPublisher < 0) {
        addPublisher({
          variables: {
            name: name,
            address: address,
            city: city,
            website: website,
          },
        });
      } else alert('This author already exists');
    }
  };

  return (
    <form className='addPublisher'>
      <div className='form_element'>
        <label htmlFor='name'>Name: </label>
        <input id='name' type='text' required onChange={e => handleName(e)} />
      </div>
      <div className='form_element'>
        <label htmlFor='address'>Address: </label>
        <input
          id='address'
          type='text'
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <div className='form_element'>
        <label htmlFor='city'>City: </label>
        <input id='city' type='text' onChange={e => setCity(e.target.value)} />
      </div>
      <div className='form_element'>
        <label htmlFor='website'>Website: </label>
        <input
          id='website'
          type='text'
          onChange={e => setWebsite(e.target.value)}
        />
      </div>
      <button onClick={e => handleSubmit(e)}>Add publisher!</button>
    </form>
  );
}
export default AddPublisher;
