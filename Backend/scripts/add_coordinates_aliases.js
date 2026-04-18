const db = require('../db');

const collegeAliases = {
  'COEP': ['College of Engineering, Pune', 'COEP Pune', 'Pune College of Engineering'],
  'MITAOE': ['MIT Academy of Engineering', 'Pune MIT Academy', 'MIT Academy'],
  'IIT Bombay': ['Indian Institute of Technology Bombay', 'IIT B', 'IITB'],
  'PCCOE': ['Pimpri Chinchwad College of Engineering', 'PCCOE Pune'],
  'VIT': ['Vellore Institute of Technology', 'VIT Vellore'],
  'DTU': ['Delhi Technological University', 'Delhi University of Technology'],
  'NIT': ['National Institute of Technology'],
};

// Flatten aliases to create a map of all variations to canonical name
const aliasMap = {};
Object.entries(collegeAliases).forEach(([canonical, variations]) => {
  aliasMap[canonical.toLowerCase()] = canonical;
  variations.forEach(variant => {
    aliasMap[variant.toLowerCase()] = canonical;
  });
});

async function addCoordinatesAndDeduplicate() {
  try {
    console.log('Adding latitude and longitude columns to maharashtra table...');
    
    // Add latitude column
    try {
      await db.query(`ALTER TABLE maharashtra ADD COLUMN latitude DECIMAL(10, 7) NULL`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }
    
    // Add longitude column
    try {
      await db.query(`ALTER TABLE maharashtra ADD COLUMN longitude DECIMAL(10, 7) NULL`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }
    
    // Add canonical_name column
    try {
      await db.query(`ALTER TABLE maharashtra ADD COLUMN canonical_name VARCHAR(255) NULL`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) throw e;
    }
    
    console.log('✓ Columns added');
    
    // Get all unique colleges with their districts
    const [colleges] = await db.query(`
      SELECT DISTINCT \`College Name\`, District FROM maharashtra
    `);
    
    console.log(`Found ${colleges.length} unique colleges`);
    
    // Sample coordinates for major cities in Maharashtra
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

    let updated = 0;
    
    for (const college of colleges) {
      const coords = districtCoordinates[college.District] || { lat: 18.5, lng: 73.5 };
      const canonical = aliasMap[college['College Name'].toLowerCase()] || college['College Name'];
      
      await db.query(`
        UPDATE maharashtra 
        SET latitude = ?, longitude = ?, canonical_name = ?
        WHERE \`College Name\` = ? AND District = ?
      `, [coords.lat, coords.lng, canonical, college['College Name'], college.District]);
      
      updated++;
      if (updated % 100 === 0) process.stdout.write(`\rUpdated: ${updated}/${colleges.length}`);
    }
    
    console.log(`\n✓ Updated ${updated} colleges with coordinates and aliases`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addCoordinatesAndDeduplicate();
