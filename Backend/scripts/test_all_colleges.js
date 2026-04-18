const mysql = require('mysql2/promise');

// Test script to verify ALL colleges are returned with new 100000 limit

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'divya@2004',
  database: 'college_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testAllColleges() {
  console.log('\n📚 TEST: SHOW ALL COLLEGES (100000 limit)\n');
  
  try {
    // Test 1: Count total colleges in databases
    console.log('1️⃣ Counting total colleges in all tables...');
    const connection = await pool.getConnection();
    
    const [dirCount] = await connection.query('SELECT COUNT(*) as count FROM colleges_directory');
    const [mahCount] = await connection.query('SELECT COUNT(*) as count FROM maharashtra');
    const [legacyCount] = await connection.query('SELECT COUNT(*) as count FROM colleges');
    
    const totalDir = dirCount[0].count;
    const totalMah = mahCount[0].count;
    const totalLegacy = legacyCount[0].count;
    
    console.log(`✅ colleges_directory: ${totalDir} colleges`);
    console.log(`✅ maharashtra: ${totalMah} colleges`);
    console.log(`✅ colleges (legacy): ${totalLegacy} colleges`);
    console.log(`📊 Total Available: ${totalDir + totalMah + totalLegacy} colleges\n`);

    // Test 2: Simulate backend endpoint - get all colleges
    console.log('2️⃣ Simulating /api/search-all/all-colleges with limit=100000...');
    const pageLimit = 100000;
    
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
      ORDER BY 
        CASE WHEN college_type = 'Government' THEN 0 ELSE 1 END,
        rating DESC,
        college_name ASC
      LIMIT ? OFFSET ?
    `;
    
    const [dirResults] = await connection.query(dirSql, [pageLimit, 0]);

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
      ORDER BY 
        CASE WHEN \`College Type\` = 'Government' THEN 0 ELSE 1 END,
        \`College Name\` ASC
      LIMIT ? OFFSET ?
    `;

    const [mahResults] = await connection.query(mahSql, [pageLimit, 0]);

    console.log(`✅ From colleges_directory: ${dirResults.length} colleges returned`);
    console.log(`✅ From maharashtra table: ${mahResults.length} colleges returned`);

    // Test 3: Combine and deduplicate
    console.log('\n3️⃣ Combining and deduplicating...');
    const combined = [...dirResults, ...mahResults];
    const unique = new Map();
    
    combined.forEach(col => {
      const key = `${col.college_name}::${col.district || 'Unknown'}`.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, col);
      }
    });

    const results = Array.from(unique.values()).slice(0, pageLimit);

    console.log(`✅ After deduplication: ${results.length} UNIQUE colleges to show`);

    // Test 4: Show breakdown
    console.log('\n4️⃣ Colleges by Type:');
    const typeCount = {};
    results.forEach(col => {
      const type = col.college_type || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    Object.entries(typeCount).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
      console.log(`   • ${type}: ${count}`);
    });

    // Test 5: Show by state
    console.log('\n5️⃣ Top 10 States by College Count:');
    const stateCount = {};
    results.forEach(col => {
      const state = col.state || 'Unknown';
      stateCount[state] = (stateCount[state] || 0) + 1;
    });
    
    Object.entries(stateCount).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([state, count]) => {
      console.log(`   • ${state}: ${count}`);
    });

    // Test 6: Government colleges count
    console.log('\n6️⃣ Government Colleges:');
    const govColleges = results.filter(c => c.college_type === 'Government');
    console.log(`✅ Total Government Colleges: ${govColleges.length}`);
    govColleges.slice(0, 5).forEach((col, idx) => {
      console.log(`   ${idx + 1}. ${col.college_name} (${col.state}, Rating: ${col.rating})`);
    });

    // Test 7: Test nearby search (200km radius)
    console.log('\n7️⃣ Testing Nearby Colleges (200km radius from Alandi)...');
    const lat = 18.6397;
    const lng = 73.8997;
    const radius = 200;

    const haversineSql = `
      (
        6371 * ACOS(
          COS(RADIANS(${lat})) *
          COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(${lng})) +
          SIN(RADIANS(${lat})) *
          SIN(RADIANS(latitude))
        )
      )
    `;

    const nearbyDirSql = `
      SELECT
        college_name,
        state,
        district,
        city,
        college_type,
        rating,
        latitude,
        longitude,
        ${haversineSql} AS distance,
        'directory' as source
      FROM colleges_directory
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance <= ${radius}
      ORDER BY distance ASC
      LIMIT 100000
    `;

    const [nearbyDir] = await connection.query(nearbyDirSql);
    
    console.log(`✅ Nearby colleges from directory (${radius}km): ${nearbyDir.length}`);
    
    if (nearbyDir.length > 0) {
      console.log('\n   Top 5 Nearest Colleges:');
      nearbyDir.slice(0, 5).forEach((col, idx) => {
        console.log(`   ${idx + 1}. ${col.college_name} - ${col.distance.toFixed(2)}km away (${col.district})`);
      });
    }

    // Test 8: Overall summary
    console.log('\n✅ SUMMARY:');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 Total Colleges Retrievable: ${results.length}`);
    console.log(`🏆 Government Colleges: ${govColleges.length}`);
    console.log(`📍 States Covered: ${Object.keys(stateCount).length}`);
    console.log(`🎓 College Types: ${Object.keys(typeCount).length} categories`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    connection.release();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

testAllColleges();
