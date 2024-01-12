const mysql = require('mysql2/promise');
const accounts = require('../accounts');

export async function POST(request) {
  // create the connection to database
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  console.log(formData);
  
  try {
    let res = await accounts.createAccount(username, password, db);
    return Response.json({ res: res });
  } catch (error) {
    console.log(error);
    return Response.json(null, {status: 400, statusText: error.message});
  }

}