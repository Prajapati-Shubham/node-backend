const mysql = require("mysql2");
require("dotenv").config();


function createDatabaseConnection() {
  const connectionString = process.env.connectionString;

  if (!connectionString) {
    throw new Error("Database connection string is not defined in the .env file.");
  }

  const db = mysql.createConnection(connectionString);

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      throw err;
    }
    console.log("Database connected successfully");
  });

  return db; 
}

module.exports = createDatabaseConnection;
