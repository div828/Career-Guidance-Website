const express = require("express");
const router = express.Router();
const db = require("../db");

// Enhanced search combining both colleges_directory and maharashtra tables

const formatCollegeResult = (row, source = "directory") => ({
  id: row.id || row["Sr.No"] || Math.random(),
  college_name: row.college_name || row["College Name"] || "",
  state: row.state || "Maharashtra",
  district: row.district || row.District || "",
  city: row.city || row.Taluka || "",
  university_name: row.university_name || row.University || "",
  college_type: row.college_type || row["College Type"] || "Unknown",
  course_category: row.course_category || row["Course Category"] || "General",
  latitude: row.latitude || null,
  longitude: row.longitude || null,
  distance: row.distance || null,
  rating: row.rating || 4.0,
  source: source
});

const haversineSql = `
  (
    6371 * ACOS(
      COS(RADIANS(?)) *
      COS(RADIANS(latitude)) *
      COS(RADIANS(longitude) - RADIANS(?)) +
      SIN(RADIANS(?)) *
      SIN(RADIANS(latitude))
    )
  )
`;

// 1. GET /api/search/all-colleges - Returns ALL colleges from both tables
router.get("/all-colleges", async (req, res) => {
  try {
    const { 
      search = "", 
      state = "", 
      district = "", 
      college_type = "",
      limit = 100000,
      offset = 0
    } = req.query;

    const pageLimit = Math.min(Number(limit) || 100000, 150000);
    const pageOffset = Number(offset) || 0;

    // Build WHERE clause for colleges_directory
    let dirWhere = [];
    let dirValues = [];

    if (search.trim()) {
      dirWhere.push(`LOWER(college_name) LIKE ? OR LOWER(city) LIKE ? OR LOWER(district) LIKE ?`);
      const searchTerm = `%${search.toLowerCase()}%`;
      dirValues.push(searchTerm, searchTerm, searchTerm);
    }

    if (state.trim()) {
      dirWhere.push(`LOWER(state) LIKE ?`);
      dirValues.push(`%${state.toLowerCase()}%`);
    }

    if (district.trim()) {
      dirWhere.push(`LOWER(district) LIKE ?`);
      dirValues.push(`%${district.toLowerCase()}%`);
    }

    if (college_type.trim()) {
      dirWhere.push(`LOWER(college_type) LIKE ?`);
      dirValues.push(`%${college_type.toLowerCase()}%`);
    }

    const dirWhereClause = dirWhere.length > 0 ? `WHERE ${dirWhere.join(" AND ")}` : "";

    // Query colleges_directory - NO LIMIT on individual query
    const dirSql = `
      SELECT DISTINCT
        college_name,
        state,
        district,
        city,
        university_name,
        college_type,
        course_category,
        latitude,
        longitude,
        rating,
        'directory' as source
      FROM colleges_directory
      ${dirWhereClause}
      ORDER BY 
        CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END,
        rating DESC,
        college_name ASC
    `;

    const [dirResults] = await db.query(dirSql, dirValues);

    // Build WHERE clause for maharashtra table
    let mahWhere = [];
    let mahValues = [];

    if (search.trim()) {
      mahWhere.push(`LOWER(\`College Name\`) LIKE ? OR LOWER(District) LIKE ? OR LOWER(Taluka) LIKE ?`);
      const searchTerm = `%${search.toLowerCase()}%`;
      mahValues.push(searchTerm, searchTerm, searchTerm);
    }

    if (district.trim()) {
      mahWhere.push(`LOWER(District) LIKE ?`);
      mahValues.push(`%${district.toLowerCase()}%`);
    }

    if (college_type.trim()) {
      mahWhere.push(`LOWER(\`College Type\`) LIKE ?`);
      mahValues.push(`%${college_type.toLowerCase()}%`);
    }

    const mahWhereClause = mahWhere.length > 0 ? `WHERE ${mahWhere.join(" AND ")}` : "";

    // Query maharashtra table - NO LIMIT on individual query
    const mahSql = `
      SELECT DISTINCT
        \`College Name\` as college_name,
        'Maharashtra' as state,
        District as district,
        Taluka as city,
        University as university_name,
        \`College Type\` as college_type,
        \`Course Category\` as course_category,
        NULL as latitude,
        NULL as longitude,
        4.0 as rating,
        'maharashtra' as source
      FROM maharashtra
      ${mahWhereClause}
      ORDER BY 
        CASE WHEN \`College Type\` = 'Government' THEN 0 ELSE 1 END,
        \`College Name\` ASC
    `;

    const [mahResults] = await db.query(mahSql, mahValues);

    // Get colleges from maharashtra that are NOT in colleges_directory
    // This ensures we show all unique colleges
    const dirCollegeNames = new Set();
    dirResults.forEach(col => {
      dirCollegeNames.add(`${col.college_name}::${col.district}`.toLowerCase());
    });

    const uniqueMahRs = mahResults.filter(col => {
      return !dirCollegeNames.has(`${col.college_name}::${col.district}`.toLowerCase());
    });

    // Combine all results from BOTH tables
    const combined = [...dirResults, ...uniqueMahRs];
    const unique = new Map();
    
    combined.forEach(col => {
      const key = `${col.college_name}::${col.district}`.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, formatCollegeResult(col, col.source));
      }
    });

    // Apply LIMIT and OFFSET AFTER combining and deduplicating
    const results = Array.from(unique.values())
      .slice(pageOffset, pageOffset + pageLimit);

    res.json({
      results,
      total: unique.size,
      limit: pageLimit,
      offset: pageOffset,
      message: `Found ${results.length} colleges matching your criteria`
    });
  } catch (error) {
    console.error("All colleges search error:", error);
    res.status(500).json({ 
      results: [], 
      error: error.message 
    });
  }
});

