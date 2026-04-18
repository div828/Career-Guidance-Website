const express = require("express");
const router = express.Router();
const db = require("../db");

const DIRECTORY_TABLE = "colleges_directory";
const officialWebsiteCache = new Map();
const geocodeCache = new Map(); // Cache for OpenStreetMap geocoding results
const blockedWebsiteDomains = [
  "shiksha.com",
  "careers360.com",
  "collegedunia.com",
  "collegesearch.in",
  "getmyuni.com",
  "wikipedia.org",
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "youtube.com",
  "justdial.com",
  "sulekha.com",
];

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

/* ================= OPENSTREETMAP GEOCODING ================= */
const geocodeCollegeLocation = async (collegeName, district, state) => {
  const cacheKey = `${collegeName}::${district}::${state}`.toLowerCase();
  
  // Return cached result if available
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    // Build search query for OpenStreetMap Nominatim API
    const searchQuery = `${collegeName}, ${district}, ${state}, India`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
    
    // Add user-agent header as required by Nominatim
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DigitalGuidancePlatform/1.0'
      }
    });
    
    if (!response.ok) {
      return null;
    }

    const results = await response.json();
    
    if (results && results.length > 0) {
      const result = {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon)
      };
      
      // Cache the result
      geocodeCache.set(cacheKey, result);
      return result;
    }
    
    return null;
  } catch (error) {
    console.error(`Geocoding error for ${collegeName}:`, error.message);
    return null;
  }
};

// Helper to get coordinates with fallback to district coordinates
const getCollegeCoordinates = (college) => {
  // If college has actual coordinates, use those
  if (college.latitude && college.longitude) {
    return {
      lat: parseFloat(college.latitude),
      lng: parseFloat(college.longitude)
    };
  }
  
  // Use district coordinates as fallback
  const districtCoords = districtCoordinates[college.district];
  if (districtCoords) {
    return { lat: districtCoords.lat, lng: districtCoords.lng };
  }
  
  // Default to Maharashtra center
  return { lat: 19.0, lng: 73.0 };
};

const formatDirectoryRow = (row) => ({
  id: row.id,
  college_name: row.college_name,
  district: row.district,
  state: row.state,
  city: row.city,
  address: row.address,
  website: row.website_url,
  phone: row.phone,
  rating: row.rating,
  latitude: row.latitude,
  longitude: row.longitude,
  university_name: row.university_name,
  college_type: row.college_type,
  course_category: row.course_category,
  distance:
    row.distance !== null && row.distance !== undefined
      ? Number(row.distance).toFixed(2)
      : undefined,
});

const tableExists = async (tableName) => {
  const [rows] = await db.query("SHOW TABLES LIKE ?", [tableName]);
  return rows.length > 0;
};

const decodeDuckDuckGoHref = (href) => {
  if (!href) {
    return "";
  }

  const normalizedHref = href.startsWith("//") ? `https:${href}` : href;

  try {
    const url = new URL(normalizedHref);
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : normalizedHref;
  } catch (error) {
    return normalizedHref;
  }
};

const isBlockedDomain = (urlString) => {
  try {
    const hostname = new URL(urlString).hostname.replace(/^www\./, "").toLowerCase();
    return blockedWebsiteDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    return true;
  }
};

const looksLikeOfficialCollegeSite = (urlString, collegeName) => {
  try {
    const hostname = new URL(urlString).hostname.replace(/^www\./, "").toLowerCase();
    const tokens = collegeName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3)
      .slice(0, 5);

    if (
      hostname.endsWith(".edu.in") ||
      hostname.endsWith(".ac.in") ||
      hostname.endsWith(".edu") ||
      hostname.endsWith(".gov.in")
    ) {
      return true;
    }

    return tokens.some((token) => hostname.includes(token));
  } catch (error) {
    return false;
  }
};

