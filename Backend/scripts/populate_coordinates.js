const db = require("../db");

// Approximate coordinates for major Indian cities/districts
const cityCoordinates = {
  // Maharashtra
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "pune": { lat: 18.5204, lng: 73.8567 },
  "alandi": { lat: 18.6397, lng: 73.8997 },
  "kolhapur": { lat: 16.7050, lng: 74.2433 },
  "sangli": { lat: 16.8554, lng: 74.5745 },
  "osmananad": { lat: 17.3710, lng: 76.0856 },

  // Delhi & NCR
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "new delhi": { lat: 28.5355, lng: 77.3910 },
  "noida": { lat: 28.5921, lng: 77.3971 },
  "gurgaon": { lat: 28.4595, lng: 77.0266 },

  // Karnataka
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  "mysore": { lat: 12.2958, lng: 76.6394 },
  "mangalore": { lat: 12.8628, lng: 74.8455 },
  "belagavi": { lat: 15.8497, lng: 74.4977 },

  // Tamil Nadu
  "chennai": { lat: 13.0827, lng: 80.2707 },
  "coimbatore": { lat: 11.0081, lng: 76.9959 },
  "madurai": { lat: 9.9252, lng: 78.1198 },

  // Uttar Pradesh
  "lucknow": { lat: 26.8467, lng: 80.9462 },
  "kanpur": { lat: 26.4499, lng: 80.3319 },
  "varanasi": { lat: 25.3200, lng: 82.9789 },
  "agra": { lat: 27.1767, lng: 78.0081 },

  // West Bengal
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "darjeeling": { lat: 27.0410, lng: 88.2663 },

  // Gujarat
  "ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "surat": { lat: 21.1702, lng: 72.8311 },
  "vadodara": { lat: 22.3072, lng: 73.1812 },

  // Rajasthan
  "jaipur": { lat: 26.9124, lng: 75.7873 },
  "udaipur": { lat: 24.5854, lng: 73.7125 },

  // Telangana & Andhra Pradesh
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  "vijayawada": { lat: 16.5062, lng: 80.6480 },

  // Punjab
  "chandigarh": { lat: 30.7333, lng: 76.7794 },
  "ludhiana": { lat: 30.9010, lng: 75.8573 },

  // Haryana
  "faridabad": { lat: 28.4089, lng: 77.3178 },

  // Himachal Pradesh
  "shimla": { lat: 31.7743, lng: 77.1277 },

  // Kerala
  "kochi": { lat: 9.9312, lng: 76.2673 },
  "thiruvananthapuram": { lat: 8.5241, lng: 76.9366 },
};

const getCoordinatesForCity = (city, district, state) => {
  if (!city && !district) return null;

  const searchStrings = [
    city?.toLowerCase().trim(),
    district?.toLowerCase().trim(),
  ].filter(Boolean);

  for (const searchStr of searchStrings) {
    if (cityCoordinates[searchStr]) {
      return cityCoordinates[searchStr];
    }
  }

  // Default to Delhi if no match
  return cityCoordinates["delhi"];
};

const populateCoordinates = async () => {
  try {
    console.log("🔄 Starting to populate colleges_directory with coordinates...");

    // First, check if colleges_directory table exists
    const [tables] = await db.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'colleges_directory'"
    );

    if (tables.length === 0) {
      console.log("❌ colleges_directory table not found. Creating it...");
      // Create the table using the schema
      const schemaSQL = `
        CREATE TABLE IF NOT EXISTS colleges_directory (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          aishe_code VARCHAR(64) NULL,
          college_name VARCHAR(255) NOT NULL,
          university_name VARCHAR(255) NULL,
          college_type VARCHAR(120) NULL,
          management_type VARCHAR(120) NULL,
          course_category VARCHAR(120) NULL,
          city VARCHAR(120) NULL,
          district VARCHAR(120) NULL,
          state VARCHAR(120) NULL,
          pincode VARCHAR(20) NULL,
          address TEXT NULL,
          website_url VARCHAR(255) NULL,
          phone VARCHAR(80) NULL,
          email VARCHAR(180) NULL,
          latitude DECIMAL(10, 7) NULL,
          longitude DECIMAL(10, 7) NULL,
          rating DECIMAL(3, 1) NULL,
          nirf_rank INT NULL,
          source VARCHAR(120) NOT NULL DEFAULT 'MIGRATED',
          source_url VARCHAR(255) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_colleges_directory_name (college_name),
          KEY idx_colleges_directory_city (city),
          KEY idx_colleges_directory_district (district),
          KEY idx_colleges_directory_state (state),
          KEY idx_colleges_directory_location (latitude, longitude)
        )
      `;
      await db.query(schemaSQL);
      console.log("✅ colleges_directory table created.");
    }

    // Get all colleges from the old table
    const [colleges] = await db.query("SELECT * FROM colleges");
    console.log(`📚 Found ${colleges.length} colleges to migrate.`);

    // Use a Set to track unique college names to avoid duplicates
    const processedNames = new Set();
    let inserted = 0;
    let skipped = 0;

    for (const college of colleges) {
      const collegeKey = college.college_name?.toLowerCase().trim();

      // Skip if already processed (avoid duplicates)
      if (processedNames.has(collegeKey)) {
        skipped++;
        continue;
      }

      processedNames.add(collegeKey);

      // Get coordinates for this college's city/district
      const coords = getCoordinatesForCity(
        college.city,
        college.district,
        college.state
      );

      // Insert into colleges_directory
      const insertSQL = `
        INSERT INTO colleges_directory (
          college_name,
          university_name,
          college_type,
          course_category,
          city,
          district,
          state,
          address,
          latitude,
          longitude,
          rating,
          source,
          source_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          latitude = VALUES(latitude),
          longitude = VALUES(longitude),
          updated_at = CURRENT_TIMESTAMP
      `;

      const params = [
        college.college_name || "Unknown College",
        college.university || "",
        college.college_type || "Private",
        college.course_category || "",
        college.city || "",
        college.district || "",
        college.state || "",
        college.address || "",
        coords?.lat || 28.6139,
        coords?.lng || 77.2090,
        college.rating || 4.0,
        "MIGRATED",
        "",
      ];

      try {
        await db.query(insertSQL, params);
        inserted++;

        if (inserted % 100 === 0) {
          console.log(`✅ Processed ${inserted} colleges...`);
        }
      } catch (error) {
        if (!error.message.includes("Duplicate entry")) {
          console.error(`Error inserting college ${college.college_name}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Completed!`);
    console.log(`   📍 Inserted: ${inserted}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`\nThe nearby colleges feature is now ready to use!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating coordinates:", error);
    process.exit(1);
  }
};

populateCoordinates();
