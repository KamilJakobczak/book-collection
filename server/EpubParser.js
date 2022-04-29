const checkImageFolder = require('./modules/checkImageFolder');
const handleEpub = require('./modules/handleEpub');
const path = require('path');
const imagesFolder = path.join(__dirname, 'uploaded_books', 'images');
const bookFolder = path.join(__dirname, 'uploaded_books');

module.exports = async function parsingLogic(uploadedFiles, ids) {
  const imagesFolderExists = await checkImageFolder(imagesFolder);

  if (!imagesFolderExists) {
    console.error("Important folders missing, can't process the files");
    return;
  }
  let returnData = await handleEpub(
    uploadedFiles,
    ids,
    imagesFolder,
    bookFolder
  );
};
