const express = require("express");
const router = express.Router();
const db = require("../db");
const { careersCatalog } = require("../data/careersCatalog");

const normalizeCareer = (career) => ({
  id: career.id || null,
  title: career.title,
  category: career.category,
  overview: career.overview,
  courses: Array.isArray(career.courses)
    ? career.courses
    : career.courses
    ? career.courses.split(",").map((item) => item.trim()).filter(Boolean)
    : [],
  skills: Array.isArray(career.skills)
    ? career.skills
    : career.skills
    ? career.skills.split(",").map((item) => item.trim()).filter(Boolean)
    : [],
  avgSalary: career.avgSalary,
});

/* ================= GET ALL CAREERS ================= */
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM careers");

    const databaseCareers = rows.map(normalizeCareer);
    const mergedCareers = [...careersCatalog.map(normalizeCareer), ...databaseCareers];
    const seenTitles = new Set();
    const uniqueCareers = [];

    for (const career of mergedCareers) {
      const key = career.title.trim().toLowerCase();

      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        uniqueCareers.push(career);
      }
    }

    uniqueCareers.sort((a, b) => a.title.localeCompare(b.title));

    res.json(uniqueCareers);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Failed to load careers" });
  }
});

module.exports = router;
