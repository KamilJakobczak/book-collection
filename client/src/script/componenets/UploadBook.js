import React, { useState } from 'react';
import Axios from 'axios';

export default function UploadBook() {
  const [selectedFile, setSelectedFile] = useState();

  const onFileChange = e => {
    setSelectedFile(e.target.files);
    console.log(e.target.files);
  };

  // axios({
  //   url: 'http://localhost:4000/api',
  //   method: 'POST',
  // }).then(response => {
  //   console.log(response);
  // console.log(selectedFile);
  const handleFileUpload = e => {
    e.preventDefault();
    try {
      if (selectedFile.length === 1) {
        console.log('wysyłam 1');
        const data = new FormData();

        data.append('files', selectedFile[0], selectedFile[0].name);

        Axios.post('http://localhost:4000/uploads', data).then(data => {
          console.log(data);
          // console.log(result);
        });
      } else {
        console.log(`wysyłam ${selectedFile.length} pliki`);
        const data = new FormData();

        for (let i = 0; i < selectedFile.length; i++) {
          data.append('files', selectedFile[i], selectedFile[i].name);
        }
        // for (let value of data.values()) {
        //   console.log(value);
        // }
        Axios.post('http://localhost:4000/uploads', data).then(data => {
          console.log(data.data.files);
          // console.log(result);
        });
      }
    } catch (error) {
      console.error('Error while uploading', error);
    }
  };

  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          {/* <p>Last Modified: {selectedFile.lastModified}</p> */}
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <form action='/uploads' encType='multipart/form-data' method='POST'>
          <input type='file' multiple onChange={onFileChange} />
          <button onClick={handleFileUpload}>Upload!</button>
        </form>
      </div>
      {fileData()}
    </div>
  );
}
