const db = require('../db');

(async () => {
  try {
    // Check if MITAOE is in colleges_directory
    const [mitAoe] = await db.query(
      'SELECT * FROM colleges_directory WHERE college_name LIKE ?',
      ['%MIT%Alandi%']
    );
    console.log('🔍 MIT Academy in colleges_directory:', mitAoe.length > 0 ? '✅ Found' : '❌ Not Found');
    if (mitAoe.length > 0) {
      mitAoe.forEach(m => {
        console.log(`  - ${m.college_name} at (${m.latitude}, ${m.longitude})`);
        console.log(`    Type: ${m.college_type}, Rating: ${m.rating}`);
      });
    }
    
    // Check in legacy table  
    const [legacyMit] = await db.query(
      'SELECT * FROM colleges WHERE college_name LIKE ?',
      ['%MIT%Alandi%']
    );
    console.log('\n🔍 MIT Academy in colleges table:', legacyMit.length > 0 ? '✅ Found' : '❌ Not Found');
    if (legacyMit.length > 0) {
      legacyMit.forEach(m => {
        console.log(`  - ${m.college_name}`);
        console.log(`    District: ${m.district || 'N/A'}, State: ${m.state || 'N/A'}`);
      });
    }
    
    console.log('\n📊 Database Summary:');
    const [legacyCount] = await db.query('SELECT COUNT(*) as cnt FROM colleges');
    const [dirCount] = await db.query('SELECT COUNT(*) as cnt FROM colleges_directory');
    console.log(`  - Legacy colleges table: ${legacyCount[0].cnt} colleges`);
    console.log(`  - New colleges_directory: ${dirCount[0].cnt} colleges`);
    
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
