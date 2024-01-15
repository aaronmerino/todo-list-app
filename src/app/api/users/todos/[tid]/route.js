const mysql = require('mysql2/promise');
const accounts = require('../../../accounts');

//GET SPECIFIC TODOS
export async function GET(request, { params }) {
  const session_id = request.cookies.get('session_id').value;
  const username = request.cookies.get('username').value;
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });
  console.log(params.tid);
  try {
    const res = await accounts.getTodo(username, session_id, params.tid, db);
    return Response.json({ res: res });
  } catch (error) {
    console.log(error);
    return Response.json(null, {status: 400, statusText: error.message});
  }  
}


export async function DELETE(request, { params }) {
  const session_id = request.cookies.get('session_id').value;
  const username = request.cookies.get('username').value;
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });
  console.log(params.tid);
  try {
    const res = await accounts.deleteTodo(username, session_id, params.tid, db);
    return Response.json({ res: res });
  } catch (error) {
    console.log(error);
    return Response.json(null, {status: 400, statusText: error.message});
  }    
}