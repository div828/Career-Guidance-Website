// Simple API test using fetch
async function testAPI() {
  console.log('\n🧪 Testing ALL COLLEGES API (100000 limit)\n');
  
  try {
    // Test 1: All India colleges
    console.log('1️⃣ Fetching ALL India colleges...');
    const res1 = await fetch('http://localhost:5000/api/search-all/all-colleges?search=&limit=100000');
    const data1 = await res1.json();
    
    console.log(`✅ Total Colleges Returned: ${data1.results?.length || 0}`);
    console.log(`📊 Response Total: ${data1.total || 0}`);
    
    if (data1.results && data1.results.length > 0) {
      console.log('\n   Top 5 colleges:');
      data1.results.slice(0, 5).forEach((col, idx) => {
        console.log(`   ${idx + 1}. ${col.college_name} - ${col.state} (${col.college_type})`);
      });
    }
    
    // Test 2: Search engineering
    console.log('\n2️⃣ Searching for "engineering" colleges...');
    const res2 = await fetch('http://localhost:5000/api/search-all/all-colleges?search=engineering&limit=100000');
    const data2 = await res2.json();
    
    console.log(`✅ Engineering Colleges Found: ${data2.results?.length || 0}`);
    
    // Test 3: Nearby colleges
    console.log('\n3️⃣ Finding nearby colleges (200km from Alandi)...');
    const res3 = await fetch('http://localhost:5000/api/search-all/all-nearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: 18.6397,
        longitude: 73.8997,
        radiusKm: 200,
        limit: 100000
      })
    });
    const data3 = await res3.json();
    
    console.log(`✅ Nearby Colleges Found: ${data3.results?.length || 0}`);
    
    if (data3.results && data3.results.length > 0) {
      console.log('\n   Top 5 Nearest Colleges:');
      data3.results.slice(0, 5).forEach((col, idx) => {
        const dist = col.distance ? ` - ${col.distance.toFixed(2)}km` : '';
        console.log(`   ${idx + 1}. ${col.college_name}${dist}`);
      });
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ All Colleges: ${data1.results?.length || 0}`);
    console.log(`🔍 Engineering Colleges: ${data2.results?.length || 0}`);
    console.log(`📍 Nearby Colleges (200km): ${data3.results?.length || 0}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