// 2. GET /api/search/by-location - Returns ALL colleges in a specific location
router.get("/by-location", async (req, res) => {
  try {
    const { state = "", district = "", limit = 10000 } = req.query;
    const pageLimit = Math.min(Number(limit) || 10000, 50000);

    if (!state.trim() && !district.trim()) {
      return res.json({ 
        results: [], 
        error: "Please specify state or district" 
      });
    }

    // Query colleges_directory
    let dirWhere = [];
    let dirValues = [];

    if (state.trim()) {
      dirWhere.push(`LOWER(state) LIKE ?`);
      dirValues.push(`%${state.toLowerCase()}%`);
    }

    if (district.trim()) {
      dirWhere.push(`LOWER(district) LIKE ?`);
      dirValues.push(`%${district.toLowerCase()}%`);
    }

    const dirWhereClause = dirWhere.length > 0 ? `WHERE ${dirWhere.join(" AND ")}` : "";

    const dirSql = `
      SELECT DISTINCT
        college_name,
        state,
        district,
        city,
        university_name,
        college_type,
        course_category,
        latitude,
        longitude,
        rating,
        'directory' as source
      FROM colleges_directory
      ${dirWhereClause}
      ORDER BY 
        CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END,
        rating DESC,
        college_name ASC
      LIMIT ?
    `;

    const [dirResults] = await db.query(dirSql, [...dirValues, pageLimit]);

    // Query maharashtra if searching Maharashtra
    const [mahResults] = district.toLowerCase().includes('maharashtra') || state.toLowerCase().includes('maharashtra') 
      ? await db.query(`
          SELECT DISTINCT
            \`College Name\` as college_name,
            'Maharashtra' as state,
            District as district,
            Taluka as city,
            University as university_name,
            \`College Type\` as college_type,
            \`Course Category\` as course_category,
            NULL as latitude,
            NULL as longitude,
            4.0 as rating,
            'maharashtra' as source
          FROM maharashtra
          ${district.trim() ? `WHERE LOWER(District) LIKE ?` : ""}
          ORDER BY 
            CASE WHEN \`College Type\` = 'Government' THEN 0 ELSE 1 END,
            \`College Name\` ASC
          LIMIT ?
        `, district.trim() ? [`%${district.toLowerCase()}%`, pageLimit] : [pageLimit])
      : [[]];

    // Combine and deduplicate
    const combined = [...dirResults, ...mahResults];
    const unique = new Map();
    
    combined.forEach(col => {
      const key = `${col.college_name}::${col.district}`.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, formatCollegeResult(col, col.source));
      }
    });

    const results = Array.from(unique.values()).slice(0, pageLimit);

    res.json({
      results,
      total: unique.size,
      message: `Found ${results.length} colleges in ${state || district}`
    });
  } catch (error) {
    console.error("Location search error:", error);
    res.status(500).json({ 
      results: [], 
      error: error.message 
    });
  }
});

