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
  date DATE NOT NULL,
  file VARCHAR(255)  NOT NULL,
  collection VARCHAR(255)  NOT NULL
);

CREATE TABLE IF NOT EXISTS labephoto_tags (
photo_id VARCHAR(255) ,
tag VARCHAR(255),
FOREIGN KEY (photo_id) REFERENCES labephoto_photos(id)
);


SELECT * FROM labephoto_photos;

SELECT * FROM labephoto_tags;

SELECT labephoto_photos.*, GROUP_CONCAT(labephoto_tags.tag)
FROM labephoto_photos
JOIN labephoto_tags ON labephoto_photos.id = labephoto_tags.photo_id
GROUP BY id
;

