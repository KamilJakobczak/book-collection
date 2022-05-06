const epubParser = require('../EpubParser');
const { IncomingForm } = require('formidable');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs-extra'));

const { nanoid } = require('nanoid');

async function checkUploadFolder(uploadFolder) {
  try {
    fs.statAsync(uploadFolder);
  } catch (err) {
    if (err && err.code == 'ENOENT') {
      try {
        fs.mkdirAsync(uploadFolder);
      } catch (err) {
        console.error('Error creating the uploads folder');
        return false;
      }
    } else {
      console.error('Error reading the uploads folder');
      return false;
    }
  }
  return true;
}
const isFileValid = file => {
  const type = file.originalFilename.endsWith('.epub');

  if (!type) {
    console.error('The file type is invalid');
    return false;
  }
  return true;
};

module.exports = async function handleUploads(req, res, uploadFolder) {
  let ids = [];
  console.log('dotarło');

  // new formidable instance to process incoming files:
  const form = new IncomingForm({
    multiples: true,
    maxFiles: 5,
    maxFileSize: 500 * 1024 * 1024, //50mb
    uploadDir: uploadFolder,
  });
  const folderExists = await checkUploadFolder(uploadFolder);
  if (!folderExists) {
    return res.json({
      ok: false,
      msg: 'There was an error creating the uploads folder',
    });
  }

  form.parse(req, async (err, fields, files) => {
    let myUploadedFiles = [];

    if (err) {
      console.log('Error parsing the files');
      return res.status(400).json({
        status: 'Fail',
        message: 'There was an error parsing the files',
      });
    }

    for (let i = 0; i < files.files.length; i++) {
      const id = nanoid(15);

      const file = files.files[i];

      const isValid = isFileValid(file);

      const fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, '-')
      );

      if (!isValid) {
        return res.status(400).json({
          status: 'fail',
          message: 'The file type is not a valid type',
        });
      }
      try {
        fs.renameAsync(file.filepath, `${uploadFolder}//${fileName}`);
      } catch (error) {
        console.log(error);
      }

      myUploadedFiles.push(fileName);
      ids.push(id);
    }
    // }
    const parsedData = await epubParser(myUploadedFiles, ids);
    if (parsedData) {
      res.status(200).json({
        status: 'success',
        message: 'The files have been uploaded successfully',
        files: myUploadedFiles,
        parsedData: parsedData,
      });
    }
  });
};
