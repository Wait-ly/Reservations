const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'sdc' });

client.execute("select * from reservations where restaurant_id = 390 and date = '2019-09-30';")
  .then((response) => {
    console.log(response.rows);
  });
