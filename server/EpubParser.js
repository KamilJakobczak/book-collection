const EPub = require('epub');
// const bookFolder = './uploadedBooks';
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));
// const fs = require('fs'),
//   bookList = [...fs.readdirSync(bookFolder)];
const dataFile = fs.readFileSync('./uploaded_books/data/data.json');
const path = require('path');
let dataRead = JSON.parse(dataFile);
const parsed_data = fs.readFileSync('./uploaded_books/data/parsed_data.json');
let returnFile = JSON.parse(parsed_data);

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

module.exports = async function (uploadedFiles, ids) {
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

      const localId = ids[0];
      const title = data.title;
      const author = data.creator;
      const publisher = data.publisher;
      const language = data.language;
      const genre = data.subject;
      const ISBN = data.ISBN;
      const distributor = data.distributor;

      const bookData = {
        localId: localId,
        title: title,
        author: author,
        publisher: publisher,
        language: language,
        genre: genre,
        ISBN: ISBN !== undefined ? ISBN : null,
        distributor: distributor !== undefined ? distributor : null,
      };
      // console.log(bookData);
      dataRead.push(bookData);

      const newData = JSON.stringify(dataRead);

      try {
        fs.writeFile('./uploaded_books/data/parsed_data.json', newData, err => {
          if (err) throw err;

          console.log('new data added');
        });
      } catch (err) {
        console.error('Error writing epub metadata to file', err);
      }

      if (epub.metadata.cover === undefined)
        console.log(`${epub.metadata.title} has no cover`);
      else {
        epub.getImage(
          `${epub.metadata.cover}`,
          function (error, img, mimeType) {
            fs.writeFile(
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
    let i = 0;
    uploadedFiles.forEach(book => {
      const id = ids[i];
      const epub = new EPub(
        `./uploaded_books/${book}`,
        `${imagesFolder}`,
        './uploaded_books/articles/'
      );

      epub.on('end', async function () {
        const data = epub.metadata;

        const title = data.title;
        const author = data.creator;
        const publisher = data.publisher;
        const language = data.language;
        const genre = data.subject;
        const ISBN = data.ISBN;
        const distributor = data.distributor;

        const bookData = {
          localId: id,
          title: title,
          author: author,
          publisher: publisher,
          language: language,
          genre: genre,
          ISBN: ISBN !== undefined ? ISBN : null,
          distributor: distributor !== undefined ? distributor : null,
        };

        dataRead.push(bookData);

        const newData = JSON.stringify(dataRead);

        try {
          fs.writeFile(`${dataFolder}/parsed_data.json`, newData, err => {
            if (err) throw err;
            console.log('new data added');
          });
        } catch (err) {
          console.error('Error writing epub metadata to file', err);
        }

        if (epub.metadata.cover === undefined)
          console.log(`${epub.metadata.title} has no cover`);
        else {
          epub.getImage(
            `${epub.metadata.cover}`,
            function (error, img, mimeType) {
              fs.writeFile(
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
      i++;
      epub.parse();
    });
  }

  return returnFile;
};
