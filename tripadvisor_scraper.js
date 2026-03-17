const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SAVE_DIR = '/Users/hdbmm/Documents/Claude/deBeerDash';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeTripadvisorPage(page, url, screenshotName) {
  console.log(`\n--- Navigating to: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(3000);

    // Take screenshot
    await page.screenshot({
      path: path.join(SAVE_DIR, screenshotName),
      fullPage: false
    });
    console.log(`Screenshot saved: ${screenshotName}`);

    // Try to extract attraction cards
    const attractions = await page.evaluate(() => {
      const results = [];

      // Try multiple selectors for attraction listings
      const selectors = [
        '[data-automation="attractionCard"]',
        '.attraction_element',
        '.result-card',
        '[data-test-target="attraction-card"]',
        'section[data-automation]',
        '.EIMel',  // Common TripAdvisor class
        '.alPVI',
        '.jemSU',
        'article',
        '.geCHk',
      ];

      let cards = [];
      for (const sel of selectors) {
        const found = document.querySelectorAll(sel);
        if (found.length > 0) {
          cards = found;
          console.log(`Found ${found.length} items with selector: ${sel}`);
          break;
        }
      }

      // If no specific cards found, try generic approach
      if (cards.length === 0) {
        // Get all links that look like attraction links
        const links = document.querySelectorAll('a[href*="Attraction_Review"]');
        links.forEach(link => {
          const text = link.textContent.trim();
          if (text.length > 3 && text.length < 200) {
            results.push({
              name: text,
              href: link.href,
              type: 'link-extracted'
            });
          }
        });
      } else {
        cards.forEach(card => {
          const nameEl = card.querySelector('h3, h2, [class*="title"], [class*="name"], a[href*="Attraction"]');
          const ratingEl = card.querySelector('[class*="rating"], [class*="bubble"], svg[aria-label]');
          const typeEl = card.querySelector('[class*="tag"], [class*="category"], [class*="type"]');
          const reviewEl = card.querySelector('[class*="review"], [class*="count"]');

          results.push({
            name: nameEl ? nameEl.textContent.trim() : card.textContent.trim().substring(0, 100),
            rating: ratingEl ? (ratingEl.getAttribute('aria-label') || ratingEl.textContent.trim()) : '',
            type: typeEl ? typeEl.textContent.trim() : '',
            reviews: reviewEl ? reviewEl.textContent.trim() : '',
            source: 'card-extracted'
          });
        });
      }

      return results;
    });

    // Also get the full page text for analysis
    const pageText = await page.evaluate(() => {
      return document.body.innerText.substring(0, 8000);
    });

    return { attractions, pageText, url };
  } catch (err) {
    console.error(`Error on ${url}: ${err.message}`);
    return { attractions: [], pageText: '', url, error: err.message };
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  });

  const page = await context.newPage();
  const allResults = {};

  // 1. Things to do near Chatrium Grand Bangkok
  const r1 = await scrapeTripadvisorPage(
    page,
    'https://www.tripadvisor.com/AttractionsNear-g293916-d25055803-Chatrium_Grand_Bangkok-Bangkok.html',
    'tripadvisor_near_chatrium.png'
  );
  allResults['near_chatrium'] = r1;

  await delay(2000);

  // 2. Top attractions in Bangkok
  const r2 = await scrapeTripadvisorPage(
    page,
    'https://www.tripadvisor.com/Attractions-g293916-Activities-Bangkok.html',
    'tripadvisor_top_attractions.png'
  );
  allResults['top_attractions'] = r2;

  await delay(2000);

  // 3. Things to do with kids in Bangkok
  const r3 = await scrapeTripadvisorPage(
    page,
    'https://www.tripadvisor.com/Attractions-g293916-Activities-zft11306-Bangkok.html',
    'tripadvisor_kids_activities.png'
  );
  allResults['kids_activities'] = r3;

  await delay(2000);

  // 4. Individual attraction pages for ratings
  const attractionPages = [
    { url: 'https://www.tripadvisor.com/Attraction_Review-g293916-d311043-Reviews-Wat_Pho-Bangkok.html', name: 'wat_pho' },
    { url: 'https://www.tripadvisor.com/Attraction_Review-g293916-d317496-Reviews-Wat_Arun_Ratchawararam_Ratchawaramahawihan-Bangkok.html', name: 'wat_arun' },
    { url: 'https://www.tripadvisor.com/Attraction_Review-g293916-d2723479-Reviews-Asiatique_The_Riverfront-Bangkok.html', name: 'asiatique' },
    { url: 'https://www.tripadvisor.com/Attraction_Review-g293916-d1200537-Reviews-SEA_LIFE_Bangkok_Ocean_World-Bangkok.html', name: 'sealife' },
    { url: 'https://www.tripadvisor.com/Attraction_Review-g293916-d455818-Reviews-Safari_World-Bangkok.html', name: 'safari_world' },
  ];

  for (const ap of attractionPages) {
    const r = await scrapeTripadvisorPage(page, ap.url, `tripadvisor_${ap.name}.png`);
    allResults[ap.name] = r;
    await delay(2000);
  }

  // Save all extracted data
  fs.writeFileSync(
    path.join(SAVE_DIR, 'tripadvisor_results.json'),
    JSON.stringify(allResults, null, 2)
  );
  console.log('\nAll results saved to tripadvisor_results.json');

  // Print summary
  for (const [key, val] of Object.entries(allResults)) {
    console.log(`\n=== ${key} ===`);
    if (val.attractions && val.attractions.length > 0) {
      val.attractions.slice(0, 10).forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.name} | Rating: ${a.rating || 'N/A'} | ${a.type || ''}`);
      });
    }
    if (val.pageText) {
      // Extract key info from page text
      const lines = val.pageText.split('\n').filter(l => l.trim().length > 0);
      const relevantLines = lines.filter(l =>
        l.includes('review') || l.includes('Rating') || l.includes('of 5') ||
        l.includes('#') || l.includes('star') || l.includes('things to do')
      ).slice(0, 5);
      if (relevantLines.length > 0) {
        console.log('  Page highlights:');
        relevantLines.forEach(l => console.log(`    - ${l.substring(0, 150)}`));
      }
    }
  }

  await browser.close();
  console.log('\nDone!');
}

main().catch(console.error);
