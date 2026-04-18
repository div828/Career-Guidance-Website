const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'divya@2004',
  database: 'college_db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  authPlugins: {
    mysql_clear_password: () => () => 'divya@2004'
  }
});

async function diagnose() {
  console.log('\n🔍 DIAGNOSING COLLEGE DATA\n');
  
  try {
    const connection = await pool.getConnection();
    
    // Count in directory
    const [dirCount] = await connection.query(`SELECT COUNT(*) as cnt FROM colleges_directory`);
    console.log(`📚 colleges_directory total: ${dirCount[0].cnt}`);

    // Count in maharashtra
    const [mahCount] = await connection.query(`SELECT COUNT(*) as cnt FROM maharashtra`);
    console.log(`📚 maharashtra total: ${mahCount[0].cnt}`);

    // Count states in directory
    const [states] = await connection.query(`SELECT state, COUNT(*) as cnt FROM colleges_directory GROUP BY state ORDER BY cnt DESC LIMIT 10`);
    console.log(`\n📍 Top 10 States in Directory:`);
    states.forEach(s => console.log(`   ${s.state}: ${s.cnt}`));

    // Check if any directory colleges are from Maharashtra
    const [dirMah] = await connection.query(`SELECT COUNT(*) as cnt FROM colleges_directory WHERE state = 'Maharashtra'`);
    console.log(`\n📚 Maharashtra colleges in directory: ${dirMah[0].cnt}`);

    // Check maharashtra-only colleges (simulating the filter)
    const [mahOnly] = await connection.query(`
      SELECT COUNT(*) as cnt FROM maharashtra mah
      WHERE NOT EXISTS (
        SELECT 1 FROM colleges_directory dir
        WHERE LOWER(dir.college_name) = LOWER(mah.\`College Name\`)
        AND LOWER(dir.district) = LOWER(mah.District)
      )
    `);
    console.log(`📚 Maharashtra colleges NOT in directory: ${mahOnly[0].cnt}`);

    // Sample check
    const [sample] = await connection.query(`
      SELECT \`College Name\`, District FROM maharashtra LIMIT 3
    `);
    console.log(`\n📋 Sample colleges from maharashtra table:`);
    sample.forEach(s => console.log(`   - ${s['College Name']} (${s.District})`));

    console.log(`\n✅ Total unique colleges potentially available: ${dirCount[0].cnt + (mahOnly[0].cnt || 0)}`);

    connection.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

diagnose();
