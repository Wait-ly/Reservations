DROP KEYSPACE IF EXISTS sdc;
CREATE KEYSPACE sdc WITH REPLICATION ={'class': 'SimpleStrategy', 'replication_factor':1};

USE sdc;

DROP TABLE IF EXISTS reservations;

CREATE TABLE reservations (
  id int,
  date date,
  time time,
  reservation_name text,
  table_size text,
  restaurant_id int,
  restaurant_name text,
  open time,
  close time,
  two smallint,
  four smallint,
  six smallint,
  eight smallint,
  ten smallint,
  twelve smallint,
  PRIMARY KEY ((restaurant_id, date), time, reservation_name)
);