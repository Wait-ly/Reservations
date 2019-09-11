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

'GET': /api/:id/reservations
  - retrieves a reservation for a specified id
  - returns the data object for the reservation if successful

'POST': /api/reservations
  - creates a new reservation with the provided data
  - returns the data object created for the new reservation if successful

'PUT': /api/:id/reservations
  - updates a reservation for a specified id
  - returns the updated data object for the reservation if successful

'DELETE': /api/:id/reservations
  - deletes a reservation for a specified id
  - returns the deleted data object for the reservation if successful