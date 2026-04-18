const db = require("../db");

// Map of top Indian colleges to their correct types
const topColleges = {
  "IIT BOMBAY": "Government",
  "IIT DELHI": "Government",
  "IIT MADRAS": "Government",
  "IIT KANPUR": "Government",
  "IIT KHARAGPUR": "Government",
  "IIT ROORKEE": "Government",
  "IIT GUWAHATI": "Government",
  "NIT TRICHY": "Government",
  "NIT SURATHKAL": "Government",
  "MITAOE": "Private",
  "MANIPAL ACADEMY": "Private",
  "BITS PILANI": "Private",
  "VIT VELLORE": "Private",
  "CHITKARA UNIVERSITY": "Private",
  "LPU": "Private",
  "AMITY UNIVERSITY": "Private",
};

const updateCollegeTypes = async () => {
  try {
    console.log("🔄 Updating top colleges with correct college types...");

    for (const [collegeName, collegeType] of Object.entries(topColleges)) {
      try {
        // First try to update in colleges_directory
        const [dirResult] = await db.query(
          `UPDATE colleges_directory SET college_type = ? WHERE LOWER(college_name) LIKE ?`,
          [collegeType, `%${collegeName.toLowerCase()}%`]
        );

        if (dirResult.affectedRows > 0) {
          console.log(`✅ Updated ${dirResult.affectedRows} ${collegeName} entry(ies) in colleges_directory`);
        }

        // Also update in legacy colleges table
        const [legacyResult] = await db.query(
          `UPDATE colleges SET college_type = ? WHERE LOWER(college_name) LIKE ?`,
          [collegeType, `%${collegeName.toLowerCase()}%`]
        );

        if (legacyResult.affectedRows > 0) {
          console.log(`✅ Updated ${legacyResult.affectedRows} ${collegeName} entry(ies) in colleges table`);
        }
      } catch (err) {
        console.error(`❌ Error updating ${collegeName}:`, err.message);
      }
    }

    // Now ensure MITAOE exists with proper coordinates
    console.log("\n🔍 Checking MITAOE coordinates in Alandi...");
    const [mitaoe] = await db.query(
      `SELECT * FROM colleges_directory WHERE LOWER(college_name) LIKE '%mitaoe%'`
    );

    if (mitaoe.length > 0) {
      console.log(`✅ Found MITAOE in colleges_directory:`);
      mitaoe.forEach(m => {
        console.log(`   - ${m.college_name} at (${m.latitude}, ${m.longitude}) in ${m.city}, ${m.district}`);
      });
    } else {
      console.log("❌ MITAOE not found in colleges_directory");
    }

    // Check IIT BOMBAY
    console.log("\n🔍 Checking IIT BOMBAY in colleges_directory...");
    const [iitBombay] = await db.query(
      `SELECT * FROM colleges_directory WHERE LOWER(college_name) LIKE '%iit%bombay%'`
    );

    if (iitBombay.length > 0) {
      console.log(`✅ Found IIT BOMBAY in colleges_directory:`);
      iitBombay.forEach(i => {
        console.log(`   - ${i.college_name} (Type: ${i.college_type}) at (${i.latitude}, ${i.longitude})`);
        console.log(`   - City: ${i.city}, District: ${i.district}, State: ${i.state}`);
      });
    } else {
      console.log("❌ IIT BOMBAY not found in colleges_directory");
      
      // Try to find it in legacy table
      const [legacyIIT] = await db.query(
        `SELECT * FROM colleges WHERE LOWER(college_name) LIKE '%iit%bombay%' LIMIT 5`
      );
      if (legacyIIT.length > 0) {
        console.log("   Found in legacy colleges table, need to re-run populate_coordinates.js");
        legacyIIT.forEach(i => {
          console.log(`   - ${i.college_name}`);
        });
      }
    }

    // Get top 10 colleges ordered by government type and rating
    console.log("\n📊 Top 10 colleges (by type and rating):");
    const [topTen] = await db.query(
      `SELECT college_name, college_type, rating, city, district FROM colleges_directory 
       ORDER BY CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END, rating DESC, college_name ASC
       LIMIT 10`
    );
    
    topTen.forEach((c, idx) => {
      console.log(`${idx + 1}. ${c.college_name} (${c.college_type}) - Rating: ${c.rating} - ${c.city}, ${c.district}`);
    });

    console.log("\n✅ Update process completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during update:", error.message);
    process.exit(1);
  }
};

updateCollegeTypes();
