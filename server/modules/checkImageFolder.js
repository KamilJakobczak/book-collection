const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));
const path = require('path');
// const imagesFolder =
//   'H:/ZZ Programowanie/PROJEKTY/GraphQL/book-collection/server/uploaded_books/images';
module.exports = async function checkImageFolder(imagesFolder) {
  try {
    fs.statAsync(imagesFolder);
  } catch (err) {
    if (err && err.code == 'ENOENT') {
      try {
        fs.mkdirAsync(imagesFolder);
      } catch (err) {
        console.error(`Error creating the images folder!`);
        return false;
      }
    } else {
      console.error(`Error reading the images folder!`);
      return false;
    }
  }
  return true;
};
