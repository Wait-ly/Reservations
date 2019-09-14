DROP KEYSPACE IF EXISTS sdc;
CREATE KEYSPACE sdc WITH REPLICATION ={'class': 'SimpleStrategy', 'replication_factor':1};

USE sdc;

DROP TABLE IF EXISTS reservations;

CREATE TABLE reservations (
  id int,
  date date,
  time time,
  name text,
  table_size text,
  restaurant_id int,
  restaurant_name text,
  open timestamp,
  close timestamp,
  two smallint,
  four smallint,
  six smallint,
  eight smallint,
  ten smallint,
  twelve smallint,
  PRIMARY KEY ((restaurant_id, date), time)
);