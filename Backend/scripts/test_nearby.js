(async () => {
  console.log('🧪 Testing Nearby Colleges Search (Alandi Location)\n');

  // Alandi coordinates
  const alandi = { lat: 18.6397, lng: 73.8997 };
  
  const response = await fetch('http://localhost:5000/api/search/smart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: alandi.lat,
      longitude: alandi.lng,
      radiusKm: 80,
      limit: 15
    })
  });
  
  const data = await response.json();
  
  console.log(`✅ Status: ${response.status}`);
  console.log(`📊 Found ${data.results?.length || 0} nearby colleges\n`);
  
  if (data.results?.length > 0) {
    console.log('Top 10 Nearby Colleges:');
    data.results.slice(0, 10).forEach((c, i) => {
      const dist = c.distance ? ` - ${c.distance} km away` : '';
      console.log(`  ${i+1}. ${c.college_name} (${c.college_type})${dist}`);
    });
  }
  
  // Verify MITAOE is there
  const hasMitaoe = data.results?.some(c => c.college_name?.includes('MIT') && c.college_name?.includes('Alandi'));
  console.log('\n✅ MITAOE Present in Results:', hasMitaoe ? 'YES ✨' : 'NO');
  
  process.exit(0);
})();
