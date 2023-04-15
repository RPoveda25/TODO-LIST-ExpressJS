const mysql = require("mysql2");

const connectDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

connectDB.connect((error) => {
  if (error) {
    console.log(`Error: ${error}`);
    return;
  }

  console.log(`Connect sucessfully`);
});

module.exports = connectDB;
