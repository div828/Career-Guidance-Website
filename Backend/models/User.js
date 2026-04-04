const db = require("../db");

// Find user by Google ID
const findUserByGoogleId = async (googleId) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE google_id = ?",
    [googleId]
  );
  return rows[0];
};

// Create new user
const createUser = async (userData) => {
  const { google_id, name, email, photo } = userData;

  const [result] = await db.query(
    "INSERT INTO users (google_id, name, email, photo) VALUES (?, ?, ?, ?)",
    [google_id, name, email, photo]
  );

  return result.insertId;
};

module.exports = {
  findUserByGoogleId,
  createUser
};
