CREATE TABLE IF NOT EXISTS labephoto_users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255)  NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL 
);

SELECT * FROM labephoto_users;

CREATE TABLE IF NOT EXISTS labephoto_photos (
  id VARCHAR(255) PRIMARY KEY,
  subtitle VARCHAR(255)  NOT NULL,
  author VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  file VARCHAR(255)  NOT NULL,
  collection VARCHAR(255)  NOT NULL
);

CREATE TABLE IF NOT EXISTS labephoto_tags (
photo_id VARCHAR(255) ,
tag VARCHAR(255),
FOREIGN KEY (photo_id) REFERENCES labephoto_photos(id)
);

CREATE TABLE IF NOT EXISTS labephoto_collections (
id VARCHAR(255) PRIMARY KEY,
title VARCHAR(255) UNIQUE NOT NULL,
subtitle VARCHAR(255)  NOT NULL,
author_id VARCHAR(255) NOT NULL,
image VARCHAR(255),
date DATETIME NOT NULL,
FOREIGN KEY (author_id) REFERENCES labephoto_users(id)
);
  
drop table labephoto_collections;

drop table labephoto_collection_photos;

CREATE TABLE IF NOT EXISTS labephoto_collection_photos (
photo_id VARCHAR(255) NOT NULL,
collection_id VARCHAR(255) NOT NULL,
 date DATETIME NOT NULL,
FOREIGN KEY (photo_id) REFERENCES labephoto_photos(id),
FOREIGN KEY (collection_id) REFERENCES labephoto_collections(id)
);

delete from labephoto_photos where id = "88ddaa57-5f12-4cb6-bd78-ff5cda303eaa";


SELECT * FROM labephoto_users;

SELECT * FROM labephoto_photos;

SELECT * FROM labephoto_tags;

SELECT * FROM labephoto_collections;

SELECT * FROM  labephoto_collection_photos;

delete from labephoto_photos where id ="8ade66d2-f703-47f5-aafa-75d011f4ab27";
delete from labephoto_tags where photo_id ="8ade66d2-f703-47f5-aafa-75d011f4ab27";

SET SQL_SAFE_UPDATES = 0; 

SELECT labephoto_photos.*, GROUP_CONCAT(labephoto_tags.tag) as tags, labephoto_users.nickname as author
FROM labephoto_photos
JOIN labephoto_tags ON labephoto_photos.id = labephoto_tags.photo_id
JOIN labephoto_users ON labephoto_photos.author = labephoto_users.id
GROUP BY id
HAVING tags like "%%"
;
