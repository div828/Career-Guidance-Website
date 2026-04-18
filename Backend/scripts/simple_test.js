
(async () => {
  try {
    console.log('Testing search API...\n');
    
    // Test 1: Direct API test without encoding issues
    console.log('1️⃣ Fetching search results for "IIT BOMBAY"...');
    const url1 = new URL('http://localhost:5000/search');
    url1.searchParams.append('query', 'IIT BOMBAY');
    url1.searchParams.append('limit', '20');
    
    console.log(`   URL: ${url1.toString()}`);
    
    const response1 = await fetch(url1.toString(), { timeout: 5000 });
    console.log(`   Response status: ${response1.status}`);
    console.log(`   Response headers:`, Object.fromEntries(response1.headers));
    
    const text1 = await response1.text();
    console.log(`   Response length: ${text1.length} bytes`);
    console.log(`   First 200 chars:`, text1.substring(0, 200));
    
    if (text1.startsWith('{')) {
      const data1 = JSON.parse(text1);
      console.log(`   ✅ Results found: ${data1.results?.length || 0}`);
      if (data1.results?.length > 0) {
        console.log(`   Top result: ${data1.results[0].college_name}`);
      }
    } else {
      console.log(`   ❌ Not JSON: ${text1.substring(0, 100)}`);
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit(0);
})();
