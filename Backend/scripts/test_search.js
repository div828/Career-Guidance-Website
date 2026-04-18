const http = require('http');

const testSearches = [
  { type: 'test', name: 'Search for IIT BOMBAY', query: '/search?query=IIT BOMBAY' },
  { type: 'test', name: 'Search for MITAOE', query: '/search?query=MITAOE' },
  { type: 'test', name: 'Search for MIT Alandi', query: '/search?query=MIT Academy Alandi' },
  { type: 'test', name: 'Show All India Colleges', query: '/search?limit=15' },
  { type: 'smart', name: 'Nearby colleges to Alandi', query: '/search/smart', body: {
    latitude: 18.6397,
    longitude: 73.8997,
    radiusKm: 50,
    limit: 10
  }},
];

async function runTests() {
  console.log('🧪 Testing college search endpoints...\n');

  for (const test of testSearches) {
    try {
      console.log(`📍 ${test.name}`);
      
      if (test.type === 'test') {
        // GET request
        const url = `http://localhost:5000${test.query}`;
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`   ✅ Found ${data.results.length} results`);
        if (data.results.length > 0) {
          const first = data.results[0];
          console.log(`   First: ${first.college_name} (${first.college_type || 'N/A'})`);
        }
      } else if (test.type === 'smart') {
        // POST request
        const response = await fetch(`http://localhost:5000${test.query}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(test.body)
        });
        const data = await response.json();
        
        console.log(`   ✅ Found ${data.results.length} results`);
        if (data.results.length > 0) {
          data.results.slice(0, 3).forEach((c, i) => {
            const dist = c.distance ? ` (${c.distance}km away)` : '';
            console.log(`     ${i+1}. ${c.college_name}${dist}`);
          });
        }
      }
      
      console.log();
    } catch (err) {
      console.error(`   ❌ Error:`, err.message);
      console.log();
    }
  }

  console.log('✅ Tests completed!');
  process.exit(0);
}

runTests();
