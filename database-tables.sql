CREATE TABLE users (
  uid INT AUTO_INCREMENT,
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
  parentid INT DEFAULT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  priority INT,
  description VARCHAR(255),
  completed BOOLEAN DEFAULT 0,
  PRIMARY KEY (tid),
  FOREIGN KEY (uid) REFERENCES users (uid) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (parentid) REFERENCES todos (tid) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT PriorityRange CHECK (priority >= 1 AND priority <= 3)
);

-- if we add this, then the collumn completed becomes redundant i think.
-- a completion_date that is null means its not completed yet.
ALTER TABLE todos ADD COLUMN completion_date TIMESTAMP AFTER completed;

-- I want todos to have sub-todos
-- Should we create another table with two fields (parentid, childid)
-- A parent can have many children
-- A child has exactly one parent
-- parent cant be a child of itself
-- how do we enforce that the relationships form a tree (i.e. no cycles)
-- do we just enforce in the application itself, or can this be done using db only?
-- Another way is to simply have each todo have a parentid field
-- the root will have null parentid
-- CREATE TABLE todos_of_todo (
--   parentid INT NOT NULL,
--   childid INT NOT NULL,
--   FOREIGN KEY (parentid) REFERENCES todos (tid) ON DELETE CASCADE,
--   FOREIGN KEY (childid) REFERENCES todos (tid) ON DELETE CASCADE,
--   CONSTRAINT parent_child_not_unique CHECK (parentid <> childid)
-- );
