const knex = require('knex')({
  client: 'pg',
  connection: 'postgres://localhost/sdc',
});

const postgresDeleteTables = (callback) => {
  knex.schema.dropTable('reservations')
    .then(() => {
      console.log('reservations table dropped');
      knex.schema.dropTable('tables')
        .then(() => {
          console.log('tables table dropped');
          knex.schema.dropTable('restaurants')
            .then(() => {
              console.log('restaurants table dropped');
              callback();
            });
        });
    });
};

const postgresCreateTables = () => {
  knex.schema.createTable('restaurants', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.time('open');
    table.time('close');
  })
    .then(() => {
      console.log('restaurants table created');
      knex.schema.hasTable('tables')
        .then((exists) => {
          if (exists) {
            knex.schema.dropTable('tables').then(console.log('tables table dropped'));
          }
          knex.schema.createTable('tables', (table) => {
            table.increments('id').primary();
            table.smallint('two');
            table.smallint('four');
            table.smallint('six');
            table.smallint('eight');
            table.smallint('ten');
            table.smallint('twelve');
            table.integer('restaurant_id');
          })
            .then(() => {
              console.log('tables table created');
              knex.schema.hasTable('reservations')
                .then((exists) => {
                  if (exists) {
                    knex.schema.dropTable('reservations').then(console.log('reservations table dropped'));
                  }
                  knex.schema.createTable('reservations', (table) => {
                    table.increments('id').primary();
                    table.string('datetime');
                    table.string('name');
                    table.string('table_size');
                    table.integer('restaurant_id');
                  })
                    .then(() => {
                      console.log('reservations table created');
                      knex.destroy();
                    });
                });
            });
        });
    });
};
// creates tables in database if not created
const resetTables = () => {
  knex.schema.hasTable('restaurants')
    .then((exists) => {
      if (exists) {
        postgresDeleteTables(postgresCreateTables);
      } else {
        postgresCreateTables();
      }
    });
};
resetTables();
module.exports = {
  knex,
  postgresCreateTables,
  postgresDeleteTables,
};
