const db = require('./db');

async function checkMaharashtra() {
  try {
    const [rows] = await db.query('SELECT college_name, district, state, city FROM colleges_directory WHERE state = ? LIMIT 30', ['Maharashtra']);
    console.log('Maharashtra colleges found:', rows.length);
    if (rows.length > 0) {
      console.log('Sample colleges:');
      rows.forEach((col, idx) => {
        console.log(`${idx + 1}. ${col.college_name} - ${col.district}, ${col.state}`);
      });
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkMaharashtra();
