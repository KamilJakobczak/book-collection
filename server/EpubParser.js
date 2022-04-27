const EPub = require('epub');
// const bookFolder = './uploadedBooks';
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));
// const fs = require('fs'),
//   bookList = [...fs.readdirSync(bookFolder)];
const dataFile = fs.readFileSync('./data.json');
let dataRead = JSON.parse(dataFile);

//Legend:
//epub.metadata.cover - cover image attribute to use in getImage
//epub.metadata.creator - author

module.exports = function (uploadedFiles) {
  console.log(uploadedFiles);
  if (uploadedFiles.length === 1) {
    const epub = new EPub(
      `./uploadedBooks/${uploadedFiles[0]}`,
      './images/',
      '/articlewebroot/'
    );
    console.log(epub);

    epub.on('end', async function () {
      // console.log(epub.metadata);

      const data = epub.metadata;

      const title = data.title;
      const author = data.creator;
      const publisher = data.publisher;
      const language = data.language;
      const genre = data.subject;
      const ISBN = data.ISBN;
      const distributor = data.distributor;

      const bookData = {
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
        fs.writeFile('./data/parsed_data.json', newData, err => {
          if (err) throw err;

          console.log('new data added');
        });
      } catch (err) {
        console.error('Error writing epub metadata to file', err);
      }

      if (epub.metadata.cover === undefined)
        console.log(`${epub.metadata.title} nie ma okładki?`);
      else {
        // if (epub.metadata.cover.endsWith('.jpg')) {
        //   const newString = epub.metadata.cover.slice(
        //     0,
        //     epub.metadata.cover.length - 4
        //   );
        //   console.log(newString);
        //   epub.getImage(`${newString}`, function (error, img, mimeType) {
        //     console.log(img);
        //     fs.writeFile(
        //       `./images/${epub.metadata.creator}.jpg`,
        //       img,
        //       function (err, written) {
        //         if (err) console.log(err);
        //         else console.log('Successfully written');
        //       }
        //     );
        //     // console.log(mimeType);
        //   });
        // } else {
        epub.getImage(
          `${epub.metadata.cover}`,
          function (error, img, mimeType) {
            fs.writeFile(
              `./images/${epub.metadata.creator}.jpg`,
              img,
              function (err, written) {
                if (err) console.log(err);
                else console.log('Successfully written');
              }
            );
            // console.log(mimeType);
          }
        );
        // }
      }
    });
    epub.parse();
  } else {
    uploadedFiles.forEach(book => {
      const epub = new EPub(
        `./uploadedBooks/${book}`,
        './images/',
        '/articlewebroot/'
      );
      console.log(epub);

      epub.on('end', async function () {
        // console.log(epub.metadata);

        const data = epub.metadata;

        const title = data.title;
        const author = data.creator;
        const publisher = data.publisher;
        const language = data.language;
        const genre = data.subject;
        const ISBN = data.ISBN;
        const distributor = data.distributor;

        const bookData = {
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
          fs.writeFile('./data/parsed_data.json', newData, err => {
            if (err) throw err;

            console.log('new data added');
          });
        } catch (err) {
          console.error('Error writing epub metadata to file', err);
        }

        if (epub.metadata.cover === undefined)
          console.log(`${epub.metadata.title} nie ma okładki?`);
        else {
          // if (epub.metadata.cover.endsWith('.jpg')) {
          //   const newString = epub.metadata.cover.slice(
          //     0,
          //     epub.metadata.cover.length - 4
          //   );
          //   console.log(newString);
          //   epub.getImage(`${newString}`, function (error, img, mimeType) {
          //     console.log(img);
          //     fs.writeFile(
          //       `./images/${epub.metadata.creator}.jpg`,
          //       img,
          //       function (err, written) {
          //         if (err) console.log(err);
          //         else console.log('Successfully written');
          //       }
          //     );
          //     // console.log(mimeType);
          //   });
          // } else {
          epub.getImage(
            `${epub.metadata.cover}`,
            function (error, img, mimeType) {
              fs.writeFile(
                `./images/${epub.metadata.creator}.jpg`,
                img,
                function (err, written) {
                  if (err) console.log(err);
                  else console.log('Successfully written');
                }
              );
              // console.log(mimeType);
            }
          );
          // }
        }
      });
      epub.parse();
    });
  }
};
