import React, { useState } from 'react';
import Axios from 'axios';
import AddBook from './AddBook';

export default function UploadBook() {
  const [selectedFile, setSelectedFile] = useState();
  const [parsedBooks, setParsedBooks] = useState();

  const onFileChange = e => {
    setSelectedFile(e.target.files);
  };
  const clearBook = id => {
    const tempArr = [...parsedBooks];
    tempArr.splice(id, 1);
    setParsedBooks(tempArr);
  };
  const handleFileUpload = e => {
    e.preventDefault();
    try {
      if (selectedFile.length === 1) {
        console.log('wysyłam 1');
        const data = new FormData();

        data.append('files', selectedFile[0], selectedFile[0].name);

        Axios.post('http://localhost:4000/uploads', data)
          .then(response => console.log(response.data))
          .catch(error => console.error(error));
      } else {
        console.log(`wysyłam ${selectedFile.length} pliki`);
        const data = new FormData();

        for (let i = 0; i < selectedFile.length; i++) {
          data.append('files', selectedFile[i], selectedFile[i].name);
        }
        Axios.post('http://localhost:4000/uploads', data)
          .then(response => {
            console.log(response.data);
            setParsedBooks(response.data.parsedData);

            // setTimeout(() => {
            //   const config = {
            //     method: 'get',
            //     url: 'http://localhost:4000/uploads/meta',
            //     params: { getData: response.data.parsedData },
            //   };
            //   Axios(config).then(res => {
            //     console.log(res);
            //     setParsedBooks(res.data.data);
            //   });
            // }, 500);
          })
          .catch(error => console.error(error));
      }
    } catch (error) {
      console.error('Error while uploading', error);
    }
  };

  const form = () => {
    return (
      <div className='upload_form'>
        <form action='/uploads' encType='multipart/form-data' method='POST'>
          <input type='file' multiple onChange={onFileChange} />
          <button onClick={handleFileUpload}>Upload!</button>
        </form>
      </div>
    );
  };
  const fileData = () => {
    // console.log(selectedFile);

    if (selectedFile) {
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
  };
  const addParsedBoooks = () => {
    if (parsedBooks) {
      return parsedBooks.map((pendingBook, id) => (
        <div className='parsedBook' key={id}>
          <div className='parsedBook__image'>
            <img src={pendingBook.coverURL} alt='book cover' />
          </div>
          <AddBook
            pendingBookData={pendingBook}
            ebook={true}
            clearBook={clearBook}
            bookId={id}
          />
        </div>
      ));
    }
  };
  return (
    <div className='upload'>
      {form()}
      {fileData()}
      {addParsedBoooks()}
    </div>
  );
}
