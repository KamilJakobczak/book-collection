import React from 'react';
import AddAuthor from './AddAuthor';
import AddPublisher from './AddPublisher.js';

function PopUp() {
  return (
    <div className='popUp'>
      <div className='popUp_forms'>
        <AddAuthor />
        <AddPublisher />
      </div>
      <button className='popUp_closeButton'>X</button>
    </div>
  );
}
export default PopUp;
