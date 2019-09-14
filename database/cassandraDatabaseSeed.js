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
const generateRestaurants = () => {
  const tables = ['two', 'four', 'six', 'eight', 'ten', 'twelve'];
  const write = fs.createWriteStream('./largeDataCass.csv');
  (async () => {
    for (let i = 1; i <= 1e7; i++) {
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
      const row = `"${id}","${datetime}","${name}","${table}","${restaurant}"`;
      write.write(row);
      if (i === 1e7) {
        break;
      }
      if (!write.write('\n')) {
        await new Promise((resolve) => write.once('drain', resolve));
      }
    }
    console.log('finished generating data and seeding for cassandra');
  })();
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
