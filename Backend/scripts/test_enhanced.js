(async () => {
  console.log('🧪 Testing Enhanced Search Endpoints\n');

  // Test 1: Get ALL colleges in Karnataka
  console.log('1️⃣ Finding ALL colleges in Karnataka...');
  let response = await fetch('http://localhost:5000/api/search-all/by-location?state=Karnataka&limit=1000');
  let data = await response.json();
  console.log(`   ✅ Found ${data.results?.length} colleges`);
  console.log(`   Total unique: ${data.total}`);
  if (data.results?.length > 0) {
    console.log(`   First 3:`);
    data.results.slice(0, 3).forEach((c, i) => {
      console.log(`     ${i+1}. ${c.college_name} (${c.college_type}) - ${c.city}, ${c.district}`);
    });
  }

  // Test 2: Search ALL colleges by keyword
  console.log('\n2️⃣ Searching all colleges containing "engineering"...');
  response = await fetch('http://localhost:5000/api/search-all/all-colleges?search=engineering&limit=500');
  data = await response.json();
  console.log(`   ✅ Found ${data.results?.length} colleges`);
  console.log(`   Total unique: ${data.total}`);
  if (data.results?.length > 0) {
    console.log(`   First 3:`);
    data.results.slice(0, 3).forEach((c, i) => {
      console.log(`     ${i+1}. ${c.college_name} (${c.college_type})`);
    });
  }

  // Test 3: Search Maharashtra colleges
  console.log('\n3️⃣ Searching ALL Maharashtra colleges...');
  response = await fetch('http://localhost:5000/api/search-all/by-location?state=Maharashtra&limit=1000');
  data = await response.json();
  console.log(`   ✅ Found ${data.results?.length} colleges`);
  console.log(`   Total unique: ${data.total}`);
  console.log(`   Sources present: ${data.results?.length > 0 ? [...new Set(data.results.map(c => c.source))].join(', ') : 'N/A'}`);

  // Test 4: Get ALL nearby colleges for Alandi (large radius)
  console.log('\n4️⃣ Finding ALL colleges within 100km of Alandi...');
  response = await fetch('http://localhost:5000/api/search-all/all-nearby', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: 18.6397,
      longitude: 73.8997,
      radiusKm: 100,
      limit: 10000
    })
  });
  data = await response.json();
  console.log(`   ✅ Found ${data.results?.length} colleges`);
  if (data.results?.length > 0) {
    console.log(`   Top 5 by distance:`);
    data.results.slice(0, 5).forEach((c, i) => {
      const dist = c.distance ? ` (${c.distance.toFixed(2)}km)` : '';
      console.log(`     ${i+1}. ${c.college_name}${dist}`);
    });
  }

  // Test 5: Get colleges in a specific district
  console.log('\n5️⃣ Finding all colleges in Pune district...');
  response = await fetch('http://localhost:5000/api/search-all/by-location?district=Pune&limit=1000');
  data = await response.json();
  console.log(`   ✅ Found ${data.results?.length} colleges`);
  console.log(`   Total unique: ${data.total}`);
  if (data.results?.length > 0) {
    // Count by type
    const byType = {};
    data.results.forEach(c => {
      byType[c.college_type] = (byType[c.college_type] || 0) + 1;
    });
    console.log(`   By Type:`);
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`     - ${type}: ${count}`);
    });
  }

  console.log('\n✅ Enhanced search tests completed!');
  process.exit(0);
})();
