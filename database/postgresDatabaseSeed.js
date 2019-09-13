const create = require('./postgresDatabaseCreate');
const data = require('./sdcDataGenerator.js');

const { pg } = create;

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
// console.log(data.generateRestaurants());
pg('reservations', 'tables', 'restaurants').del()
  .then(() => {
    pg('restaurants').insert(data.generateRestaurants())
      .then(() => {
        console.log('inserted 500 restaurants');
        pg.destroy();
      });

    pg('tables').insert(data.generateTables())
      .then(() => {
        console.log('inserted 500 tables');
        pg.destroy();
      });
  });
