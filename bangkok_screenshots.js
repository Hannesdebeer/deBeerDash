const { chromium } = require('playwright');
const path = require('path');

const SAVE_DIR = '/Users/hdbmm/Documents/Claude/deBeerDash';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  });
  const page = await context.newPage();

  const pages = [
    {
      url: 'https://www.chatrium.com/grandbangkok/experience/travel',
      name: 'chatrium_grand_nearby.png',
      wait: 3000
    },
    {
      url: 'https://www.klook.com/en-US/activity/12514-chao-phraya-hop-on-hop-off-day-pass-bangkok/',
      name: 'chao_phraya_boat.png',
      wait: 3000
    },
    {
      url: 'https://www.visitsealife.com/bangkok/en/',
      name: 'sealife_bangkok.png',
      wait: 3000
    },
    {
      url: 'https://kingpowermahanakhon.co.th/skywalk/',
      name: 'mahanakhon_skywalk.png',
      wait: 3000
    },
  ];

  for (const p of pages) {
    try {
      console.log(`Capturing: ${p.url}`);
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await delay(p.wait);
      await page.screenshot({ path: path.join(SAVE_DIR, p.name), fullPage: false });
      console.log(`  Saved: ${p.name}`);
    } catch (err) {
      console.log(`  Error on ${p.name}: ${err.message}`);
    }
    await delay(1000);
  }

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
