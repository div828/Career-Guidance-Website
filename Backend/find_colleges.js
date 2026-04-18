const db = require('./db');

async function findColleges() {
  try {
    const [rows] = await db.query(
      'SELECT DISTINCT `College Name` FROM maharashtra WHERE `College Name` LIKE ? AND District = ? LIMIT 15',
      ['%Engineering%', 'Pune']
    );
    
    console.log('Engineering colleges in Pune:');
    rows.forEach(r => console.log(' -', r['College Name']));
    
    console.log('\n--- Now searching for MIT ---');
    const [mitRows] = await db.query(
      'SELECT DISTINCT `College Name` FROM maharashtra WHERE `College Name` LIKE ? AND District = ? LIMIT 15',
      ['%MIT%', 'Pune']
    );
    
    console.log('MIT colleges in Pune:');
    mitRows.forEach(r => console.log(' -', r['College Name']));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findColleges();
