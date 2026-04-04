require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const db = require("./db");

require("./config/passport");

const searchRoute = require("./routes/search");

const app = express();

/* ================= MIDDLEWARE ================= */

// 🔥 VERY IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= CORS ================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ================= SESSION ================= */

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ================= ROUTES ================= */

// ✅ SEARCH ROUTE
app.use("/api/search", searchRoute);

/* ================= TEST ROUTE (DEBUG) ================= */

app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

/* ================= GOOGLE AUTH ================= */

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: allowedOrigins[0],
  }),
  (req, res) => {
    res.redirect(allowedOrigins[0]);
  }
);

/* ================= GET CURRENT USER ================= */

app.get("/auth/user", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/* ================= HEALTH CHECK ================= */

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server running" });
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(500).json({ message: "Server error" });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});