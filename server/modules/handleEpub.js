const bluebird = require('bluebird');
const checkLanguage = require('./checkLanguage');
const fs = bluebird.promisifyAll(require('fs-extra'));
const EPub = require('epub');

module.exports = async function (uploadedFiles, ids, imagesFolder, bookFolder) {
  let returnData = [];
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

      const author = data.creator;
      const description = data.description;
      const distributor = data.distributor;
      const genre = data.subject;
      const ISBN = data.ISBN;
      const language = await checkLanguage(data.language);
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
      returnData.push(bookData);

      if (epub.metadata.cover === undefined) {
        console.log(`${epub.metadata.title} has no cover`);
      } else {
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
      if (i === uploadedFiles.length - 1) {
        console.log(returnData);
      }
      // console.log(returnData);
    });

    epub.parse();
  }
};
