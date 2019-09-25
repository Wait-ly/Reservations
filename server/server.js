require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const morgan = require('morgan');
const compression = require('compression');
const redis = require('redis');

const redisClient = redis.createClient(6379, '52.53.215.106');
redisClient.auth('shinobi');

const app = express();
const port = 3002;
// const database = require('../database/database.js');
const postgres = require('../database/postgresDatabase.js');

const checkRedis = (req, res, next) => {
  redisClient.get(req.params.id, (err, reply) => {
    if (err) throw err;
    if (reply !== null) {
      res.send(JSON.parse(reply));
    } else {
      next();
    }
  });
};
app.use(cors());
// app.use(morgan());
app.use(compression());
app.use(bodyParser());
app.use('/reservations/:id', express.static('public'));

app.use(express.static('public'));
app.get('/loaderio-9a3dc1375281aaf9bb65464ec64be0f2', (req, res) => {
  res.send('loaderio-9a3dc1375281aaf9bb65464ec64be0f2');
});
app.get('/api/reservations/:id', checkRedis, (req, res) => {
  const param = req.params.id;
  // MONGODB
  // database.getListingData(param)
  //   .then((data) => {
  //     const dataForListing = data[0].Dates.slice();
  //     res.send(dataForListing);
  //   })
  //   .catch((err) => {
  //     console.log('Error with retrieving data for listing', err);
  //   });
  // POSTGRES
  postgres.getAllReservations(param, (data) => {
    redisClient.set(param, JSON.stringify(data));
    res.send(data);
  });
});

app.post('/api/reservations/:id', (req, res) => {
  const { reservation } = req.body;
  postgres.postNewReservation(reservation, (err, response) => {
    if (err) { res.send(err); } else {
      res.send('Successfully reserved!');
    }
  });
});

app.put('/api/reservations/:id', (req, res) => {
  const { reservation } = req.body;
  postgres.updateReservation(reservation, (err, response) => {
    if (err) { res.send(err); } else {
      res.send('Successfully updated!');
    }
  });
});

app.delete('/api/reservations/:id', (req, res) => {
  const { reservation } = req.body;
  postgres.deleteReservation(reservation, (err, response) => {
    if (err) { res.send(err); } else {
      res.send('Successfully deleted!');
    }
  });
});

app.listen(port, () => { console.log(`argh matey we be arriving at port ${port}`); });
