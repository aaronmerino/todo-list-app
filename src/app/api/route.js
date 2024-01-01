const mysql = require('mysql2/promise');

export async function GET() {
  // create the connection to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  // simple query
  const [rows, fields] = await connection.execute(
    'select * from sailors s, reserves r where s.sid = r.sid;'
  );

  return Response.json({ rows });
}

export async function POST() {
  // create the connection to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  });

  // simple query
  const [rows, fields] = await connection.execute(
    'select * from reserves r where r.sid = 31;'
  );

  return Response.json({ rows });
}