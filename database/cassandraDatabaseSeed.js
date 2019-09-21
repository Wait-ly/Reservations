const cassandra = require('cassandra-driver');
const fs = require('fs');
const faker = require('faker');
const moment = require('moment');
const LineByLineReader = require('line-by-line');

const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'sdc' });
/*
reservations data object (10M):
{
  id: #,
  time: 08:00 AM - 09:00 PM,
  date: 2019-09-12 - 2019-12-31,
  restaurant_name: faker random name,
  reservation_name: faker random name,
  table_size: two, four, six, eight, ten, or twelve,
  restaurant_id: 1 - 500,
  open: 06:00 AM - 08:00 AM,
  close: 10:00 PM - 11:00 PM,
  two: 5 - 8,
  four: 5 - 8,
  six: 3 - 5,
  eight: 3 - 5,
  ten: 3 - 5,
  twelve: 1 - 2,
}
*/

const generateReservations = (callback) => {
  const tables = ['two', 'four', 'six', 'eight', 'ten', 'twelve'];
  const half = ['00', '30'];
  const write = fs.createWriteStream('./largeDataCass.csv');
  (async () => {
    for (let i = 1; i <= 1e7; i++) {
      const id = i;
      const restaurantName = `${faker.name.findName()}'s`;
      const open = `0${Math.floor(Math.random() * (9 - 6)) + 6}:00:00.000`;
      const close = `${Math.floor(Math.random() * (24 - 22)) + 22}:00:00.000`;
      const two = Math.floor(Math.random() * (9 - 5)) + 5;
      const four = Math.floor(Math.random() * (9 - 5)) + 5;
      const six = Math.floor(Math.random() * (6 - 3)) + 3;
      const eight = Math.floor(Math.random() * (6 - 3)) + 3;
      const ten = Math.floor(Math.random() * (6 - 3)) + 3;
      const twelve = Math.floor(Math.random() * (3 - 1)) + 1;
      const minutes = Math.floor(Math.random() * 2);
      const time = `${Math.floor(Math.random() * (21 - 8)) + 8}:${half[minutes]}:00.000`;
      const month = Math.floor(Math.random() * (13 - 9)) + 9;
      const day = Math.floor(Math.random() * (31 - 1)) + 1;
      const date = moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const reservationName = faker.name.findName();
      const table = tables[Math.floor(Math.random() * 6)];
      const restaurantId = Math.floor(Math.random() * (2001 - 1)) + 1;
      if (i > 1e7) {
        break;
      }
      if (!write.write(`${id},"${time}","${date}","${restaurantName}","${reservationName}","${table}",${restaurantId},"${open}","${close}",${two},${four},${six},${eight},${ten},${twelve}\n`)) {
        await new Promise((resolve) => write.once('drain', resolve));
      }
    }
    console.log('finished generating data for cassandra');
    callback();
  })();
};
const seed = () => {
  const lr = new LineByLineReader('/Users/michaellee/HRSF/SDC-Waitly/Reservations/largeDataCass.csv');
  let queries = 0;
  let unfinished = 0;
  lr.on('line', (line) => {
    if (queries % 10000 === 0) {
      console.log(queries);
    }
    queries += 1;
    if (unfinished >= 2047) {
      lr.pause();
    } else {
      const parsed = line.split(',');
      const values = [JSON.parse(parsed[0]), JSON.parse(parsed[1]), JSON.parse(parsed[2]), JSON.parse(parsed[3]), JSON.parse(parsed[4]), JSON.parse(parsed[5]), JSON.parse(parsed[6]), JSON.parse(parsed[7]), JSON.parse(parsed[8]), JSON.parse(parsed[9]), JSON.parse(parsed[10]), JSON.parse(parsed[11]), JSON.parse(parsed[12]), JSON.parse(parsed[13]), JSON.parse(parsed[14])];
      unfinished += 1;
      client.execute('INSERT INTO reservations (id, time, date, restaurant_name, reservation_name, table_size, restaurant_id, open, close, two , four, six, eight, ten, twelve) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, { prepare: true })
        .then(() => { unfinished -= 1; lr.resume(); });
    }
  });
};
generateReservations(seed);
