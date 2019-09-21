# Project Name

Llaminati's Restaurant Reservation System

## Related Projects

  - https://github.com/llaminati/Banner-Gallery
  - https://github.com/llaminati/Menu
  - https://github.com/llaminati/Reservations
  - https://github.com/llaminati/Reviews

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage



## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

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