import React, { useState } from 'react';
import Axios from 'axios';
import AddBook from './AddBook';
import hostPath from '../global_variables';

export default function UploadBook() {
  const [selectedFile, setSelectedFile] = useState();
  const [parsedBooks, setParsedBooks] = useState();

  const getCover = path => {
    return `${path}.jpg`;
  };

  const onFileChange = e => {
    setSelectedFile(e.target.files);
  };
  // const clearBook = id => {
  //   const tempArr = [...parsedBooks];
  //   tempArr.splice(id, 1);
  //   setParsedBooks(tempArr);
  // };
  const handleFileUpload = e => {
    e.preventDefault();
    setParsedBooks(undefined);
    setSelectedFile(undefined);

    try {
      const data = new FormData();

      for (let i = 0; i < selectedFile.length; i++) {
        console.log(`wysyłam ${selectedFile[i]}`);

        data.append('files', selectedFile[i], selectedFile[i].name);
      }

      Axios.post(`${hostPath}post/uploads`, data)
        .then(response => {
          console.log(response.data);

          setParsedBooks(response.data.parsedData);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.error('Error while uploading', error);
    }
  };

  const form = () => {
    return (
      <div className='upload_form'>
        <form action='/uploads' encType='multipart/form-data' method='POST'>
          <input type='file' multiple onChange={onFileChange} />
          {selectedFile ? (
            <button onClick={handleFileUpload}>Upload!</button>
          ) : null}
        </form>
      </div>
    );
  };
  const fileData = () => {
    // console.log(selectedFile);

    if (selectedFile) {
      if (selectedFile.length > 5) {
        const fileArray = Array.from(selectedFile).slice(0, 5);
        setSelectedFile(fileArray);
        return (
          <div className='selectedFileData'>
            {fileArray.map((file, id) => (
              <div className='selectedFileData__single' key={id}>
                <p>File name: {file.name}</p>
                <p>Size: {(file.size / 1024 / 1024).toFixed(2)}MB</p>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className='selectedFileData'>
            {Array.from(selectedFile).map((file, id) => (
              <div className='selectedFileData__single' key={id}>
                <p>File name: {file.name}</p>
                <p>Size: {(file.size / 1024 / 1024).toFixed(2)}MB</p>
              </div>
            ))}
          </div>
        );
      }
    }
  };
  const addParsedBoooks = () => {
    if (parsedBooks) {
      if (parsedBooks.length === 1) {
        return (
          <div className='parsedBook'>
            <div className='parsedBook__image'>
              <img src={`${parsedBooks.coverURL}.jpg`} alt='book cover' />
            </div>
            <AddBook
              pendingBookData={parsedBooks[0]}
              ebook={true}
              // clearBook={clearBook(0)}
              bookId={0}
            />
          </div>
        );
      } else {
        return parsedBooks.map((pendingBook, id) => (
          <div className='parsedBook' key={id}>
            <div className='parsedBook__image'>
              <img src={getCover(pendingBook.coverURL)} alt='book cover' />
            </div>
            <AddBook
              pendingBookData={pendingBook}
              ebook={true}
              // clearBook={clearBook}
              bookId={id}
            />
          </div>
        ));
      }
    }
  };
  return (
    <>
      <h3 className='limitWarning'>
        Files amount limited to 5! If you choose more than that, first 5 files
        will be chosen for upload!
      </h3>
      <div className='upload'>
        {form()}
        {fileData()}
        {addParsedBoooks()}
      </div>
    </>
  );
}
