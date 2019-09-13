const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');


const app = express();
const port = 3002;
const database = require('../database/database.js');

app.use(cors());
app.use(morgan());
app.use(compression());
app.use('/:id/reservations', express.static('public'));

app.use(express.static('public'));

app.get('/api/:id/reservations', (req, res) => {
  const param = req.params.id;
  database.getListingData(param)
    .then((data) => {
      const dataForListing = data[0].Dates.slice();
      console.log(dataForListing);
      res.send(dataForListing);
    })
    .catch((err) => {
      console.log('Error with retrieving data for listing', err);
    });
});

app.post('/api/reservations', (req, res) => {
  console.log('post');
});

app.put('/api/:id/reservations', (req, res) => {
  console.log('updated');
});

app.delete('/api/:id/reservations', (req, res) => {
  console.log('deleted');
});

app.listen(port, () => { console.log(`argh matey we be arriving at port ${port}`); });
