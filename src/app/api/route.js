const mysql = require('mysql2/promise');
const accounts = require('./accounts');

export async function GET(request) {
  // create the connection to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  // simple query
  const [rows, fields] = await connection.execute(
    'select * from users u where u.uid = 1;'
  );

  return Response.json({ rows });
}

export async function POST(request) {
  // create the connection to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  // simple query
  const [rows, fields] = await connection.execute(
    `select * from users u where u.username = 'aaron';`
  );


  return Response.json({ rows });
}