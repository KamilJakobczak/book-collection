//server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
// const { MongoClient } = require('mongodb');

//file system
const path = require('path');

const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));

//additional libraries

//modules
const handleUploads = require('./modules/handleUploads');
const schema = require('./schema/schema');

const logger = require('./global_variables');
const imgModel = require('./models/cover');
// const uploadCovers = require('./modules/uploadCovers');
//server configuration

const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log('now listening for requests on port 4000');
});

//additional configuration
imagesFolder = path.join(__dirname, 'uploaded_books', 'images');

const uploadFolder = path.join(__dirname, 'uploaded_books');

app.post('/post/uploads', async (req, res) => {
  console.log('files received');
  handleUploads(req, res, uploadFolder);
});
app.post('/post/images', async (req, res) => {
  sizes = ['', '-300', '-600', '-1000'];
  for (let i = 0; i < sizes.length; i++) {
    const bookId = req.body.bookId;
    const file = `${imagesFolder}/${req.body.localId}${sizes[i]}.jpg`;
    const destFolder = path.join(__dirname, 'images', `${bookId}`);
    fs.renameSync(file, `${destFolder}/cover${sizes[i]}`);

    const cover = {
      bookId: bookId,
      name: `cover${size[i]}`,
      imgPath: `/images/${bookId}/${bookId}${size[i]}.jpg`,
    };
    imgModel.create(cover, (error, item) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`successfully added ${title}${size} cover to the database`);
      }
    });
  }
});
app.get('/get/cover/:id', async (req, res) => {
  const name = req.params.id;
  const folder = path.join(__dirname, 'images', name);
  const filepath = `${folder}/cover-300.jpg`;

  res.sendFile(filepath);
});

app.get('/get/image/:id', async (req, res) => {
  const name = req.params.id;
  const filepath = path.join(imagesFolder, name);
  const fileExists = fs.existsSync(filepath);
  if (!fileExists) {
    setTimeout(() => {
      if (!fileExists) {
        res.set('Cache-control', `no-store`);
        res.sendFile(filepath);
      } else {
        console.log(
          'Something went wrong with preparing the cover for this one'
        );
      }
    }, 300);
  } else {
    res.set('Cache-control', `no-store`);
    res.sendFile(filepath);
  }
});

const uri = `mongodb+srv://admin:${mongoPassword}@cluster0.qwqgz.mongodb.net/Cluster0?retryWrites=true&w=majority`;
mongoose.connect(uri);

mongoose.connection.once('open', () => {
  console.log('database connected');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
