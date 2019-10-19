const { Pool, Client } = require('pg');
const faker = require('faker');
const moment = require('moment');
const fs = require('fs');

const client = new Client({
  user: 'postgres',
  password: 'shinobi',
  host: 'ec2-54-215-249-29.us-west-1.compute.amazonaws.com',
  database: 'sdc',
  port: 5432,
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

// const generateRestaurants = (callback) => {
//   for (let i = 1; i <= 1e5; i++) {
//     const id = i;
//     const name = faker.random.word();
//     const open = `0${Math.floor(Math.random() * (9 - 6)) + 6}:00 AM`;
//     const close = `${Math.floor(Math.random() * (12 - 10)) + 10}:00 PM`;
//     client.query(`INSERT INTO restaurants (id, name, open, close) values (${id}, '${name}', '${open}', '${close}');`, (err, res) => { console.log(i); });
//   }
//   console.log('done generating and seeding restaurants');
//   callback();
// };

// const generateTables = (callback) => {
//   for (let j = 1; j <= 1e5; j++) {
//     const id = j;
//     const two = Math.floor(Math.random() * (6 - 3)) + 3;
//     const four = Math.floor(Math.random() * (6 - 3)) + 3;
//     const six = Math.floor(Math.random() * (4 - 1)) + 1;
//     const eight = Math.floor(Math.random() * (4 - 1)) + 1;
//     const ten = Math.floor(Math.random() * (3 - 1)) + 1;
//     const twelve = Math.floor(Math.random() * (3 - 1)) + 1;
//     const restaurantId = j;
//     client.query(`INSERT INTO tables (id, two, four, six, eight, ten, twelve, restaurant_id) values (${id}, ${two}, ${four}, ${six}, ${eight}, ${ten}, ${twelve}, ${restaurantId});`, (err, res) => { console.log(j); });
//   }
//   console.log('done generating and seeding tables');
//   callback();
// };

const generateRestaurants = (callback) => {
  const write = fs.createWriteStream('./largeDataRestaurants.csv');
  (async () => {
    for (let i = 1; i <= 1e6; i++) {
      const id = i;
      const name = faker.random.word();
      const open = `0${Math.floor(Math.random() * (9 - 6)) + 6}:00 AM`;
      const close = `${Math.floor(Math.random() * (12 - 10)) + 10}:00 PM`;
      const row = `"${id}","${name}", "${open}", "${close}"`;
      write.write(row);
      if (i === 1e6) {
        break;
      }
      if (!write.write('\n')) {
        await new Promise((resolve) => write.once('drain', resolve));
      }
    }
    client.query("COPY restaurants (id, name, open, close) FROM '/Users/michaellee/HRSF/SDC-Waitly/Reservations/largeDataRestaurants.csv' DELIMITER ',' CSV;", (err, res) => {
      console.log(err, res);
      console.log('done generating and seeding restaurants');
      callback();
    });
  })();
};

const generateTables = (callback) => {
  const write = fs.createWriteStream('./largeDataTables.csv');
  (async () => {
    for (let j = 1; j <= 1e6; j++) {
      const id = j;
      const two = Math.floor(Math.random() * (6 - 3)) + 3;
      const four = Math.floor(Math.random() * (6 - 3)) + 3;
      const six = Math.floor(Math.random() * (4 - 1)) + 1;
      const eight = Math.floor(Math.random() * (4 - 1)) + 1;
      const ten = Math.floor(Math.random() * (3 - 1)) + 1;
      const twelve = Math.floor(Math.random() * (3 - 1)) + 1;
      const restaurantId = j;
      const row = `"${id}","${two}", "${four}", "${six}", "${eight}", "${ten}", "${twelve}", "${restaurantId}"`;
      write.write(row);
      if (j === 1e6) {
        break;
      }
      if (!write.write('\n')) {
        await new Promise((resolve) => write.once('drain', resolve));
      }
    }
    client.query("COPY tables (id, two, four, six, eight, ten, twelve, restaurant_id) FROM '/Users/michaellee/HRSF/SDC-Waitly/Reservations/largeDataTables.csv' DELIMITER ',' CSV;", (err, res) => {
      console.log(err, res);
      console.log('done generating and seeding tables');
      callback();
    });
  })();
};

const generateReservations = () => {
  const tables = ['two', 'four', 'six', 'eight', 'ten', 'twelve'];
  const half = ['00', '30'];
  const write = fs.createWriteStream('./largeDataReservations.csv');
  (async () => {
    for (let k = 1; k <= 1e7; k++) {
      // CSV FORMAT
      const id = k;
      let time = Math.floor(Math.random() * (21 - 8)) + 8;
      if (time === 8 || time === 9) {
        time = `0${time}`;
      }
      const minutes = Math.floor(Math.random() * 2);
      const month = Math.floor(Math.random() * (13 - 9)) + 9;
      const day = Math.floor(Math.random() * (31 - 1)) + 1;
      const datetime = `${moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')}T${time}:${half[minutes]}:00-07:00`;
      const name = faker.name.findName();
      const table = tables[Math.floor(Math.random() * 6)];
      const restaurant = Math.floor(Math.random() * (1e6 - 1)) + 1;
      const row = `"${id}","${datetime}","${name}","${table}","${restaurant}"`;
      write.write(row);
      if (k === 1e7) {
        break;
      }
      if (!write.write('\n')) {
        await new Promise((resolve) => write.once('drain', resolve));
      }
    }
    client.query("COPY reservations (id, datetime, name, table_size, restaurant_id) FROM '/Users/michaellee/HRSF/SDC-Waitly/Reservations/largeDataReservations.csv' DELIMITER ',' CSV;", (err, res) => {
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
