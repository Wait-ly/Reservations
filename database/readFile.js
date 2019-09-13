const fs = require('fs');
const split = require('split');

const read = fs.createReadStream('largeData.csv');
const lineStream = read.pipe(split());
let counter = 0;
let thousands = 1000;
lineStream.on('data', (data) => {
  counter++;
  if (counter > thousands) {
    console.log(counter - 1);
    thousands += 1000;
  }
});
