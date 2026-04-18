const db = require('../db');

(async () => {
  try {
    // Search for IIT variations
    const [iits] = await db.query(`SELECT DISTINCT college_name FROM colleges WHERE college_name LIKE ? OR college_name LIKE ? LIMIT 20`, ['%IIT%', '%Indian Institute%']);
    console.log('🔍 Found IIT colleges:');
    iits.forEach(r => console.log('  -', r.college_name));
    
    // Search for MITAOE variations
    const [mitaoe] = await db.query(`SELECT DISTINCT college_name FROM colleges WHERE college_name LIKE ? OR college_name LIKE ? OR college_name LIKE ? LIMIT 20`, ['%MITAOE%', '%Marathwada%', '%Alandi%']);
    console.log('\n🔍 Found MITAOE/Alandi colleges:');
    mitaoe.forEach(r => console.log('  -', r.college_name));
    
    // Search for colleges in Bombay/Mumbai
    const [bombay] = await db.query(`SELECT DISTINCT college_name, district, state FROM colleges WHERE district LIKE ? OR city LIKE ? LIMIT 20`, ['%Bombay%', '%Mumbai%']);
    console.log('\n🔍 Found colleges in Mumbai/Bombay:');
    bombay.forEach(r => console.log('  -', r.college_name, 'in', r.district));
    
    // Get stats
    const [stats] = await db.query(`SELECT COUNT(*) as total FROM colleges`);
    console.log('\n📊 Total colleges in legacy table:', stats[0].total);
    
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
