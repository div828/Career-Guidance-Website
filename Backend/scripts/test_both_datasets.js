(async () => {
  console.log('🧪 Testing Nearby Colleges from BOTH Datasets\n');

  // Test: Find all nearby colleges for Alandi (from both datasets)
  console.log('📍 Finding ALL nearby colleges for Alandi (18.6397°N, 73.8997°E)...\n');
  
  const response = await fetch('http://localhost:5000/api/search-all/all-nearby', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: 18.6397,
      longitude: 73.8997,
      radiusKm: 100,
      limit: 10000
    })
  });

  const data = await response.json();

  console.log(`✅ Status: ${response.status}`);
  console.log(`📊 Total Colleges Found: ${data.total}`);
  console.log(`📚 From colleges_directory: ${data.sources?.directory} colleges`);
  console.log(`📚 From maharashtra dataset: ${data.sources?.maharashtra} colleges`);
  console.log(`📏 Search Radius: ${data.radius}km\n`);

  // Group by type
  const byType = {};
  const bySource = {};
  
  data.results.forEach(c => {
    byType[c.college_type] = (byType[c.college_type] || 0) + 1;
    bySource[c.source] = (bySource[c.source] || 0) + 1;
  });

  console.log('📊 Colleges by Type:');
  Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });

  console.log('\n📊 Colleges by Source:');
  Object.entries(bySource).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count}`);
  });

  console.log('\n🏆 Top 15 Nearby Colleges (sorted by distance):');
  data.results.slice(0, 15).forEach((c, i) => {
    const dist = c.distance ? ` (${c.distance}km)` : '(no dist)';
    const source = c.source === 'maharashtra' ? '[MH]' : '[ALL-INDIA]';
    console.log(`  ${i+1}. ${c.college_name.substring(0, 50)}... (${c.college_type}) ${dist} ${source}`);
  });

  console.log('\n✅ Combined dataset test completed!');
  process.exit(0);
})();
