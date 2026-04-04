const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../db");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [rows] = await db.query(
          "SELECT * FROM users WHERE google_id = ?",
          [profile.id]
        );

        let user = rows[0];

        if (!user) {
          const [result] = await db.query(
            "INSERT INTO users (google_id, name, email, photo) VALUES (?, ?, ?, ?)",
            [
              profile.id,
              profile.displayName,
              profile.emails[0].value,
              profile.photos[0].value
            ]
          );

          user = {
            id: result.insertId,
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value
          };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});
