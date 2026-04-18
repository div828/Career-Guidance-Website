const db = require('../db');

(async () => {
  try {
    console.log('🔧 Fixing database issues...\n');

    // Fix MITAOE coordinates to Alandi (not Pune)
    const alandiCoords = { lat: 18.6397, lng: 73.8997 };
    
    const [mitUpdate] = await db.query(
      `UPDATE colleges_directory SET latitude = ?, longitude = ? 
       WHERE college_name LIKE ?`,
      [alandiCoords.lat, alandiCoords.lng, '%MIT Academy%Alandi%']
    );
    console.log(`✅ Updated ${mitUpdate.affectedRows} MITAOE entries with Alandi coordinates`);

    // Insert top IITs with proper coordinates
    const topIITs = [
      {
        name: 'Indian Institute of Technology Bombay',
        shortName: 'IIT BOMBAY',
        city: 'Mumbai',
        district: 'Mumbai',
        state: 'Maharashtra',
        lat: 19.1136,
        lng: 72.9142,
        type: 'Government',
        rating: 5.0,
      },
      {
        name: 'Indian Institute of Technology Delhi',
        shortName: 'IIT DELHI',
        city: 'Delhi',
        district: 'Delhi',
        state: 'Delhi',
        lat: 28.5461,
        lng: 77.1959,
        type: 'Government',
        rating: 5.0,
      },
      {
        name: 'Indian Institute of Technology Madras',
        shortName: 'IIT MADRAS',
        city: 'Chennai',
        district: 'Chengalpattu',
        state: 'Tamil Nadu',
        lat: 12.9716,
        lng: 80.2305,
        type: 'Government',
        rating: 5.0,
      },
      {
        name: 'Indian Institute of Technology Kanpur',
        shortName: 'IIT KANPUR',
        city: 'Kanpur',
        district: 'Kanpur',
        state: 'Uttar Pradesh',
        lat: 26.5124,
        lng: 80.2329,
        type: 'Government',
        rating: 5.0,
      },
      {
        name: 'Indian Institute of Technology Kharagpur',
        shortName: 'IIT KHARAGPUR',
        city: 'Kharagpur',
        district: 'Medinipur',
        state: 'West Bengal',
        lat: 22.3046,
        lng: 87.3185,
        type: 'Government',
        rating: 5.0,
      },
      {
        name: 'Indian Institute of Technology Roorkee',
        shortName: 'IIT ROORKEE',
        city: 'Roorkee',
        district: 'Haridwar',
        state: 'Uttarakhand',
        lat: 29.8686,
        lng: 77.8981,
        type: 'Government',
        rating: 5.0,
      },
      {
        name: 'Indian Institute of Technology Guwahati',
        shortName: 'IIT GUWAHATI',
        city: 'Guwahati',
        district: 'Kamrup',
        state: 'Assam',
        lat: 26.1917,
        lng: 91.6868,
        type: 'Government',
        rating: 4.9,
      },
      {
        name: 'National Institute of Technology Trichy',
        shortName: 'NIT TRICHY',
        city: 'Tiruchirappalli',
        district: 'Tiruchchirappalli',
        state: 'Tamil Nadu',
        lat: 11.0258,
        lng: 79.0882,
        type: 'Government',
        rating: 4.8,
      },
    ];

    console.log('\n🔄 Inserting top IITs and NITs...');
    
    for (const iit of topIITs) {
      try {
        // Check if already exists
        const [existing] = await db.query(
          'SELECT id FROM colleges_directory WHERE college_name LIKE ?',
          [`%${iit.shortName}%`]
        );

        if (existing.length === 0) {
          // Insert new
          await db.query(
            `INSERT INTO colleges_directory 
             (college_name, city, district, state, latitude, longitude, college_type, rating, source)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [iit.name, iit.city, iit.district, iit.state, iit.lat, iit.lng, iit.type, iit.rating, 'manual']
          );
          console.log(`✅ Inserted ${iit.shortName}`);
        } else {
          // Update if exists
          await db.query(
            `UPDATE colleges_directory SET 
             latitude = ?, longitude = ?, college_type = ?, rating = ?, city = ?, district = ?
             WHERE college_name LIKE ?`,
            [iit.lat, iit.lng, iit.type, iit.rating, iit.city, iit.district, `%${iit.shortName}%`]
          );
          console.log(`✅ Updated ${iit.shortName}`);
        }
      } catch (err) {
        console.error(`❌ Error with ${iit.shortName}:`, err.message);
      }
    }

    // Verify the changes
    console.log('\n📊 Verification:');
    
    const [mitCheck] = await db.query(
      'SELECT college_name, latitude, longitude FROM colleges_directory WHERE college_name LIKE ? LIMIT 1',
      ['%MIT Academy%Alandi%']
    );
    if (mitCheck.length > 0) {
      console.log(`✅ MITAOE now at: (${mitCheck[0].latitude}, ${mitCheck[0].longitude})`);
    }

    const [iitCheck] = await db.query(
      'SELECT college_name, college_type, rating FROM colleges_directory WHERE college_type = \"Government\" AND rating >= 4.9 ORDER BY rating DESC LIMIT 10'
    );
    console.log(`✅ Found ${iitCheck.length} top government colleges`);
    iitCheck.slice(0, 5).forEach((c, i) => {
      console.log(`   ${i+1}. ${c.college_name.substring(0, 30)}... (Rating: ${c.rating})`);
    });

    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
