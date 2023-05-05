const fs = require('fs');

const readStream = fs.createReadStream('01-read-file/text.txt');

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

readStream.on('end', () => {
  console.log('File reading is done.');
});