const { Pool, Client } = require('pg');
// const create = require('./postgresDatabaseCreate');
const moment = require('moment');
// const { knex } = create;
const client = new Client({
  host: 'localhost',
  database: 'sdc',
});
// creates tables in database if not created
// const resetTables = () => {
//   knex.schema.hasTable('restaurants')
//     .then((exists) => {
//       if (exists) {
//         create.postgresDeleteTables(create.postgresCreateTables);
//       } else {
//         create.postgresCreateTables();
//       }
//     });
// };
// resetTables();
// need to make function that retrieves all data from reservations, and formulates a data object based on the information not present in the reservations table
client.connect();
const getAllReservations = (id, callback) => {
  const dateToday = moment().format('YYYY-MM-DD');
  client.query(`SELECT * FROM reservations WHERE restaurant_id = ${parseInt(id.slice(1))} and datetime > '${dateToday}' ORDER BY datetime ASC;`, (err, res) => {
    const dictionary = {
      two: 2, four: 4, six: 6, eight: 8, ten: 10, twelve: 12,
    };
    const timeSlots = {};
    for (let i = 0; i < res.rows.length; i += 1) {
      if (!timeSlots[moment(res.rows[i].datetime).format('YYYY-MM-DDHH:mm:ss')]) {
        timeSlots[moment(res.rows[i].datetime).format('YYYY-MM-DDHH:mm:ss')] = dictionary[res.rows[i].table_size];
      } else {
        timeSlots[moment(res.rows[i].datetime).format('YYYY-MM-DDHH:mm:ss')] += dictionary[res.rows[i].table_size];
      }
    }
    client.query(`SELECT * FROM restaurants INNER JOIN tables on restaurants.id = tables.restaurant_id where restaurants.id = ${parseInt(id.slice(1))};`, (err, res) => {
      const data = [];
      const info = res.rows[0];
      const totalSeats = (info.two * 2) + (info.four * 4) + (info.six * 6) + (info.eight * 8) + (info.ten * 10) + (info.twelve * 12);
      const { open } = info;
      const { close } = info;
      let currentTime = moment(open, 'HH:mm:ss').format('HH:mm:ss');
      let currentDate = moment(new Date()).add(0, 'days').format('YYYY-MM-DD');
      let oneDay = {
        Seats: [],
        SeatNumber: totalSeats,
        Hours: `${currentDate}T${open}-07:00--${currentDate}T${close}-07:00`,
        Date: `${currentDate}T15:46:24-07:00`,
      };
      let oneTime = {
        reservations: {
          open: totalSeats - timeSlots[currentDate + currentTime] || totalSeats,
          reserved: timeSlots[currentDate + currentTime] || 0,
        },
        time: `${currentDate}T${currentTime}-07:00`,
      };
      while (currentDate !== '2020-01-01') {
        while (currentTime !== close) {
          oneDay.Seats.push(oneTime);
          currentTime = moment(currentTime, 'HH:mm:ss').add(30, 'minutes').format('HH:mm:ss');
          oneTime = {
            reservations: {
              open: totalSeats - timeSlots[currentDate + currentTime] || totalSeats,
              reserved: timeSlots[currentDate + currentTime] || 0,
            },
            time: `${currentDate}T${currentTime}-07:00`,
          };
        }
        data.push(oneDay);
        currentTime = open;
        currentDate = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
        oneDay = {
          Seats: [],
          SeatNumber: totalSeats,
          Hours: `${currentDate}T${open}-07:00--${currentDate}T${close}-07:00`,
          Date: `${currentDate}T15:46:24-07:00`,
        };
      }
      callback(data);
    });
  });
};

const postNewReservation = (reservation, callback) => {
  console.log(reservation);
  client.query(`INSERT INTO reservations (datetime, name, table_size, restaurant_id) values ('${reservation.datetime}', '${reservation.name}', '${reservation.table_size}', ${reservation.restaurant_id});`, (err, res) => {
    callback(err, res);
  });
};

const updateReservation = (reservation, callback) => {
  client.query(`UPDATE reservations SET datetime = '${reservation.datetime}', name = '${reservation.name}', table_size = '${reservation.table_size}', restaurant_id = '${reservation.restaurant_id}' WHERE name = '${reservation.name}' AND restaurant_id = '${reservation.restaurant_id}';`, (err, res) => {
    callback(err, res);
  });
};

const deleteReservation = (reservation, callback) => {
  client.query(`DELETE FROM reservations WHERE name = '${reservation.name}' AND restaurant_id = '${reservation.restaurant_id}'`, (err, res) => {
    callback(err, res);
  });
};

module.exports = {
  getAllReservations,
  postNewReservation,
  updateReservation,
  deleteReservation,
};
