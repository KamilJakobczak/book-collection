const EPub = require('epub');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));

//   bookList = [...fs.readdirSync(bookFolder)];
// const dataFile = fs.readFileSync('./uploaded_books/data/data.json');
const path = require('path');
const { nanoid } = require('nanoid');
const { Promise, resolve, reject } = require('bluebird');
const { first } = require('lodash');

//Legend:
//epub.metadata.cover - cover image attribute to use in getImage
//epub.metadata.creator - author

async function checkFolders(folder, name) {
  try {
    fs.statAsync(folder);
  } catch (err) {
    if (err && err.code == 'ENOENT') {
      try {
        fs.mkdirAsync(folder);
      } catch (err) {
        console.error(`Error creating the ${name} folder!`);
        return false;
      }
    } else {
      console.error(`Error reading the ${name} folder!`);
      return false;
    }
  }
  return true;
}
async function languageCheck(lang) {
  switch (lang) {
    case 'pl-pl':
      return 'Polish';
    case 'pl':
      return 'Polish';
    case 'en-gb':
      return 'English';
    case 'en':
      return 'English';
    case 'en-us':
      return 'English';

    default:
      return '';
  }
}

module.exports = async function parsingLogic(uploadedFiles, ids) {
  const imagesFolder = path.join(__dirname, 'uploaded_books', 'images');
  const dataFolder = path.join(__dirname, 'uploaded_books', 'data');
  const imagesFolderExists = await checkFolders(imagesFolder, 'images');
  const dataFolderExists = await checkFolders(dataFolder, 'data');

  if (!imagesFolderExists || !dataFolderExists) {
    console.error(
      "Can't process the files because one of important folders doesn't exist"
    );
  }
  if (uploadedFiles.length === 1) {
    const epub = new EPub(
      `./uploaded_books/${uploadedFiles[0]}`,
      './uploadedBooks/images/',
      './uploadedBooks/articles/'
    );

    epub.on('end', async function () {
      // console.log(epub.metadata);
      const data = epub.metadata;

      const author = data.creator;
      const description = data.description;
      const distributor = data.distributor;
      const genre = data.subject;
      const ISBN = data.ISBN;
      const language = await languageCheck(data.language);
      const localId = ids[0];
      const publisher = data.publisher;
      const title = data.title;

      const bookData = {
        author: author,
        description: description,
        distributor: distributor !== undefined ? distributor : null,
        genre: genre,
        ISBN: ISBN !== undefined ? ISBN : null,
        language: language,
        localId: localId,
        publisher: publisher,
        title: title,
      };

      if (epub.metadata.cover === undefined)
        console.log(`${epub.metadata.title} has no cover`);
      else {
        epub.getImage(
          `${epub.metadata.cover}`,
          function (error, img, mimeType) {
            fs.writeFileAsync(
              `${imagesFolder}/${localId}.jpg`,
              img,
              function (err, written) {
                if (err) console.log(err);
                else console.log('Successfully written');
              }
            );
          }
        );
      }
    });
    epub.parse();
  } else {
    for (let i = 0; i < uploadedFiles.length; i++) {
      const book = uploadedFiles[i];
      const id = ids[i];
      const epub = new EPub(
        `./uploaded_books/${book}`,
        `${imagesFolder}`,
        './uploaded_books/articles/'
      );
      epub.on('end', async function () {
        const data = epub.metadata;
        const author = data.creator;
        const description = data.description;
        const distributor = data.distributor;
        const genre = data.subject;
        const ISBN = data.ISBN;
        const language = await languageCheck(data.language);
        const localId = id;
        const publisher = data.publisher;
        const title = data.title;
        const bookData = {
          author: author,
          description: description,
          distributor: distributor !== undefined ? distributor : null,
          genre: genre,
          ISBN: ISBN !== undefined ? ISBN : null,
          language: language,
          localId: localId,
          publisher: publisher,
          title: title,
        };

        if (epub.metadata.cover === undefined)
          console.log(`${epub.metadata.title} has no cover`);
        else {
          epub.getImage(
            `${epub.metadata.cover}`,
            function (error, img, mimeType) {
              fs.writeFileAsync(
                `${imagesFolder}/${id}.jpg`,
                img,
                function (err, written) {
                  if (err) console.log(err);
                  else console.log('Successfully written');
                }
              );
            }
          );
        }
      });
      epub.parse();
    }
  }
};
