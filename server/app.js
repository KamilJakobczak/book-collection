const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
// const axios = require('axios');

const { IncomingForm } = require('formidable');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));

// const util = require('util');
const path = require('path');
// const epubParser = require('./epub_parser/epub_parser');

const schema = require('./schema/schema');
const epubParser = require('./EpubParser');
// const { concat } = require('lodash');
const port = 4000;

const app = express();

// const v1 = express.Router();
// app.use('/api/v1', v1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log('now listening for requests on port 4000');
});

//returns true or false:
async function checkUploadFolder(uploadFolder) {
  try {
    fs.statAsync(uploadFolder);
  } catch (err) {
    if (err && err.code == 'ENOENT') {
      try {
        fs.mkdirAsync(uploadFolder);
      } catch (err) {
        console.error('Error creating the uploads folder');
        return false;
      }
    } else {
      console.error('Error reading the uploads folder');
      return false;
    }
  }
  return true;
}
//Checking if files are of valid extension
const isFileValid = file => {
  const type = file.originalFilename.endsWith('.epub');

  if (!type) {
    console.error('The file type is invalid');
    return false;
  }
  return true;
};

app.post('/uploads', async (req, res) => {
  console.log('dotarło');

  const uploadFolder = path.join(__dirname, 'uploadedBooks');
  // new formidable instance to process incoming files:
  const form = new IncomingForm({
    multiples: true,
    maxFileSize: 500 * 1024 * 1024, //50mb
    uploadDir: uploadFolder,
  });
  const folderExists = await checkUploadFolder(uploadFolder);
  if (!folderExists) {
    return res.json({
      ok: false,
      msg: 'There was an error creating the uploads folder',
    });
  }

  form.parse(req, async (err, fields, files) => {
    let myUploadedFiles = [];

    if (err) {
      console.log('Error parsing the files');
      return res.status(400).json({
        status: 'Fail',
        message: 'There was an error parsing the files',
      });
    }
    // res.writeHead(200, { 'Content-Type': 'application/json' });

    if (!files.files.length) {
      //single file
      const file = files.files;

      const isValid = isFileValid(file);

      const fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, '-')
      );

      if (!isValid) {
        return res.status(400).json({
          status: 'fail',
          message: 'The file type is not a valid type',
        });
      }
      try {
        fs.renameAsync(file.filepath, `${uploadFolder}//${fileName}`);
      } catch (error) {
        console.log('The file upload failed, trying to remove the temp file');
        try {
          await fs.unlinkAsync(file.path);
        } catch (e) {}
        return res.json({
          status: 'fail',
          message: "The file couldn't be uploaded",
        });
      }
      myUploadedFiles.push(fileName);
    } else {
      // CODE FOR MULTIPLE FILES

      for (let i = 0; i < files.files.length; i++) {
        const file = files.files[i];

        const isValid = isFileValid(file);

        const fileName = encodeURIComponent(
          file.originalFilename.replace(/\s/g, '-')
        );

        if (!isValid) {
          return res.status(400).json({
            status: 'fail',
            message: 'The file type is not a valid type',
          });
        }
        try {
          fs.renameAsync(file.filepath, `${uploadFolder}//${fileName}`);
          // const newFile = await File.create({
          //   name: `uploadedBooks/${fileName}`,
          // });
        } catch (error) {
          console.log(error);
        }
        myUploadedFiles.push(fileName);
      }
      // try {
      //   return res.status(200).json({
      //     status: 'success',
      //     message: 'File created successfully!!',
      //   });
      // } catch (error) {
      //   res.json({
      //     error,
      //   });
      // }
    }
    epubParser(myUploadedFiles);
    return res.status(200).json({
      status: 'success',
      message: 'The files have been uploaded successfully',
      files: myUploadedFiles,
    });
  });
});

mongoose.connect(
  'mongodb+srv://admin:JxVmS7mp0k2orcePvwbZ@cluster0.qwqgz.mongodb.net/Cluster0?retryWrites=true&w=majority'
);

mongoose.connection.once('open', () => {
  console.log('database connected');
});

// v1.get('http://localhost:4000/api', (req, res) => {
//   res.status(200).send('Successful');
//   console.log(res);
// });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// axios({
//   method: 'post',
//   url: '/api/file',
//   responseType: '',
// }).then(function (response) {
//   console.log(response);
// });
