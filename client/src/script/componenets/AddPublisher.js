import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { LOAD_PUBLISHERS } from '../GraphQL/Queries';
import { ADD_PUBLISHER } from '../GraphQL/Mutations';

function AddPublisher(props) {
  const [name, setName] = useState(props.publisherName);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [visible, setVisible] = useState(true);
  const [addedPublisher, setAddedPublisher] = useState('');

  const [publishers, setPublishers] = useState('');

  const { error, loading, data, refetch } = useQuery(LOAD_PUBLISHERS);
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
      refetch();
      setAddedPublisher(data.addPublisher.name);
      if (window.location.href !== 'http://localhost:3000/newpublisher') {
        setVisible(false);
      }
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

  const form = () => {
    return (
      <form className='addPublisher'>
        <div className='form_element'>
          <label htmlFor='name'>Name: </label>
          <input
            id='name'
            type='text'
            value={name}
            autoComplete='off'
            required
            onChange={e => handleName(e)}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='address'>Address: </label>
          <input
            id='address'
            type='text'
            autoComplete='off'
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='city'>City: </label>
          <input
            id='city'
            type='text'
            autoComplete='off'
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </div>
        <div className='form_element'>
          <label htmlFor='website'>Website: </label>
          <input
            id='website'
            type='text'
            autoComplete='off'
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
        </div>
        <button onClick={e => handleSubmit(e)}>Add publisher!</button>
      </form>
    );
  };
  const uploadedPublisher = () => {
    props.publisherRefetch();
    setTimeout(() => {
      setVisible(true);
    }, 3000);
    return (
      <div className='mutation_announcement'>
        <h3>{addedPublisher} successfully added!</h3>
      </div>
    );
  };

  return visible === true ? form() : uploadedPublisher();
}
export default AddPublisher;
