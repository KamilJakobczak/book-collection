const checkImageFolder = require('./modules/checkImageFolder');
const handleEpub = require('./modules/handleEpub');
const path = require('path');
const { nanoid } = require('nanoid');
const { resolve } = require('bluebird');
const imagesFolder = path.join(__dirname, 'uploaded_books', 'images');
const bookFolder = path.join(__dirname, 'uploaded_books');
const dataFolder = path.join(__dirname, 'uploaded_books', 'data');

module.exports = async function parsingLogic(uploadedFiles, ids) {
  return new Promise(function (resolve, reject) {
    const imagesFolderExists = checkImageFolder(imagesFolder);
    const dataId = nanoid(5);

    if (!imagesFolderExists) {
      console.error("Important folders missing, can't process the files");
      return;
    }

    handleEpub(
      uploadedFiles,
      ids,
      imagesFolder,
      bookFolder,
      dataFolder,
      dataId
    ).then(res => {
      // console.log(res);
      resolve(res);
    });
  });
};
