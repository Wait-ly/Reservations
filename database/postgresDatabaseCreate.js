const pg = require('knex')({
  client: 'pg',
  connection: 'postgres://localhost/sdc',
});

const postgresDeleteTables = (callback) => {
  pg.schema.dropTable('reservations')
    .then(() => {
      console.log('reservations table dropped');
      pg.schema.dropTable('tables')
        .then(() => {
          console.log('tables table dropped');
          pg.schema.dropTable('restaurants')
            .then(() => {
              console.log('restaurants table dropped');
              callback();
            });
        });
    });
};

const postgresCreateTables = () => {
  pg.schema.createTable('restaurants', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.time('open');
    table.time('close');
  })
    .then(() => {
      console.log('restaurants table created');
      pg.schema.hasTable('tables')
        .then((exists) => {
          if (exists) {
            pg.schema.dropTable('tables').then(console.log('tables table dropped'));
          }
          pg.schema.createTable('tables', (table) => {
            table.increments('id').primary();
            table.smallint('two');
            table.smallint('four');
            table.smallint('six');
            table.smallint('eight');
            table.smallint('ten');
            table.smallint('twelve');
            table.integer('restaurant_id').unsigned().references('id').inTable('restaurants')
              .onDelete('CASCADE');
          })
            .then(() => {
              console.log('tables table created');
              pg.schema.hasTable('reservations')
                .then((exists) => {
                  if (exists) {
                    pg.schema.dropTable('reservations').then(console.log('reservations table dropped'));
                  }
                  pg.schema.createTable('reservations', (table) => {
                    table.increments('id').primary();
                    table.timestamp('datetime');
                    table.string('name');
                    table.string('table_size');
                    table.integer('restaurant_id').unsigned().references('id').inTable('restaurants')
                      .onDelete('CASCADE');
                  })
                    .then(() => {
                      console.log('reservations table created');
                      pg.destroy();
                    });
                });
            });
        });
    });
};
// const postgresCreateTables = () => {
//   pg.schema.hasTable('restaurants')
//     .then((exists) => {
//       if (exists) {
//         pg.schema.dropTable('reservations')
//           .then(() => {
//             console.log('reservations table dropped');
//             pg.schema.dropTable('tables');
//           })
//           .then(() => {
//             console.log('tables table dropped');
//             pg.schema.dropTable('restaurants');
//           })
//           .then(() => {
//             console.log('restaurants table dropped'); pg.schema.createTable('restaurants', (table) => {
//               table.increments('id').primary();
//               table.string('name');
//               table.integer('total_seats');
//               table.float('open');
//               table.float('close');
//             })
//               .then(() => {
//                 console.log('restaurants table created');
//                 pg.schema.hasTable('tables')
//                   .then((exists) => {
//                     if (exists) {
//                       pg.schema.dropTable('tables').then(console.log('tables table dropped'));
//                     }
//                     pg.schema.createTable('tables', (table) => {
//                       table.increments('id').primary();
//                       table.integer('seats');
//                       table.integer('restaurant_id').unsigned().references('id').inTable('restaurants')
//                         .onDelete('CASCADE');
//                     })
//                       .then(() => {
//                         console.log('tables table created');
//                         pg.schema.hasTable('reservations')
//                           .then((exists) => {
//                             if (exists) {
//                               pg.schema.dropTable('reservations').then(console.log('reservations table dropped'));
//                             }
//                             pg.schema.createTable('reservations', (table) => {
//                               table.increments('id').primary();
//                               table.float('date');
//                               table.float('time');
//                               table.integer('table_id').unsigned().references('id').inTable('tables')
//                                 .onDelete('CASCADE');
//                             })
//                               .then(() => {
//                                 console.log('reservations table created');
//                                 pg.destroy();
//                               });
//                           });
//                       });
//                   });
//               });
//           });
//       } else {
//         pg.schema.createTable('restaurants', (table) => {
//           table.increments('id').primary();
//           table.string('name');
//           table.integer('total_seats');
//           table.float('open');
//           table.float('close');
//         })
//           .then(() => {
//             console.log('restaurants table created');
//             pg.schema.hasTable('tables')
//               .then((exists) => {
//                 if (exists) {
//                   pg.schema.dropTable('tables').then(console.log('tables table dropped'));
//                 }
//                 pg.schema.createTable('tables', (table) => {
//                   table.increments('id').primary();
//                   table.integer('seats');
//                   table.integer('restaurant_id').unsigned().references('id').inTable('restaurants')
//                     .onDelete('CASCADE');
//                 })
//                   .then(() => {
//                     console.log('tables table created');
//                     pg.schema.hasTable('reservations')
//                       .then((exists) => {
//                         if (exists) {
//                           pg.schema.dropTable('reservations').then(console.log('reservations table dropped'));
//                         }
//                         pg.schema.createTable('reservations', (table) => {
//                           table.increments('id').primary();
//                           table.float('date');
//                           table.float('time');
//                           table.integer('table_id').unsigned().references('id').inTable('tables')
//                             .onDelete('CASCADE');
//                         })
//                           .then(() => {
//                             console.log('reservations table created');
//                             pg.destroy();
//                           });
//                       });
//                   });
//               });
//           });
//       }
//     });
// };

module.exports = {
  pg,
  postgresCreateTables,
  postgresDeleteTables,
};
