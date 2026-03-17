const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    locale: 'en-US',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  const page = await context.newPage();

  console.log('=== Step 1: Opening Google Maps directions from Dubai to Muscat ===');

  // Use hl=en to force English
  await page.goto('https://www.google.com/maps/dir/Dubai,+UAE/Muscat,+Oman/?hl=en', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  console.log('Waiting for map to load...');
  await page.waitForTimeout(8000);

  // Try to dismiss any cookie/consent banners
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => '');
      if (text && (text.includes('Accept') || text.includes('Agree') || text.includes('Got it') || text.includes('Reject'))) {
        await btn.click();
        console.log(`Clicked button: ${text.trim()}`);
        await page.waitForTimeout(2000);
        break;
      }
    }
  } catch (e) {}

  await page.waitForTimeout(3000);

  // Extract route information
  console.log('=== Extracting route information ===');
  let routeInfo = '';
  try {
    const pageContent = await page.textContent('body');

    // Look for patterns like "4 hr 20 min" and "463 km"
    const timeMatches = pageContent.match(/(\d+\s*h(?:r|ours?)?\s*\d*\s*min(?:utes?)?)/gi);
    const distMatches = pageContent.match(/(\d[\d,\.]*\s*km)/gi);

    // Also check for Arabic numerals/text patterns
    const arabicTimeMatch = pageContent.match(/(\d+)\s*(?:ساعات?|ساعة)\s*(\d+)\s*(?:دقيقة|دقائق)/);
    const arabicDistMatch = pageContent.match(/(\d[\d,\.]*)\s*كم/);

    if (timeMatches) {
      timeMatches.forEach(t => console.log('Driving time: ' + t));
      routeInfo += 'Time: ' + timeMatches[0] + '\n';
    } else if (arabicTimeMatch) {
      const hours = arabicTimeMatch[1];
      const mins = arabicTimeMatch[2];
      console.log(`Driving time: ${hours} hr ${mins} min (translated from Arabic)`);
      routeInfo += `Time: ${hours} hr ${mins} min\n`;
    }

    if (distMatches) {
      distMatches.forEach(d => console.log('Distance: ' + d));
      routeInfo += 'Distance: ' + distMatches[0] + '\n';
    } else if (arabicDistMatch) {
      console.log(`Distance: ${arabicDistMatch[1]} km (translated from Arabic)`);
      routeInfo += `Distance: ${arabicDistMatch[1]} km\n`;
    }

    // Get route options
    const routePanels = await page.$$('[data-trip-index]');
    for (const panel of routePanels) {
      const text = await panel.textContent().catch(() => '');
      if (text) {
        console.log('Route option: ' + text.substring(0, 300));
      }
    }
  } catch (e) {
    console.log('Could not extract route info: ' + e.message);
  }

  // Take screenshot
  await page.screenshot({
    path: '/Users/hdbmm/Documents/Claude/deBeerDash/dubai_to_muscat_route.png',
    fullPage: false,
  });
  console.log('\nScreenshot saved: dubai_to_muscat_route.png');

  // === Step 2: Petrol stations ===
  console.log('\n=== Step 2: Searching for petrol stations along the route ===');

  await page.goto('https://www.google.com/maps/search/petrol+station+Dubai+to+Muscat/@23.5,57.0,8z/?hl=en', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  console.log('Waiting for petrol stations map to load...');
  await page.waitForTimeout(8000);

  // Dismiss banners again
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => '');
      if (text && (text.includes('Accept') || text.includes('Agree') || text.includes('Got it'))) {
        await btn.click();
        await page.waitForTimeout(2000);
        break;
      }
    }
  } catch (e) {}

  await page.waitForTimeout(3000);

  await page.screenshot({
    path: '/Users/hdbmm/Documents/Claude/deBeerDash/petrol_stations_route.png',
    fullPage: false,
  });
  console.log('Screenshot saved: petrol_stations_route.png');

  // List petrol station names
  try {
    const results = await page.$$('a[aria-label]');
    const stationNames = new Set();
    for (const r of results) {
      const label = await r.getAttribute('aria-label').catch(() => null);
      if (label && label.length > 3 && label.length < 100 && !label.includes('menu') && !label.includes('Input')) {
        stationNames.add(label.trim());
        if (stationNames.size >= 15) break;
      }
    }
    if (stationNames.size > 0) {
      console.log('\nPetrol stations found on map:');
      stationNames.forEach(name => console.log('  - ' + name));
    }
  } catch (e) {
    console.log('Could not list stations: ' + e.message);
  }

  if (routeInfo) {
    console.log('\n=== ROUTE INFORMATION SUMMARY ===');
    console.log(routeInfo);
  }

  await browser.close();
  console.log('\nDone!');
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
