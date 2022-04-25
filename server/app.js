const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const fs = require('fs-extra');
const formidable = require('formidable');
const util = require('util');
const path = require('path');

const schema = require('./schema/schema');
const { concat } = require('lodash');
const port = 4000;

const app = express();

// const v1 = express.Router();
// app.use('/api/v1', v1);

app.use(cors());
app.listen(port, () => {
  console.log('now listening for requests on port 4000');
});
app.post('/uploads', (req, res) => {
  console.log('dotarło');
  const form = new formidable.IncomingForm();
  const uploadFolder = path.join(__dirname, 'uploadedBooks');

  //Basic Configuration
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; //5mb
  form.uploadDir = uploadFolder;
  console.log(form);

  form.parse(req, async (err, fields, files) => {
    // console.log(files);
    if (err) {
      console.log('Error parsing the files');
      return res.status(400).json({
        status: 'Fail',
        message: 'there was an error parsing the files',
        error: err,
      });
    }
    if (!files.myFile.length) {
      //single file
      const file = files.myFile;
      const isFileValid = file => {
        const type = file.mimetype.split('/').pop();

        const validTypes = ['.epub'];
        if (validTypes.indexOf(type) === -1) {
          return false;
        }
        return true;
      };
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
        fs.renameSync(file.filepath, `${uploadFolder}\\${fileName}`);
      } catch (error) {
        console.log(error);
      }
      try {
        const newFile = await File.create({
          name: `uploadedBooks/${fileName}`,
        });
        return res.status(200).json({
          status: 'success',
          message: 'File created successfully!!',
        });
      } catch (error) {
        res.json({
          error,
        });
      }
    } else {
      // CODE FOR MULTIPLE FILES
    }
  });

  //   // file_name = files.data.newFilename;
  // });

  // console.log(temp_path, file_name);
  // form.on('end', function (fields, files) {
  //   const new_location =
  //     'H:/ZZ Programowanie/PROJEKTY/GraphQL/book-collection/server/uploadedBooks';
  //   console.log(temp_path, file_name);

  //   fs.copy(temp_path, new_location + file_name, function (err) {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       console.log('success!');
  //     }
  //   });
  // });
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
