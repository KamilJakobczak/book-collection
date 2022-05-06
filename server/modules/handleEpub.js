const bluebird = require('bluebird');
const checkLanguage = require('./checkLanguage');
const fs = bluebird.promisifyAll(require('fs-extra'));
const EPub = require('epub');

const logger = require('../global_variables');

// const path = require('path');

// const dataFile = fs.readFileSync(path.join(__dirname, 'data.json'));
// let dataRead = JSON.parse(dataFile);

async function imageExtraction(
  cover,
  title,
  epub,
  imagesFolder,
  id,
  lastImage
) {
  return new Promise(function (resolve, reject) {
    if (cover === undefined) {
      console.log(`${title} has no cover`);
    } else {
      epub.getImage(`${cover}`, async function (error, img, mimeType) {
        fs.writeFileAsync(
          `${imagesFolder}/${id}.jpg`,
          img,
          async function (err, written) {
            if (err) {
              console.log(err);
              reject(false);
            } else {
              console.log('Successfully written');

              if (lastImage) {
                resolve(true);
              }
            }
          }
        );
      });
    }
  });
}
module.exports = async function (
  uploadedFiles,
  ids,
  imagesFolder,
  bookFolder,
  dataFolder,
  dataId
) {
  return new Promise(function (resolve, reject) {
    let parsedBooks = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const book = uploadedFiles[i];

      const id = ids[i];
      const epub = new EPub(
        `${bookFolder}/${book}`,
        `${imagesFolder}`,
        '../uploaded_books/articles/'
      );

      epub.on('end', async function () {
        const data = epub.metadata;
        const cover = epub.metadata.cover;
        const author = data.creator;
        const description = data.description;
        const distributor = data.distributor;
        const genre = data.subject;
        const ISBN = data.ISBN;
        const language = await checkLanguage(data.language);

        const publisher = data.publisher;
        const title = data.title;

        const bookData = {
          author: author,
          description: description,
          distributor: distributor !== undefined ? distributor : null,
          genre: genre,
          ISBN: ISBN !== undefined ? ISBN : null,
          language: language,
          localId: id,
          coverURL: `${host}get/image/${id}`,
          publisher: publisher,
          title: title,
        };
        parsedBooks.push(bookData);
        const lastImage = i === uploadedFiles.length - 1 ? true : false;
        const image = await imageExtraction(
          cover,
          title,
          epub,
          imagesFolder,
          id,
          lastImage
        );

        if (i === uploadedFiles.length - 1 && image) {
          resolve(parsedBooks);
        }
      });

      epub.parse();
    }
  });
};
