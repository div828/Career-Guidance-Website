const db = require('../db');

(async () => {
  try {
    console.log('🔍 Checking maharashtra table...\n');

    // Get count
    const [count] = await db.query('SELECT COUNT(*) as cnt FROM maharashtra');
    console.log(`📚 maharashtra table: ${count[0].cnt} records`);

    // Get structure
    const [info] = await db.query('DESCRIBE maharashtra');
    console.log('\nColumns in maharashtra table:');
    info.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Sample data
    console.log('\nSample data:');
    const [samples] = await db.query('SELECT * FROM maharashtra LIMIT 3');
    console.log(JSON.stringify(samples, null, 2));

    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
