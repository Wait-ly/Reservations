/* eslint-disable comma-dangle */
/* eslint-disable import/no-extraneous-dependencies */
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/Reservations', { useNewUrlParser: true })
//   .then(() => { console.log('Mango be connected'); })
//   .catch((error) => { console.log('Mango tree have error ', error); });

// const db = mongoose.connection;

// const reservationSchema = new mongoose.Schema({
//   Listing: String,
//   Dates: [
//     {
//       Date: String,
//       Seats: [
//         {
//           SeatNumber: Number,
//           Hours: String,
//           time: String,
//           reservations: {
//             open: Number,
//             reserved: Number
//           }
//         }
//       ]
//     }
//   ]
// });

// const ReservationDocument = mongoose.model('Reservation', reservationSchema);

// const getListingData = (listing) => (
//   ReservationDocument.find({ Listing: listing })
// );

// module.exports = {
//   getListingData
// };
