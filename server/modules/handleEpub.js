const bluebird = require('bluebird');
const checkLanguage = require('./checkLanguage');
const fs = bluebird.promisifyAll(require('fs-extra'));
const EPub = require('epub');
const sharp = require('sharp');

// const path = require('path');

// const dataFile = fs.readFileSync(path.join(__dirname, 'data.json'));
// let dataRead = JSON.parse(dataFile);

async function resizer(file) {
  return new Promise(function (resolve, reject) {
    const resize = size =>
      sharp(`${file}.jpg`)
        .resize({ width: size })
        .toFile(`${file}-${size}.jpg`);

    Promise.all([1000, 600, 300].map(resize)).then(() => {
      console.log('complete');
      resolve('success');
    });
    //   sharp(file)
    //     .resize({ width: 300 })
    //     .toFile(`${file}-small.jpg`)
    //     .then(function (newFileInfo) {
    //       console.log('successful resizing');
    //       resolve('success');
    //     })
    //     .catch(function (err) {
    //       console.log('error occured');
    //     });
    // });
  });
}

async function imageExtraction(cover, title, epub, imagesFolder, id) {
  if (cover === undefined) {
    console.log(`${title} has no cover`);
  } else {
    return new Promise(function (resolve, reject) {
      epub.getImage(`${cover}`, async function (error, img, mimeType) {
        fs.writeFileAsync(
          `${imagesFolder}/${id}.jpg`,
          img,
          function (err, written) {
            if (err) console.log(err);
            else {
              console.log('Successfully written');
              resolve(`${imagesFolder}/${id}`);
            }
          }
        );
      });
    });
  }
}
module.exports = function async(
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
          coverURL: `http://localhost:4000/get/image/${id}-300.jpg`,
          publisher: publisher,
          title: title,
        };
        parsedBooks.push(bookData);

        const image = await imageExtraction(
          cover,
          title,
          epub,
          imagesFolder,
          id
        );
        const resize = await resizer(image);

        if (i === uploadedFiles.length - 1) {
          resolve(parsedBooks);
        }
      });

      epub.parse();
    }
  });
};
