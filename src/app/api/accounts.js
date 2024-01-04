const crypto = require('crypto');


const generateRandStr = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0,length);
}

const hashPassword = (password, salt) => {
  const hash = crypto.createHash('sha256');
  hash.update(password + salt);
  return hash.digest('hex');
}

// TODO
const isValidUsername = (username) => {
  return true;
}

// TODO
const isValidPassword = (password) => {
  return true;
}

const getUserFromUsername = async (username, db) => {
  try {
    const [rows, fields] = await db.execute(`SELECT * FROM users u WHERE u.username = ${username}`);
    return rows;

  } catch (error) {
    throw new Error(error);
  }
}

const createAccount = async (username, password, db) => {
  username = username.trim();
  password = password.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidPassword(password)) {
    throw new Error("Invalid Password");
  }

  if (getUserFromUsername(username, db).length === 0) {
    throw new Error("Username not available");
  }

  let salt = generateRandStr(16);
  let password_hash = hashPassword(password, salt);

  try {
    await db.execute(`INSERT INTO users (username, password_hash, salt) VALUES (${username}, ${password_hash}, ${salt})`);
  } catch (error) {
    throw new Error(error);
  }

  return username;
}

const createSessionId = async (user_id, db) => {
  let session_id = generateRandStr(32);

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  try {
    await db.execute(`REPLACE INTO user_sessions (sid, uid) VALUES (${session_id}, ${user_id})`);
  } catch (error) {
    throw new Error(error);
  }

  return session_id;
}

const login = async (username, password, db) => {
  username = username.trim();
  password = password.trim();

  let user_data = await getUserFromUsername(username, db);

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidPassword(password)) {
    throw new Error("Invalid Password");
  }

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  // salt and hash the password and compare with password_hash associated with the username in db

  // first get the salt from db
  user_data = user_data[0];

  let salt = user_data.salt;

  // second hash the password with salt

  let password_hash = hashPassword(password, salt);

  // third compare with password_hash associated with username

  if (user_data.password_hash === password_hash) {
    // if valid:
    // generate sessionid and store in db
    // return sessionid as response to client
    let user_id = user_data[0].uid;
    let session_id = await createSessionId(user_id, db);

    return [session_id, username];

  } else {
    // if not valid:
    throw new Error("Invalid credentials");

  }
}

const isValidSessionId = async (session_id, username) => {

}


module.exports = {
  generateRandStr,
  hashPassword,
  isValidUsername,
  isValidPassword,
  getUserFromUsername,
  createAccount,
  createSessionId,
  login
};