const resolveOfficialWebsite = async (collegeName, location = "") => {
  const cacheKey = `${collegeName}::${location}`.toLowerCase();

  if (officialWebsiteCache.has(cacheKey)) {
    return officialWebsiteCache.get(cacheKey);
  }

  const query = `${collegeName} ${location} official website`;
  const response = await fetch(
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      },
    }
  );

  const html = await response.text();
  const matches = [
    ...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"/gi),
  ];

  const resolvedCandidates = matches
    .map((match) => decodeDuckDuckGoHref(match[1]))
    .filter((url) => /^https?:\/\//i.test(url))
    .filter((url) => !isBlockedDomain(url));

  const preferred =
    resolvedCandidates.find((url) => looksLikeOfficialCollegeSite(url, collegeName)) ||
    resolvedCandidates[0] ||
    "";

  officialWebsiteCache.set(cacheKey, preferred);
  return preferred;
};

const runLegacySearch = async ({ query, district, state, pageNumber, limitNumber }) => {
  const offset = (pageNumber - 1) * limitNumber;
  let whereConditions = "1=1";
  const values = [];

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
    values.push(searchValue, searchValue, searchValue, searchValue);
  }

  if (district.trim()) {
    whereConditions += ` AND LOWER(district) LIKE ?`;
    values.push(`%${district.toLowerCase()}%`);
  }

  if (state.trim()) {
    whereConditions += ` AND LOWER(state) LIKE ?`;
    values.push(`%${state.toLowerCase()}%`);
  }

  const sql = `
    SELECT *
    FROM (
      SELECT
        MIN(id) AS id,
        MAX(college_name) AS college_name,
        MAX(district) AS district,
        MAX(state) AS state,
        NULL AS city,
        NULL AS address,
        NULL AS website,
        NULL AS phone,
        COALESCE(MAX(rating), 4.0) AS rating,
        NULL AS latitude,
        NULL AS longitude,
        MAX(university_name) AS university_name,
        MAX(course_category) AS course_category,
        MAX(college_type) AS college_type
      FROM colleges
      WHERE ${whereConditions}
      GROUP BY TRIM(LOWER(college_name))
    ) AS grouped_colleges
    ORDER BY
      college_type = 'Government' DESC,
      rating DESC,
      college_name ASC
    LIMIT ?
    OFFSET ?
  `;

  const [rows] = await db.query(sql, [
    ...values,
    limitNumber,
    offset,
  ]);

  return rows.map((row) => ({
    ...row,
    distance: undefined,
  }));
};