// 3. POST /api/search/all-nearby - Returns ALL nearby colleges from BOTH datasets
router.post("/all-nearby", async (req, res) => {
  try {
    const { lattitude, latitude, longitude, radiusKm = 100, limit = 50000 } = req.body;
    const lat = Number(latitude || lattitude);
    const lng = Number(longitude);
    const radius = Number(radiusKm) || 100;
    const pageLimit = Math.min(Number(limit) || 50000, 100000);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.json({ 
        results: [], 
        error: "Invalid latitude/longitude" 
      });
    }

    // City coordinates mapping for Maharashtra
    const cityCoordinates = {
      "alandi": { lat: 18.6397, lng: 73.8997 },
      "pune": { lat: 18.5204, lng: 73.8567 },
      "mumbai": { lat: 19.0760, lng: 72.8777 },
      "bombay": { lat: 19.0760, lng: 72.8777 },
      "nagpur": { lat: 21.1458, lng: 79.0882 },
      "nashik": { lat: 19.9975, lng: 73.7898 },
      "aurangabad": { lat: 19.8762, lng: 75.3433 },
      "kolhapur": { lat: 16.7050, lng: 74.2433 },
      "sangli": { lat: 16.8554, lng: 74.5745 },
      "belgaum": { lat: 15.8497, lng: 74.4977 },
      "satara": { lat: 17.6736, lng: 73.9988 },
      "solapur": { lat: 17.6724, lng: 75.9135 },
      "amravati": { lat: 20.9517, lng: 77.7532 },
      "chandrapur": { lat: 19.2783, lng: 79.3047 },
    };

    // PART 1: Get nearby colleges from colleges_directory
    const dirSql = `
      SELECT
        college_name,
        state,
        district,
        city,
        university_name,
        college_type,
        course_category,
        rating,
        latitude,
        longitude,
        ${haversineSql} AS distance,
        'directory' as source
      FROM colleges_directory
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance ASC
      LIMIT ?
    `;

    const [dirResults] = await db.query(dirSql, [lat, lng, lat, radius, pageLimit]);

    // PART 2: Get Maharashtra colleges and calculate distance
    const mahSql = `
      SELECT DISTINCT
        \`College Name\` as college_name,
        'Maharashtra' as state,
        District as district,
        Taluka as city,
        University as university_name,
        \`College Type\` as college_type,
        \`Course Category\` as course_category,
        4.0 as rating,
        NULL as latitude,
        NULL as longitude,
        'maharashtra' as source
      FROM maharashtra
      WHERE District IS NOT NULL AND Taluka IS NOT NULL
      ORDER BY \`College Name\` ASC
    `;

    const [mahResults] = await db.query(mahSql);

    // Calculate distance for each Maharashtra college
    const processedMahResults = mahResults.map(college => {
      const cityKey = (college.city || college.district || "").toLowerCase().trim();
      const coords = cityCoordinates[cityKey] || cityCoordinates["pune"];
      
      // Haversine distance calculation
      const toRad = (val) => (val * Math.PI) / 180;
      const R = 6371;
      const φ1 = toRad(lat);
      const φ2 = toRad(coords.lat);
      const Δφ = toRad(coords.lat - lat);
      const Δλ = toRad(coords.lng - lng);
      
      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return {
        ...college,
        distance: Math.round(distance * 100) / 100,
        latitude: coords.lat,
        longitude: coords.lng,
      };
    });

    // Filter within radius
    const filteredMah = processedMahResults.filter(c => c.distance <= radius);

    // Combine all results
    const combined = [...dirResults, ...filteredMah];
    const unique = new Map();
    
    combined.forEach(col => {
      const key = `${col.college_name}::${col.district}`.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, col);
      }
    });

    // Sort by distance first, then by type and rating
    const sorted = Array.from(unique.values())
      .sort((a, b) => {
        const distA = parseFloat(a.distance) || 999999;
        const distB = parseFloat(b.distance) || 999999;
        
        if (Math.abs(distA - distB) > 0.5) return distA - distB;
        
        if (a.college_type === "Government" && b.college_type !== "Government") return -1;
        if (a.college_type !== "Government" && b.college_type === "Government") return 1;
        
        return (b.rating || 0) - (a.rating || 0);
      })
      .slice(0, pageLimit);

    res.json({
      results: sorted.map(r => formatCollegeResult(r, r.source)),
      total: sorted.length,
      radius: radius,
      sources: {
        directory: dirResults.length,
        maharashtra: filteredMah.length,
      },
      message: `Found ${sorted.length} colleges within ${radius}km (Directory: ${dirResults.length}, Maharashtra: ${filteredMah.length})`
    });
  } catch (error) {
    console.error("All nearby search error:", error);
    res.status(500).json({ 
      results: [], 
      error: error.message 
    });
  }
});

module.exports = router;
