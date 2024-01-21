const mysql = require('mysql2/promise');
const accounts = require('../../accounts');

//GET ALL TODOS
export async function GET(request) {
  if (!request.cookies.has('session_id')) {
    return Response.json(null, {status: 400, statusText: `expired session`});
  }

  const session_id = request.cookies.get('session_id').value;
  const username = request.cookies.get('username').value;
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  try {
    const res = await accounts.getTodos(username, session_id, db);
    await db.end();

    return Response.json({ res: res });
  } catch (error) {
    console.log(error);
    await db.end();
    
    return Response.json(null, {status: 400, statusText: error.message});
  }  
}

// INSERT A TODO
export async function POST(request) {
  if (!request.cookies.has('session_id')) {
    return Response.json(null, {status: 400, statusText: `expired session`});
  }

  const session_id = request.cookies.get('session_id').value;
  const username = request.cookies.get('username').value;
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  const data = await request.json();
  const parentid = data.parentid;
  const priority = data.priority;
  const description = data.description;

  const todo = {parentid: parentid, priority: priority, description: description};

  try {
    const res = await accounts.insertTodo(username, session_id, todo, db);
    await db.end();
    return Response.json({ res: res, message: 'valid' });
  } catch (error) {
    console.log(error);
    await db.end();
    return Response.json({ message: 'invalid' }, {status: 400, statusText: error.message});
  }  
}

// EDIT A TODO
export async function PUT(request) {
  if (!request.cookies.has('session_id')) {
    return Response.json(null, {status: 400, statusText: `expired session`});
  }

  const session_id = request.cookies.get('session_id').value;
  const username = request.cookies.get('username').value;
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  const data = await request.json();
  const tid = data.tid;
  const priority = data.priority;
  const description = data.description;
  const completed = data.completed;
  const completion_date = data.completion_date;

  const todo = {tid: tid, priority: priority, description: description, completed: completed, completion_date: data.completion_date};

  try {
    const res = await accounts.editTodo(username, session_id, todo, db);
    
    await db.end();

    return Response.json({ res: res, message: 'valid' });
  } catch (error) {
    console.log(error);

    await db.end();
    
    return Response.json({ message: 'invalid' }, {status: 400, statusText: error.message});
  }  
}