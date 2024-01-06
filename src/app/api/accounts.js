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
    const [rows, fields] = await db.execute(`SELECT * FROM users u WHERE u.username = '${username}'`);
    console.log(rows.length);
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

  let user = await getUserFromUsername(username, db);

  if (user.length !== 0) {
    throw new Error("Username not available");
  }

  let salt = generateRandStr(16);
  let password_hash = hashPassword(password, salt);

  try {
    await db.execute(`INSERT INTO users (username, password_hash, salt) VALUES ('${username}', '${password_hash}', '${salt}')`);
  } catch (error) {
    throw new Error(error);
  }

  return username;
}

const createSessionId = async (user_id, db) => {
  let session_id = generateRandStr(32);

  try {
    await db.execute(`REPLACE INTO user_sessions (sid, uid) VALUES ('${session_id}', '${user_id}')`);
  } catch (error) {
    throw new Error(error);
  }

  return session_id;
}

const login = async (username, password, db) => {
  username = username.trim();
  password = password.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidPassword(password)) {
    throw new Error("Invalid Password");
  }

  let user_data = await getUserFromUsername(username, db);

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

const isValidSessionId = async (session_id, username, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  // select datediff(current_timestamp, date('2024-01-01 23:59:59')) = 2;
  let user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Invalid Username");
  }

  let user_id = user_data[0].uid;

  try {
    // Check if session id exists with username and check if session id is at most 2 days
    const [rows, fields] = await db.execute(`SELECT sid FROM user_sessions s WHERE s.sid = '${session_id}' AND s.uid = '${user_id}' AND DATEDIFF(CURRENT_TIMESTAMP, s.login_time) <= 2`);

    if (rows.length === 0) {
      return false;
    }

    return true;

  } catch (error) {
    throw new Error(error);
  }  

}

const getUsersTodos = async (username, session_id, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }

  let user_id = user_data[0].uid;

  try {
    const [rows, fields] = await db.execute(`SELECT tid, date_created, priority, description, completed FROM todos t WHERE t.uid = '${user_id}'`);

    return rows;

  } catch (error) {
    throw new Error(error);
  }  
}

const insertTodo = async (username, session_id, todo, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }

  let user_id = user_data[0].uid;

  try {
    const [rows, fields] = await db.execute(`INSERT INTO todos (uid, priority, description, completed) VALUES (${user_id}, ${todo.priority}, ${todo.description}, ${todo.completed})`);

    return rows;

  } catch (error) {
    throw new Error(error);
  }  

}

const getTodo = async (username, session_id, tid, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }
    
  try {
    const [rows, fields] = await db.execute(`SELECT * FROM todos t WHERE t.tid = '${tid}'`);
    
    return rows;

  } catch (error) {
    throw new Error(error);
  }
}

const editTodo = async (username, session_id, todo, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }
  
  let todo = await getTodo(username, session_id, todo.tid, db);

  if (user.length === 0) {
    throw new Error("Todo does not exist");
  }

  let user_id = user_data[0].uid;

  try {
    const [rows, fields] = await db.execute(`INSERT INTO todos (uid, priority, description, completed) VALUES (${user_id}, ${todo.priority}, ${todo.description}, ${todo.completed})`);

    return rows;

  } catch (error) {
    throw new Error(error);
  }  
}

module.exports = {
  generateRandStr,
  hashPassword,
  isValidUsername,
  isValidPassword,
  getUserFromUsername,
  createAccount,
  createSessionId,
  login,
  isValidSessionId,
  getUsersTodos,
  insertTodo,
  getTodo,
  editTodo
};