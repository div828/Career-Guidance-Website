const mysql = require("mysql2");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",      // or root if you want
  password: "Divya1701",
  database: "digital_guidance",
  port: 3307             // 🔥 THIS IS IMPORTANT
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully!");
    connection.release();
  }
});

module.exports = db.promise();
