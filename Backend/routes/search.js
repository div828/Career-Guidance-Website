const express = require("express");
const router = express.Router();
const db = require("../db");

/* =====================================================
   1️⃣ HOME PAGE SEARCH (DATABASE SEARCH)
   GET /api/search?query=...&district=...&state=...&page=1
===================================================== */

router.get("/", async (req, res) => {
  try {
    const {
      query = "",
      district = "",
      state = "",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    let whereConditions = "1=1";
    const values = [];

    /* 🔍 SEARCH LOGIC (FIXED) */
    if (query.trim()) {
      whereConditions += `
        AND (
          LOWER(college_name) LIKE ? OR
          LOWER(district) LIKE ? OR
          LOWER(state) LIKE ? OR
          LOWER(university_name) LIKE ?
        )
      `;

      const searchValue = `%${query.toLowerCase()}%`;

      values.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    /* 🎯 DISTRICT FILTER */
    if (district.trim()) {
      whereConditions += ` AND LOWER(district) LIKE ?`;
      values.push(`%${district.toLowerCase()}%`);
    }

    /* 🎯 STATE FILTER */
    if (state.trim()) {
      whereConditions += ` AND LOWER(state) LIKE ?`;
      values.push(`%${state.toLowerCase()}%`);
    }

    /* ================= MAIN QUERY ================= */

    const mainQuery = `
      SELECT *
      FROM (
        SELECT
          TRIM(LOWER(college_name)) AS college_name,
          MAX(district) AS district,
          MAX(state) AS state,
          MAX(university_name) AS university_name,
          MAX(course_category) AS course_category,
          MAX(college_type) AS college_type
        FROM colleges
        WHERE ${whereConditions}
        GROUP BY TRIM(LOWER(college_name))
      ) AS grouped_colleges
      ORDER BY
        (LOWER(district) = LOWER(?)) DESC,
        (LOWER(state) = LOWER(?)) DESC,
        college_type = 'Government' DESC,
        college_name ASC
      LIMIT ?
      OFFSET ?
    `;

    const finalValues = [
      ...values,
      query.toLowerCase(),   // ranking district
      query.toLowerCase(),   // ranking state
      limitNumber,
      offset,
    ];

    const [rows] = await db.query(mainQuery, finalValues);

    res.json({
      results: rows,
      total: rows.length,
      page: pageNumber,
    });

  } catch (error) {
    console.error("Home search DB error:", error);
    res.status(500).json({ results: [] });
  }
});

/* =====================================================
   2️⃣ SMART SEARCH (COLLEGES PAGE - NEARBY)
   POST /api/search/smart
===================================================== */

router.post("/smart", async (req, res) => {
  try {
    const { query = "", latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.json({ results: [] });
    }

    const radius = 30000;

    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="college"](around:${radius},${latitude},${longitude});
        node["amenity"="university"](around:${radius},${latitude},${longitude});
        way["amenity"="college"](around:${radius},${latitude},${longitude});
        way["amenity"="university"](around:${radius},${latitude},${longitude});
      );
      out center;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: overpassQuery,
      }
    );

    const text = await response.text();

    if (text.startsWith("<")) {
      console.error("Overpass returned HTML");
      return res.json({ results: [] });
    }

    const data = JSON.parse(text);

    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let colleges = data.elements
      .map((item) => {
        const latVal = item.lat || item.center?.lat;
        const lonVal = item.lon || item.center?.lon;

        if (!latVal || !lonVal) return null;

        const distance = getDistance(
          latitude,
          longitude,
          latVal,
          lonVal
        );

        return {
          id: item.id,
          name: item.tags?.name || "Unnamed College",
          location: item.tags?.["addr:city"] || "Nearby Area",
          distance: distance.toFixed(2),
        };
      })
      .filter(Boolean);

    if (query.trim()) {
      colleges = colleges.filter((college) =>
        college.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    colleges.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );

    res.json({
      results: colleges,
      total: colleges.length,
    });

  } catch (error) {
    console.error("Smart search error:", error);
    res.json({ results: [] });
  }
});

module.exports = router;