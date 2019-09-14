const { Pool, Client } = require('pg');
const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
// const data = require('./sdcDataGenerator.js');

const client = new Client({
  host: 'localhost',
  database: 'sdc',
});
/*
This database requires:
  - 500 restaurant entries
  - 500 table entries (One for each restaurant)
  - 10,000,000 reservation entries
  Each restaurant has 100 possible dates.
  Each date has ~20 possible time slots.
  Each time slot has ~20 possible reservations.
  500 * 100 * 20 * 20 = 20,000,000 possible reservations.
*/

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
  datetime: 2019-09-12 - 2019-12-31 + 08:00 AM - 09:00 PM,
  name: faker random name,
  table_size: two, four, six, eight, ten, or twelve,
  restaurant_id: 1 - 500,
}
*/

const generateRestaurants = (callback) => {
  for (let i = 1; i <= 1000; i++) {
    const id = i;
    const name = faker.random.word();
    const open = `0${Math.floor(Math.random() * (9 - 6)) + 6}:00 AM`;
    const close = `${Math.floor(Math.random() * (12 - 10)) + 10}:00 PM`;
    client.query(`INSERT INTO restaurants (id, name, open, close) values (${id}, '${name}', '${open}', '${close}');`, (err, res) => { console.log(i); });
  }
  console.log('done generating and seeding restaurants');
  callback();
};

const generateTables = (callback) => {
  for (let j = 1; j <= 1000; j++) {
    const id = j;
    const two = Math.floor(Math.random() * (9 - 5)) + 5;
    const four = Math.floor(Math.random() * (9 - 5)) + 5;
    const six = Math.floor(Math.random() * (6 - 3)) + 3;
    const eight = Math.floor(Math.random() * (6 - 3)) + 3;
    const ten = Math.floor(Math.random() * (6 - 3)) + 3;
    const twelve = Math.floor(Math.random() * (3 - 1)) + 1;
    const restaurantId = j;
    client.query(`INSERT INTO tables (id, two, four, six, eight, ten, twelve, restaurant_id) values (${id}, ${two}, ${four}, ${six}, ${eight}, ${ten}, ${twelve}, ${restaurantId});`, (err, res) => { console.log(j); });
  }
  console.log('done generating and seeding tables');
  callback();
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
      const restaurant = Math.floor(Math.random() * (1001 - 1)) + 1;
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
    client.query("COPY reservations (id, datetime, name, table_size, restaurant_id) FROM '/Users/michaellee/HRSF/SDC-Waitly/Reservations/largeData.csv' DELIMITER ',' CSV;", (err, res) => {
      console.log(err, res);
      client.end();
      console.log('done generating and seeding reservations');
    });
  })();
};
client.connect()
  .then(() => {
    console.log('connected to postgres');
    generateRestaurants(() => { generateTables(generateReservations); });
  });
