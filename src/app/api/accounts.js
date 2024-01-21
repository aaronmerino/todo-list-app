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
    const [rows, fields] = await db.execute('SELECT * FROM users u WHERE u.username = ?', [username]);
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

  const user = await getUserFromUsername(username, db);

  if (user.length !== 0) {
    throw new Error("Username not available");
  }

  const salt = generateRandStr(16);
  const password_hash = hashPassword(password, salt);

  try {
    await db.execute('INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)', [username, password_hash, salt]);
  } catch (error) {
    throw new Error(error);
  }

  return username;
}

const createSessionId = async (user_id, db) => {
  const session_id = generateRandStr(32);

  try {
    await db.execute('REPLACE INTO user_sessions (sid, uid) VALUES (?, ?)', [session_id, user_id]);
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

  const user = await getUserFromUsername(username, db);

  if (user.length === 0) {
    throw new Error("Username not available");
  }

  // salt and hash the password and compare with password_hash associated with the username in db

  // first get the salt from db
  const user_data = user[0];

  const salt = user_data.salt;

  // second hash the password with salt

  const password_hash = hashPassword(password, salt);

  // third compare with password_hash associated with username

  if (user_data.password_hash === password_hash) {
    // if valid:
    // generate sessionid and store in db
    // return sessionid as response to client
    const user_id = user_data.uid;
    const session_id = await createSessionId(user_id, db);

    return { session_id: session_id, username: username };

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
  const user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Invalid Username");
  }

  const user_id = user_data[0].uid;

  try {
    // Check if session id exists with username and check if session id is at most 2 days
    const [rows, fields] = await db.execute('SELECT sid FROM user_sessions s WHERE s.sid = ? AND s.uid = ? AND DATEDIFF(CURRENT_TIMESTAMP, s.login_time) <= 2', [session_id, user_id]);

    if (rows.length === 0) {
      return false;
    }

    return true;

  } catch (error) {
    throw new Error(error);
  }  

}

const getTodos = async (username, session_id, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }

  const user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  const user_id = user_data[0].uid;

  try {
    const [rows, _] = await db.execute('SELECT tid, parentid, date_created, priority, description, completed, completion_date FROM todos t WHERE t.uid = ?', [user_id]);

    return rows;

  } catch (error) {
    throw new Error(error);
  }  
}

// note: we can get root todos by having parentid = null
const getSubTodos = async (username, session_id, parentid, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }

  const user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  const user_id = user_data[0].uid;

  try {
    const [rows, fields] = await db.execute(`SELECT tid, parentid, date_created, priority, description, completed FROM todos t WHERE t.uid = '${user_id}' AND t.parentid = '${parentid}'`);

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

  const user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  const user_id = user_data[0].uid;
  console.log(todo.parentid);

  if (todo.parentid !== null) {
    console.log('sdfdf')
    try {
      const [res, _] = await db.execute('INSERT INTO todos (uid, parentid, priority, description) VALUES (?, ?, ?, ?)', [user_id, todo.parentid, todo.priority, todo.description]);
  
      return res;
  
    } catch (error) {
      
      throw new Error(error);
    }  
  } else {
    console.log('sdfdf34324534543')
    try {
      const [res, _] = await db.execute('INSERT INTO todos (uid, priority, description) VALUES (?, ?, ?)', [user_id, todo.priority, todo.description]);
  
      return res;
  
    } catch (error) {
      
      throw new Error(error);
    }      
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

  const user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  try {
    const [rows, _] = await db.execute('SELECT tid, parentid, date_created, priority, description, completed, completion_date FROM todos t WHERE t.tid = ?', [tid]);

    return rows;

  } catch (error) {
    throw new Error(error);
  }  
}

const deleteTodo = async (username, session_id, tid, db) => {
  username = username.trim();

  if (!isValidUsername(username)) {
    throw new Error("Invalid Username");
  }

  if (!isValidSessionId(session_id, username, db)) {
    throw new Error("Invalid Session");
  }

  const user_data = await getUserFromUsername(username, db);

  if (user_data.length === 0) {
    throw new Error("Username not available");
  }

  try {
    const [rows, _] = await db.execute('DELETE FROM todos t WHERE t.tid = ?', [tid]);

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
  
  const todo_list = await getTodo(username, session_id, todo.tid, db);

  if (todo_list.length === 0) {
    throw new Error("Todo does not exist");
  }

  try {
    console.log(todo.description);
    
    if (todo.completed) {
      if (!todo_list[0].completed) {
        const res = await db.execute('UPDATE todos t SET t.priority = ?, t.description = ?, t.completed = 1, t.completion_date = ? WHERE t.tid = ?', [todo.priority, todo.description, todo.completion_date, todo.tid]);

        return res;
      } else {
        const res = await db.execute('UPDATE todos t SET t.priority = ?, t.description = ?, t.completed = 1 WHERE t.tid = ?', [todo.priority, todo.description, todo.tid]);

        return res;
      }
    } 
    
    const res = await db.execute('UPDATE todos t SET t.priority = ?, t.description = ?, t.completed = 0, t.completion_date = NULL WHERE t.tid = ?', [todo.priority, todo.description, todo.tid]);
      
    return res;

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
  getTodos,
  getSubTodos,
  insertTodo,
  getTodo,
  deleteTodo,
  editTodo
};