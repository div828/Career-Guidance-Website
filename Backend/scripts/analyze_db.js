const db = require('../db');

(async () => {
  try {
    console.log('📊 Analyzing Database Collections...\n');

    // Get all tables in database
    const [tables] = await db.query("SHOW TABLES");
    console.log('Tables in database:');
    tables.forEach(t => {
      const tableName = Object.values(t)[0];
      console.log(`  - ${tableName}`);
    });

    // Check colleges table
    const [collegesCount] = await db.query('SELECT COUNT(*) as cnt FROM colleges');
    console.log(`\n📚 colleges table: ${collegesCount[0].cnt} records`);

    // Check colleges_directory table
    const [dirCount] = await db.query('SELECT COUNT(*) as cnt FROM colleges_directory');
    console.log(`📚 colleges_directory table: ${dirCount[0].cnt} records`);

    // Check for other college-related tables
    const [otherTables] = await db.query("SHOW TABLES LIKE '%college%'");
    if (otherTables.length > 0) {
      console.log(`\n🔍 Other college tables found:`);
      for (const t of otherTables) {
        const tableName = Object.values(t)[0];
        const [count] = await db.query(`SELECT COUNT(*) as cnt FROM ${tableName}`);
        console.log(`  - ${tableName}: ${count[0].cnt} records`);
      }
    }

    // Sample data from colleges_directory
    console.log('\n📋 Sample from colleges_directory:');
    const [samples] = await db.query('SELECT college_name, college_type, city, district FROM colleges_directory LIMIT 5');
    samples.forEach(s => {
      console.log(`  - ${s.college_name} (${s.college_type}) in ${s.city}, ${s.district}`);
    });

    // Get all colleges by state
    console.log('\n🗺️ Colleges by State:');
    const [byState] = await db.query(`
      SELECT state, COUNT(*) as cnt FROM colleges_directory 
      WHERE state IS NOT NULL AND state != '' 
      GROUP BY state 
      ORDER BY cnt DESC 
      LIMIT 15
    `);
    byState.forEach(s => {
      console.log(`  - ${s.state}: ${s.cnt} colleges`);
    });

    // Get all colleges by type
    console.log('\n🏛️ Colleges by Type:');
    const [byType] = await db.query(`
      SELECT college_type, COUNT(*) as cnt FROM colleges_directory 
      GROUP BY college_type 
      ORDER BY cnt DESC
    `);
    byType.forEach(t => {
      console.log(`  - ${t.college_type}: ${t.cnt} colleges`);
    });

    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
