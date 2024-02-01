import { redirect } from 'next/navigation'

const mysql = require('mysql2/promise');
const accounts = require('../accounts');


export async function DELETE(request) {
  if (!request.cookies.has('session_id') || !request.cookies.has('username')) {
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
    await accounts.logout(username, session_id, db);
    await db.end();

    return Response.json({riderectTo: '/login'}, {status: 302});
  } catch (error) {
    console.log(error);
    await db.end();

    return Response.json(null, {status: 400, statusText: error.message});
  }    
}