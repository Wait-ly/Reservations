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
// client.execute('INSERT INTO reservations (id, time, date, restaurant_name, reservation_name, table_size, restaurant_id, open, close, two ,four, six, eight, ten, twelve) VALUES (? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [1, '02:00 AM', '2019-09-12', 'hi', 'yo', 'two', 3, '04:00 AM', '10:00 PM', 5, 6, 4, 3, 3, 2], { prepare: true })
//   .then((result) => console.log('inserted'));
// client.execute("SELECT * FROM reservations WHERE restaurant_id = 3 AND date = '2019-09-12'")
//   .then((res) => console.log(res));
// client.execute('INSERT INTO reservations (id, time, date, restaurant_name, reservation_name, table_size, restaurant_id, open, close, two ,four, six, eight, ten, twelve) VALUES (? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, time, date, restaurantName, reservationName, table, restaurantId, open, close, two, four, six, eight, ten, twelve], { prepare: true })
//   .then(() => console.log());

const generateReservations = (callback) => {
  const tables = ['two', 'four', 'six', 'eight', 'ten', 'twelve'];
  const write = fs.createWriteStream('./largeDataCass.csv');
  (async () => {
    for (let i = 1; i <= 1e5; i++) {
      const id = i;
      const restaurantName = faker.random.word();
      const open = `0${Math.floor(Math.random() * (9 - 6)) + 6}:00 AM`;
      const close = `${Math.floor(Math.random() * (12 - 10)) + 10}:00 PM`;
      const two = Math.floor(Math.random() * (9 - 5)) + 5;
      const four = Math.floor(Math.random() * (9 - 5)) + 5;
      const six = Math.floor(Math.random() * (6 - 3)) + 3;
      const eight = Math.floor(Math.random() * (6 - 3)) + 3;
      const ten = Math.floor(Math.random() * (6 - 3)) + 3;
      const twelve = Math.floor(Math.random() * (3 - 1)) + 1;
      const time = moment(`${Math.floor(Math.random() * (21 - 8)) + 8}:00 AM`, 'HH:mm').format('hh:mm A');
      const month = Math.floor(Math.random() * (13 - 9)) + 9;
      const day = Math.floor(Math.random() * (31 - 1)) + 1;
      const date = moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const reservationName = faker.name.findName();
      const table = tables[Math.floor(Math.random() * 6)];
      const restaurantId = Math.floor(Math.random() * (502 - 1)) + 1;
      // write.write(`${id},'${time}','${date}','${restaurantName}','${reservationName}','${table}',${restaurantId},'${open}','${close}',${two},${four},${six},${eight},${ten},${twelve}`);
      write.write(`${id},${time},${date},${restaurantName},${reservationName},${table},${restaurantId},${open},${close},${two},${four},${six},${eight},${ten},${twelve}`);
      if (i === 1e5) {
        break;
      }
      if (!write.write(`${id},${time},${date},${restaurantName},${reservationName},${table},${restaurantId},${open},${close},${two},${four},${six},${eight},${ten},${twelve}\n`)) {
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
  // lr.on('line', (line) => {
  //   const parsed = line.split(',');
  //   while (queries <= 1e5) {
  //     if (queries % 10000) {
  //       console.log(queries);
  //     }
  //     queries += 1;
  //     if (unfinished >= 2047) {
  //       lr.pause();
  //     } else {
  //       unfinished += 1;
  //       client.execute('INSERT INTO reservations (id, time, date, restaurant_name, reservation_name, table_size, restaurant_id, open, close, two ,four, six, eight, ten, twelve) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [JSON.parse(parsed[0]), parsed[1], parsed[2], parsed[3], parsed[4], parsed[5], JSON.parse(parsed[6]), parsed[7], parsed[8], JSON.parse(parsed[9]), JSON.parse(parsed[10]), JSON.parse(parsed[11]), JSON.parse(parsed[12]), JSON.parse(parsed[13]), JSON.parse(parsed[14])], { prepare: true })
  //         .then((res) => { unfinished -= 1; lr.resume(); console.log('res', res); });
  //     }
  //   }
  // });
  lr.on('line', (line) => {
    if (queries % 1000) {
      console.log(queries);
    }
    queries += 1;
    if (unfinished >= 2047) {
      lr.pause();
    } else {
      const parsed = line.split(',');
      const values = [JSON.parse(parsed[0]), parsed[1], parsed[2], parsed[3], parsed[4], parsed[5], JSON.parse(parsed[6]), parsed[7], parsed[8], JSON.parse(parsed[9]), JSON.parse(parsed[10]), JSON.parse(parsed[11]), JSON.parse(parsed[12]), JSON.parse(parsed[13]), JSON.parse(parsed[14])];
      unfinished += 1;
      client.execute('INSERT INTO reservations (id, time, date, restaurant_name, reservation_name, table_size, restaurant_id, open, close, two , four, six, eight, ten, twelve) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, { prepare: true })
        .then((res) => { unfinished -= 1; lr.resume(); console.log('res', res); });
    }
  });
  console.log('done');
};
generateReservations(seed);
// const generateTables = () => {
//   const output = [];
//   for (let j = 1; j <= 500; j++) {
//     const obj = {};
//     obj.id = j;
//     obj.two = Math.floor(Math.random() * (9 - 5)) + 5;
//     obj.four = Math.floor(Math.random() * (9 - 5)) + 5;
//     obj.six = Math.floor(Math.random() * (6 - 3)) + 3;
//     obj.eight = Math.floor(Math.random() * (6 - 3)) + 3;
//     obj.ten = Math.floor(Math.random() * (6 - 3)) + 3;
//     obj.twelve = Math.floor(Math.random() * (3 - 1)) + 1;
//     obj.restaurant_id = j;
//     output.push(obj);
//   }
//   return output;
// };

// const generateReservations = () => {
//   const tables = ['two', 'four', 'six', 'eight', 'ten', 'twelve'];
//   const write = fs.createWriteStream('./largeData.csv');
//   (async () => {
//     for (let k = 1; k <= 1e7; k++) {
//       // CSV FORMAT
//       const id = k;
//       const time = Math.floor(Math.random() * (21 - 8)) + 8;
//       const month = Math.floor(Math.random() * (13 - 9)) + 9;
//       const day = Math.floor(Math.random() * (31 - 1)) + 1;
//       const datetime = `${moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')} ${moment(`${time}:00 AM`, 'HH:mm').format('hh:mm A')}`;
//       const name = faker.name.findName();
//       const table = tables[Math.floor(Math.random() * 6)];
//       const restaurant = Math.floor(Math.random() * (501 - 1)) + 1;
//       const row = `"${id}","${datetime}","${name}","${table}","${restaurant}"`;
//       write.write(row);
//       // OBJECT FORMAT
//       // const obj = {};
//       // obj.id = k;
//       // const time = Math.floor(Math.random() * (21 - 8)) + 8;
//       // const month = Math.floor(Math.random() * (13 - 9)) + 9;
//       // const day = Math.floor(Math.random() * (31 - 1)) + 1;
//       // obj.datetime = `${moment(`2019-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD')} ${moment(`${time}:00 AM`, 'HH:mm').format('hh:mm A')}`;
//       // obj.name = faker.name.findName();
//       // obj.table_size = tables[Math.floor(Math.random() * 6)];
//       // obj.restaurant_id = Math.floor(Math.random() * (501 - 1)) + 1;
//       // write.write(JSON.stringify(obj));

//       if (k === 1e7) {
//         break;
//       }
//       if (!write.write('\n')) {
//         await new Promise((resolve) => write.once('drain', resolve));
//       }
//     }
//     console.log('done');
//   })();
// };
