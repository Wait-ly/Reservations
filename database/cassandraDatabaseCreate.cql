DROP KEYSPACE IF EXISTS sdc;
CREATE KEYSPACE sdc WITH REPLICATION ={'class': 'SimpleStrategy', 'replication_factor':1};

USE sdc;

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS restaurants;

CREATE TABLE restaurants (
  id int PRIMARY KEY,
  name text,
  open timestamp,
  close timestamp
);

CREATE TABLE tables (
  id int PRIMARY KEY,
  two smallint,
  four smallint,
  six smallint,
  eight smallint,
  ten smallint,
  twelve smallint,
  restaurant_id int
);

CREATE TABLE reservations (
  id int PRIMARY KEY,
  datetime timestamp,
  name text,
  table_size text,
  restaurant_id int
);