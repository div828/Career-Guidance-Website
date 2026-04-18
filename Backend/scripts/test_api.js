(async () => {
  const url = new URL('http://localhost:5000/api/search');
  url.searchParams.append('query', 'IIT BOMBAY');
  url.searchParams.append('limit', '5');
  
  console.log('Testing correct API URL: /api/search\n');
  const response = await fetch(url.toString());
  const data = await response.json();
  
  console.log('✅ Status:', response.status);
  console.log('📊 Results found:', data.results?.length || 0);
  if (data.results?.length > 0) {
    data.results.forEach((c, i) => {
      console.log(`  ${i+1}. ${c.college_name} (${c.college_type})`);
    });
  }
  
  // Test MITAOE
  console.log('\nTesting search for MIT Academy...');
  const url2 = new URL('http://localhost:5000/api/search');
  url2.searchParams.append('query', 'MIT Academy');
  url2.searchParams.append('limit', '5');
  
  const response2 = await fetch(url2.toString());
  const data2 = await response2.json();
  
  console.log('📊 Results found:', data2.results?.length || 0);
  if (data2.results?.length > 0) {
    data2.results.forEach((c, i) => {
      console.log(`  ${i+1}. ${c.college_name} at (${c.latitude}, ${c.longitude})`);
    });
  }
  
  // Test "Show All India" (no query)
  console.log('\nTesting Show All India (top 5 colleges)...');
  const url3 = new URL('http://localhost:5000/api/search');
  url3.searchParams.append('limit', '5');
  
  const response3 = await fetch(url3.toString());
  const data3 = await response3.json();
  
  console.log('📊 Top 5 colleges (should be government first):');
  if (data3.results?.length > 0) {
    data3.results.forEach((c, i) => {
      console.log(`  ${i+1}. ${c.college_name} (${c.college_type}) - Rating: ${c.rating}`);
    });
  }
  
  process.exit(0);
})();
