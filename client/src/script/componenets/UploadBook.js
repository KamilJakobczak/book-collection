import React, { useState } from 'react';
import Axios from 'axios';

export default function UploadBook() {
  const [selectedFile, setSelectedFile] = useState();

  const onFileChange = e => {
    setSelectedFile(e.target.files[0]);
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
      const data = new FormData();
      data.append('myFile', selectedFile, selectedFile.name);

      Axios.post('http://localhost:4000/uploads', data).then(
        (request, result) => {
          console.log(request);
          console.log(result);
        }
      );
    } catch (error) {
      console.error('Error while uploading');
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
          <input type='file' onChange={onFileChange} />
          <button onClick={handleFileUpload}>Upload!</button>
        </form>
      </div>
      {fileData()}
    </div>
  );
}