router.get("/", async (req, res) => {
  try {
    const {
      query = "",
      district = "",
      state = "",
      page = 1,
      limit = 10,
      latitude,
      longitude,
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    const lat = Number(latitude);
    const lng = Number(longitude);
    const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

    if (!(await tableExists(DIRECTORY_TABLE))) {
      const legacyRows = await runLegacySearch({
        query,
        district,
        state,
        pageNumber,
        limitNumber,
      });

      return res.json({
        results: legacyRows,
        total: legacyRows.length,
        page: pageNumber,
        source: "legacy",
      });
    }

    const whereConditions = [];
    const values = [];

    if (query.trim()) {
      const searchValue = `%${query.toLowerCase()}%`;
      whereConditions.push(`
        (
          LOWER(college_name) LIKE ? OR
          LOWER(COALESCE(city, '')) LIKE ? OR
          LOWER(COALESCE(district, '')) LIKE ? OR
          LOWER(COALESCE(state, '')) LIKE ? OR
          LOWER(COALESCE(university_name, '')) LIKE ?
        )
      `);
      values.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    if (district.trim()) {
      whereConditions.push(`LOWER(COALESCE(district, '')) LIKE ?`);
      values.push(`%${district.toLowerCase()}%`);
    }

    if (state.trim()) {
      whereConditions.push(`LOWER(COALESCE(state, '')) LIKE ?`);
      values.push(`%${state.toLowerCase()}%`);
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const distanceSelect = hasCoordinates
      ? `${haversineSql} AS distance,`
      : `NULL AS distance,`;

    const distanceValues = hasCoordinates ? [lat, lng, lat] : [];
    const orderBy = hasCoordinates
      ? `
        ORDER BY
          distance IS NOT NULL DESC,
          distance ASC,
          CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END,
          rating DESC,
          college_name ASC
      `
      : `
        ORDER BY
          CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END,
          rating DESC,
          college_name ASC
      `;

    const sql = `
      SELECT
        id,
        college_name,
        university_name,
        college_type,
        course_category,
        city,
        district,
        state,
        address,
        website_url,
        phone,
        rating,
        latitude,
        longitude,
        ${distanceSelect}
        source
      FROM ${DIRECTORY_TABLE}
      ${whereClause}
      ${orderBy}
      LIMIT ?
      OFFSET ?
    `;

    const [rows] = await db.query(sql, [
      ...distanceValues,
      ...values,
      limitNumber,
      offset,
    ]);

    res.json({
      results: rows.map(formatDirectoryRow),
      total: rows.length,
      page: pageNumber,
      source: "directory",
    });
  } catch (error) {
    console.error("College search DB error:", error);
    res.status(500).json({ results: [] });
  }
});

router.post("/smart", async (req, res) => {
  try {
    const { query = "", latitude, longitude, radiusKm = 50, limit = 50 } = req.body;
    const lat = Number(latitude);
    const lng = Number(longitude);
    const radius = Number(radiusKm) || 50;
    const limitNumber = Number(limit) || 50;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.json({ results: [], total: 0 });
    }

    if (!(await tableExists(DIRECTORY_TABLE))) {
      return res.json({
        results: [],
        total: 0,
        message:
          "Nearby search needs the colleges_directory table with latitude and longitude data.",
      });
    }

    const filters = ["latitude IS NOT NULL", "longitude IS NOT NULL"];
    const values = [lat, lng, lat];

    if (query.trim()) {
      const searchValue = `%${query.toLowerCase()}%`;
      filters.push(`
        (
          LOWER(college_name) LIKE ? OR
          LOWER(COALESCE(city, '')) LIKE ? OR
          LOWER(COALESCE(district, '')) LIKE ? OR
          LOWER(COALESCE(state, '')) LIKE ?
        )
      `);
      values.push(searchValue, searchValue, searchValue, searchValue);
    }

    const sql = `
      SELECT
        id,
        college_name,
        university_name,
        college_type,
        course_category,
        city,
        district,
        state,
        address,
        website_url,
        phone,
        rating,
        latitude,
        longitude,
        ${haversineSql} AS distance,
        source
      FROM ${DIRECTORY_TABLE}
      WHERE ${filters.join(" AND ")}
      HAVING distance <= ?
      ORDER BY 
        distance IS NOT NULL DESC,
        distance ASC,
        CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END,
        rating DESC,
        college_name ASC
      LIMIT ?
    `;

    const [rows] = await db.query(sql, [...values, radius, limitNumber]);

    res.json({
      results: rows.map(formatDirectoryRow),
      total: rows.length,
      source: "directory",
    });
  } catch (error) {
    console.error("Nearby college search error:", error);
    res.status(500).json({ results: [], total: 0 });
  }
});

router.get("/official-website", async (req, res) => {
  try {
    const { name = "", location = "" } = req.query;

    if (!String(name).trim()) {
      return res.status(400).json({ url: "", message: "College name is required." });
    }

    const url = await resolveOfficialWebsite(String(name), String(location));

    if (!url) {
      return res.json({
        url: "",
        message: "Official college website could not be resolved right now.",
      });
    }

    return res.json({ url });
  } catch (error) {
    console.error("Official website resolver error:", error);
    return res.status(500).json({
      url: "",
      message: "Failed to resolve official college website.",
    });
  }
});

// ============ COLLEGE NAME ALIASES ============
const collegeAliases = {
  'College of Engineering, Pune': ['COEP', 'College of Engineering Pune', 'COEP Pune', 'Pune College of Engineering', 'CoEP'],
  'MIT Academy of Engineering,Alandi, Pune': ['MITAOE', 'MIT Academy of Engineering', 'MIT AOE', 'Pune MIT Academy', 'MIT Alandi'],
  'Pimpri Chinchwad College of Engineering, Pune': ['PCCOE', 'Pimpri Chinchwad College', 'PCCOE Pune', 'PCCOE Pune'],
  'IIT Bombay': ['Indian Institute of Technology Bombay', 'IIT B', 'IITB', 'IIT-B', 'IITM Bombay'],
  'MAEER\'s MIT College of Engineering , Kothrud': ['MIT Kothrud', 'MIT College Kothrud', 'Maeers MIT'],
  'VIT': ['Vellore Institute of Technology', 'VIT Vellore', 'VIT University'],
  'DTU': ['Delhi Technological University', 'Delhi University of Technology', 'Delhi Tech'],
};

// Flatten to create bidirectional mapping
const aliasMap = {};
Object.entries(collegeAliases).forEach(([canonical, variations]) => {
  aliasMap[canonical.toLowerCase().trim()] = canonical;
  variations.forEach(variant => {
    aliasMap[variant.toLowerCase().trim()] = canonical;
  });
});

const getCanonicalName = (name) => {
  const normalized = String(name || '').toLowerCase().trim();
  return aliasMap[normalized] || name;
};

const searchableStopWords = new Set([
  "and",
  "of",
  "the",
  "for",
  "at",
  "in",
  "to",
  "a",
  "an",
]);

const normalizeSearchText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSearchTokens = (value = "") =>
  normalizeSearchText(value)
    .split(" ")
    .filter(Boolean);

const compactSearchText = (value = "") => normalizeSearchText(value).replace(/\s+/g, "");

const buildAcronym = (value = "") =>
  getSearchTokens(String(value).split(",")[0])
    .filter((token) => !searchableStopWords.has(token))
    .map((token) => token[0])
    .join("");

const levenshteinDistance = (source = "", target = "") => {
  const a = normalizeSearchText(source);
  const b = normalizeSearchText(target);

  if (!a) return b.length;
  if (!b) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const getAliasVariants = (collegeName = "") => {
  const canonical = getCanonicalName(collegeName);
  const directAliases = collegeAliases[canonical] || [];
  const allVariants = [collegeName, canonical, ...directAliases];

  return Array.from(
    new Set(
      allVariants
        .map((variant) => String(variant || "").trim())
        .filter(Boolean)
    )
  );
};

const scoreMaharashtraCollege = (row, rawQuery = "") => {
  const query = normalizeSearchText(rawQuery);
  if (!query) {
    return 1;
  }

  const aliasVariants = getAliasVariants(row.college_name);
  const normalizedVariants = aliasVariants.map((variant) => normalizeSearchText(variant));
  const compactVariants = aliasVariants.map((variant) => compactSearchText(variant));
  const compactQuery = compactSearchText(query);
  const acronyms = aliasVariants
    .map((variant) => buildAcronym(variant))
    .filter(Boolean);
  const locationFields = [
    row.district,
    row.city,
    row.university_name,
    row.course_category,
    row.college_type,
  ]
    .map((value) => normalizeSearchText(value))
    .filter(Boolean);

  if (normalizedVariants.includes(query) || acronyms.includes(query)) {
    return 1000;
  }

  if (compactQuery && compactVariants.includes(compactQuery)) {
    return 980;
  }

  const acronymTypoMatch = acronyms.some((acronym) => {
    if (!acronym || Math.abs(acronym.length - compactQuery.length) > 1) {
      return false;
    }

    return levenshteinDistance(acronym, compactQuery) <= 1;
  });

  if (acronymTypoMatch) {
    return 930;
  }

  if (normalizedVariants.some((variant) => variant.startsWith(query))) {
    return 850;
  }

  if (compactQuery && compactVariants.some((variant) => variant.startsWith(compactQuery))) {
    return 820;
  }

  if (
    normalizedVariants.some((variant) => variant.includes(query)) ||
    locationFields.some((field) => field.includes(query))
  ) {
    return 720;
  }

  const queryTokens = getSearchTokens(query);
  if (
    queryTokens.length > 0 &&
    normalizedVariants.some((variant) =>
      queryTokens.every((token) => variant.includes(token))
    )
  ) {
    return 650;
  }

  const tokenPrefixScore = normalizedVariants.some((variant) => {
    const variantTokens = getSearchTokens(variant);
    return queryTokens.every((token) =>
      variantTokens.some((candidate) => candidate.startsWith(token))
    );
  });

  if (tokenPrefixScore) {
    return 560;
  }

  const fuzzyTokenMatch =
    queryTokens.length > 0 &&
    normalizedVariants.some((variant) => {
      const variantTokens = getSearchTokens(variant);

      return queryTokens.every((token) =>
        variantTokens.some((candidate) => {
          if (candidate === token || candidate.startsWith(token)) {
            return true;
          }

          if (token.length < 3 || candidate.length < 3) {
            return false;
          }

          return levenshteinDistance(token, candidate) <= 1;
        })
      );
    });

  if (fuzzyTokenMatch) {
    return 540;
  }

  const bestDistance = normalizedVariants.reduce((smallest, variant) => {
    const distance = levenshteinDistance(query, variant);
    return Math.min(smallest, distance);
  }, Number.POSITIVE_INFINITY);

  const bestVariantLength = normalizedVariants.reduce((longest, variant) => {
    if (levenshteinDistance(query, variant) === bestDistance) {
      return variant.length;
    }
    return longest;
  }, 0);

  const maxLength = Math.max(query.length, bestVariantLength);
  const similarity = maxLength > 0 ? 1 - bestDistance / maxLength : 0;

  // More lenient fuzzy matching - allow up to 3 chars difference for longer queries
  const maxAllowedDistance = Math.max(2, Math.ceil(query.length * 0.4));
  
  if (bestDistance <= maxAllowedDistance && query.length >= 2) {
    return 500 + Math.round(similarity * 100);
  }

  // Lower similarity threshold to 60% for queries of 3+ chars
  if (similarity >= 0.6 && query.length >= 3) {
    return 420 + Math.round(similarity * 100);
  }

  // Even more lenient for short queries (2 chars)
  if (query.length === 2 && similarity >= 0.5) {
    return 400 + Math.round(similarity * 100);
  }

  return 0;
};

// District coordinates for distance calculation
const districtCoordinates = {
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Aurangabad': { lat: 19.8762, lng: 75.3433 },
  'Amravati': { lat: 20.9517, lng: 77.7597 },
  'Kolhapur': { lat: 16.7050, lng: 73.7421 },
  'Solapur': { lat: 17.6789, lng: 75.9064 },
  'Satara': { lat: 17.6771, lng: 73.9975 },
  'Sangli': { lat: 16.8621, lng: 74.5814 },
  'Latur': { lat: 18.4088, lng: 76.5283 },
  'Parli': { lat: 18.5476, lng: 76.4476 },
  'Akola': { lat: 20.7136, lng: 77.0084 },
  'Yavatmal': { lat: 20.4089, lng: 78.1353 },
  'Wardha': { lat: 20.7449, lng: 78.6068 },
  'Chandrapur': { lat: 19.2783, lng: 79.2987 },
  'Ratnagiri': { lat: 16.9891, lng: 73.3128 },
  'Sindhudurg': { lat: 16.3969, lng: 73.8181 },
  'Palghar': { lat: 19.6318, lng: 72.7997 },
  'Raigad': { lat: 18.5938, lng: 73.3116 },
};

// Haversine distance formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// ============ MAHARASHTRA SPECIFIC ENDPOINT ============
router.get("/maharashtra/all", async (req, res) => {
  try {
    const { limit = 50, offset = 0, latitude, longitude } = req.query;
    const limitNum = Math.min(Number(limit) || 50, 500);
    const offsetNum = Number(offset) || 0;
    const userLat = Number(latitude);
    const userLng = Number(longitude);
    const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);

    const [rows] = await db.query(`
      SELECT DISTINCT 
        \`Sr.No\` as id,
        \`College Name\` as college_name,
        District as district,
        'Maharashtra' as state,
        Taluka as city,
        University as university_name,
        \`College Type\` as college_type,
        \`Course Category\` as course_category
      FROM maharashtra
      ORDER BY \`College Name\` ASC
    `);

    // Deduplicate by canonical name and add distance
    const collegeMap = new Map();
    rows.forEach(row => {
      const canonical = getCanonicalName(row.college_name);
      const districtCoords = districtCoordinates[row.district] || { lat: 19.0, lng: 73.0 };
      const distance = hasUserLocation ? 
        calculateDistance(userLat, userLng, districtCoords.lat, districtCoords.lng) : 
        null;

      if (!collegeMap.has(canonical)) {
        collegeMap.set(canonical, {
          id: row.id,
          college_name: canonical,
          district: row.district,
          state: row.state,
          city: row.city,
          university_name: row.university_name,
          college_type: row.college_type,
          course_category: row.course_category,
          distance: distance,
        });
      }
    });

    // Sort: by distance (if available), then by college type, then by name
    const sorted = Array.from(collegeMap.values()).sort((a, b) => {
      if (hasUserLocation) {
        if (a.distance !== b.distance) {
          return (a.distance || Infinity) - (b.distance || Infinity);
        }
      }
      if (a.college_type !== b.college_type) {
        return (a.college_type === 'Government' ? -1 : 1);
      }
      return a.college_name.localeCompare(b.college_name);
    });

    const results = sorted.slice(offsetNum, offsetNum + limitNum);
    const [countResult] = await db.query(`SELECT COUNT(DISTINCT \`College Name\`) as total FROM maharashtra`);

    res.json({
      results,
      total: collegeMap.size,
      source: "maharashtra",
      userLocation: hasUserLocation ? { latitude: userLat, longitude: userLng } : null,
    });
  } catch (error) {
    console.error("Maharashtra search error:", error);
    res.json({ results: [], total: 0, error: error.message });
  }
});

// ============ MAHARASHTRA SEARCH ENDPOINT ============
router.get("/maharashtra/search", async (req, res) => {
  try {
    const { query = "", limit = 50, offset = 0, latitude, longitude } = req.query;
    const limitNum = Math.min(Number(limit) || 50, 500);
    const offsetNum = Number(offset) || 0;
    const userLat = Number(latitude);
    const userLng = Number(longitude);
    const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);
    const normalizedQuery = normalizeSearchText(query);

    const [rows] = await db.query(`
      SELECT DISTINCT 
        \`Sr.No\` as id,
        \`College Name\` as college_name,
        District as district,
        'Maharashtra' as state,
        Taluka as city,
        University as university_name,
        \`College Type\` as college_type,
        \`Course Category\` as course_category
      FROM maharashtra
    `);

    // Deduplicate and calculate distance
    const collegeMap = new Map();
    rows.forEach(row => {
      const canonical = getCanonicalName(row.college_name);
      const districtCoords = districtCoordinates[row.district] || { lat: 19.0, lng: 73.0 };
      const distance = hasUserLocation ? 
        calculateDistance(userLat, userLng, districtCoords.lat, districtCoords.lng) : 
        null;
      const scoredRow = {
        id: row.id,
        college_name: canonical,
        district: row.district,
        state: row.state,
        city: row.city,
        university_name: row.university_name,
        college_type: row.college_type,
        course_category: row.course_category,
        distance: distance,
      };
      const searchScore = scoreMaharashtraCollege(scoredRow, normalizedQuery);

      if (normalizedQuery && searchScore <= 0) {
        return;
      }

      if (!collegeMap.has(canonical)) {
        collegeMap.set(canonical, {
          ...scoredRow,
          searchScore,
        });
        return;
      }

      const existing = collegeMap.get(canonical);
      if (
        searchScore > existing.searchScore ||
        (searchScore === existing.searchScore && (distance || Infinity) < (existing.distance || Infinity))
      ) {
        collegeMap.set(canonical, {
          ...scoredRow,
          searchScore,
        });
      }
    });

    // Sort: by match quality, then distance (if available), then by college type, then by name
    const sorted = Array.from(collegeMap.values()).sort((a, b) => {
      if (normalizedQuery && a.searchScore !== b.searchScore) {
        return b.searchScore - a.searchScore;
      }
      if (hasUserLocation) {
        if (a.distance !== b.distance) {
          return (a.distance || Infinity) - (b.distance || Infinity);
        }
      }
      if (a.college_type !== b.college_type) {
        return (a.college_type === 'Government' ? -1 : 1);
      }
      return a.college_name.localeCompare(b.college_name);
    });

    const results = sorted.slice(offsetNum, offsetNum + limitNum);

    res.json({
      results: results.map(({ searchScore, ...college }) => college),
      total: collegeMap.size,
      source: "maharashtra",
      userLocation: hasUserLocation ? { latitude: userLat, longitude: userLng } : null,
    });
  } catch (error) {
    console.error("Maharashtra search error:", error);
    res.json({ results: [], total: 0, error: error.message });
  }
});

// ============ NEW: ACCURATE NEARBY COLLEGES WITH OPENSTREETMAP ============
router.get("/maharashtra/nearby-accurate", async (req, res) => {
  try {
    const { limit = 100, offset = 0, latitude, longitude, radius = 50 } = req.query;
    const limitNum = Math.min(Number(limit) || 100, 500);
    const offsetNum = Number(offset) || 0;
    const userLat = Number(latitude);
    const userLng = Number(longitude);
    const radiusKm = Number(radius) || 50;
    const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);

    if (!hasUserLocation) {
      return res.json({
        results: [],
        total: 0,
        error: "User location is required"
      });
    }

    const [rows] = await db.query(`
      SELECT DISTINCT 
        \`Sr.No\` as id,
        \`College Name\` as college_name,
        District as district,
        'Maharashtra' as state,
        Taluka as city,
        University as university_name,
        \`College Type\` as college_type,
        \`Course Category\` as course_category
      FROM maharashtra
      ORDER BY \`College Name\` ASC
    `);

    // Process colleges with coordinate fetching (limited to avoid timeout)
    const collegeMap = new Map();
    const processedColleges = [];

    for (const row of rows) {
      const canonical = getCanonicalName(row.college_name);
      
      if (collegeMap.has(canonical)) {
        continue; // Skip duplicates
      }

      let coords = null;
      
      // Try to get coordinates from OpenStreetMap cache or fetch
      if (geocodeCache.has(`${row.college_name}::${row.district}::${row.state}`.toLowerCase())) {
        coords = geocodeCache.get(`${row.college_name}::${row.district}::${row.state}`.toLowerCase());
      } else {
        // For performance, only geocode first 500 colleges in batch
        if (processedColleges.length < 500) {
          coords = await geocodeCollegeLocation(row.college_name, row.district, row.state);
          // Add small delay to avoid rate limiting
          if (coords) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
      }

      // Use coordinates or fall back to district center
      const finalCoords = coords || getCollegeCoordinates({
        latitude: null,
        longitude: null,
        district: row.district
      });

      // Calculate distance
      const distance = calculateDistance(userLat, userLng, finalCoords.lat, finalCoords.lng);

      // Only include colleges within radius
      if (distance <= radiusKm) {
        collegeMap.set(canonical, {
          id: row.id,
          college_name: canonical,
          district: row.district,
          state: row.state,
          city: row.city,
          university_name: row.university_name,
          college_type: row.college_type,
          course_category: row.course_category,
          distance: Number(distance).toFixed(2),
          latitude: finalCoords.lat,
          longitude: finalCoords.lng
        });

        processedColleges.push(canonical);
      }
    }

    // Sort by distance (now accurate), then college type, then name
    const sorted = Array.from(collegeMap.values()).sort((a, b) => {
      const distA = Number(a.distance || Infinity);
      const distB = Number(b.distance || Infinity);
      
      if (distA !== distB) {
        return distA - distB;
      }
      
      if (a.college_type !== b.college_type) {
        return (a.college_type === 'Government' ? -1 : 1);
      }
      
      return a.college_name.localeCompare(b.college_name);
    });

    const results = sorted.slice(offsetNum, offsetNum + limitNum);

    res.json({
      results,
      total: collegeMap.size,
      source: "maharashtra-accurate",
      userLocation: { latitude: userLat, longitude: userLng },
      method: "OpenStreetMap Geocoding",
      radius: radiusKm
    });
  } catch (error) {
    console.error("Accurate nearby search error:", error);
    res.json({ results: [], total: 0, error: error.message });
  }
});

module.exports = router;
