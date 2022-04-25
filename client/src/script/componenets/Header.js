import { Link } from 'react-router-dom';
import React from 'react';

function Header() {
  return (
    <header className='App-header'>
      <h1>
        <Link to='/'>Jamar's Book Collection</Link>
      </h1>
      <nav>
        <ul>
          <li>
            <Link to='/collection'>Collection</Link>
          </li>
          <li>
            <Link to='/newbook'>New book</Link>
          </li>
          <li>
            <Link to='/newauthor'>New author</Link>
          </li>
          <li>
            <Link to='/newpublisher'>New publisher</Link>
          </li>
          <li>
            <Link to='/uploadbook'>Upload</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
