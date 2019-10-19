# Project Name

Wait.ly Restaurant Reservation System

## Related Projects

  - https://github.com/Wait-ly/photo-gallery
  - https://github.com/Wait-ly/Menu
  - https://github.com/Wait-ly/Reviews

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

### Installing Dependencies

From within the root directory:

npm install

## CRUD API Routes

'GET': /api/reservations/:id
  - retrieves reservations for a specified restaurant
  - returns the data object for the restaurant if successful

'POST': /api/reservations/:id
  - creates a new reservation with the provided data for the specified restaurant in the url
  - returns a success message if the post is successful

'PUT': /api/reservations/:id
  - updates a reservation for a specified restaurant using provided date/time and reserver's name
  - returns the updated data object for the reservation if successful

'DELETE': /api/reservations/:id
  - deletes a reservation for a specified restaurant using provided date/time and reserver's name
  - returns the deleted data object for the reservation if successful