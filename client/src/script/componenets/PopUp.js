import React from 'react';
import AddAuthor from './AddAuthor';
import AddPublisher from './AddPublisher.js';

function PopUp(props) {
  return (
    <div className='popUp'>
      <div className='popUp_forms'>
        {props.authorName !== '' ? (
          <AddAuthor authorName={props.authorName} />
        ) : null}
        {props.publisherName !== '' ? (
          <AddPublisher publisherName={props.publisherName} />
        ) : null}
      </div>
      <button
        className='popUp_closeButton'
        onClick={() => {
          props.closePopUp();
        }}
      >
        X
      </button>
    </div>
  );
}
export default PopUp;
