const imgModel = require('../models/cover');
const sharp = require('sharp');

const fs = require('fs-extra');
const path = require('path');

async function resizer(file) {
  sizes = [300, 600, 1000];
  const resize = async size => {
    sharp(`${file}.jpg`).resize({ width: size }).toFile(`${file}-${size}.jpg`);
  };
  for (let i = 0; i < sizes.length; i++) {
    resize(sizes[i]);
  }
}

module.exports = async function (localId, id, title, imagesFolder) {
  sizes = ['', '-300', '-600', '-1000'];

  sizes.map(size => {
    const imagePath = path.join(imagesFolder, localId);
    const cover = {
      bookId: id,
      name: `${title}${size}`,
      img: {
        data: fs.readFileSync(`${imagePath}${size}.jpg`),
        contentType: 'image/png',
      },
    };
    imgModel.create(cover, (error, item) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`successfully added ${title}${size} cover to the database`);
      }
    });
  });
};
