import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AddBook from './AddBook';
import UploadBook from './UploadBook';

export default function NewBook() {
  // const handleButton = e => {
  //   e.preventDefault();
  //   switch (e.target.className) {
  //     case 'manualAddButton':
  //       break;
  //     case 'uploadButton':
  //       break;
  //     default:
  //       break;
  //   }
  // };
  return (
    <div>
      <button className='manualAddButton'>
        <Link to='/newbook/manual'>Manual add</Link>
      </button>
      <button className='uploadButton'>
        <Link to='/newbook/upload'>Upload</Link>
      </button>
    </div>
  );
}
