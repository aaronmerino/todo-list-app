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
    let res = await accounts.login(username, password, db);
    const headers_cookies = [
      ["Set-Cookie", `session_id=${res[0]}; SameSite=Strict`],
      ["Set-Cookie", `username=${res[1]}; SameSite=Strict`],
    ];

    const headers = new Headers(headers_cookies);
    

    return Response.json({ message: 'valid' }, { headers: headers });
  } catch (error) {
    console.log(error);
    return Response.json({ message: 'invalid' }, {status: 403, statusText: error.message});
  }

}