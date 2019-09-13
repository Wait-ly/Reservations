const create = require('./postgresDatabaseCreate');

const { pg } = create;

// creates tables in database if not created
pg.schema.hasTable('restaurants')
  .then((exists) => {
    if (exists) {
      create.postgresDeleteTables(create.postgresCreateTables);
    } else {
      create.postgresCreateTables();
    }
  });
// need to make function that retrieves all data from reservations, and formulates a data object based on the information not present in the reservations table


// pg('restaurants').insert(
//   name: 'michael restaurant', open: '2019-09-08T10:30:00-07:00', close: '2019-09-08T10:30:00-07:00',
// )
//   .then(console.log('hi'));
