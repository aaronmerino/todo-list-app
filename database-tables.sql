CREATE TABLE users (
  uid INT auto_increment,
  username VARCHAR(50) NOT NULL UNIQUE,
  register_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  PRIMARY KEY (uid)
);

CREATE TABLE user_sessions (
  sid VARCHAR(255) NOT NULL,
  uid INT NOT NULL,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sid),
  FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE todos (
  tid INT AUTO_INCREMENT,
  uid INT NOT NULL,
  priority INT,
  description VARCHAR(255),
  completed BOOLEAN DEFAULT 0,
  PRIMARY KEY (tid),
  FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT PriorityRange
  CHECK (priority >= 1 AND priority <= 3)
);
