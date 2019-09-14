const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
/*
restaurant data object (500):
{
  id: #,
  name: faker random name,
  open: 06:00 AM - 08:00 AM,
  close: 10:00 PM - 11:00 PM
}

tables data object (500):
{
  id: #,
  two: 5 - 8,
  four: 5 - 8,
  six: 3 - 5,
  eight: 3 - 5,
  ten: 3 - 5,
  twelve: 1 - 2,
  restaurant_ id: #
}

reservations data object (10M):
{
  id: #,
  time: 08:00 AM - 09:00 PM,
  date: 2019-09-12 - 2019-12-31,
  name: faker random name,
  table_size: two, four, six, eight, ten, or twelve,
  restaurant_id: 1 - 500,
}
*/

const generateRestaurants = () => {
  const output = [];
  for (let i = 1; i <= 500; i++) {
    const obj = {};
    obj.id = i;
    obj.name = faker.random.word();
    const open = Math.floor(Math.random() * (9 - 6)) + 6;
    obj.open = `0${open}:00 AM`;
    const close = Math.floor(Math.random() * (12 - 10)) + 10;
    obj.close = `${close}:00 PM`;
    output.push(obj);
  }
  return output;
};

const generateTables = () => {
  const output = [];
  for (let j = 1; j <= 500; j++) {
    const obj = {};
    obj.id = j;
    obj.two = Math.floor(Math.random() * (9 - 5)) + 5;
    obj.four = Math.floor(Math.random() * (9 - 5)) + 5;
    obj.six = Math.floor(Math.random() * (6 - 3)) + 3;
    obj.eight = Math.floor(Math.random() * (6 - 3)) + 3;
    obj.ten = Math.floor(Math.random() * (6 - 3)) + 3;
    obj.twelve = Math.floor(Math.random() * (3 - 1)) + 1;
    obj.restaurant_id = j;
    output.push(obj);
  }
  return output;
};

const generateReservations = () => {
  const tables = ['two', 'four', 'six', 'eight', 'ten', 'twelve'];
  const write = fs.createWriteStream('./largeData.csv');
  (async () => {
    for (let k = 1; k <= 1e7; k++) {
      // CSV FORMAT
      const id = k;
      const time = Math.floor(Math.random() * (21 - 8)) + 8;
      const month = Math.floor(Math.random() * (13 - 9)) + 9;
      const day = Math.floor(Math.random() * (31 - 1)) + 1;
      const datetime = `${moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')} ${moment(`${time}:00 AM`, 'HH:mm').format('hh:mm A')}`;
      const name = faker.name.findName();
      const table = tables[Math.floor(Math.random() * 6)];
      const restaurant = Math.floor(Math.random() * (501 - 1)) + 1;
      const row = `"${id}","${datetime}","${name}","${table}","${restaurant}"`;
      write.write(row);
      // OBJECT FORMAT
      // const obj = {};
      // obj.id = k;
      // const time = Math.floor(Math.random() * (21 - 8)) + 8;
      // const month = Math.floor(Math.random() * (13 - 9)) + 9;
      // const day = Math.floor(Math.random() * (31 - 1)) + 1;
      // obj.datetime = `${moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')} ${moment(`${time}:00 AM`, 'HH:mm').format('hh:mm A')}`;
      // obj.name = faker.name.findName();
      // obj.table_size = tables[Math.floor(Math.random() * 6)];
      // obj.restaurant_id = Math.floor(Math.random() * (501 - 1)) + 1;
      // write.write(JSON.stringify(obj));

      if (k === 1e7) {
        break;
      }
      if (!write.write('\n')) {
        await new Promise((resolve) => write.once('drain', resolve));
      }
    }
    console.log('done');
  })();
};
generateReservations();

module.exports = {
  generateReservations,
  generateRestaurants,
  generateTables,
};
