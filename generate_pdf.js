const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const routeImg = fs.readFileSync('/Users/hdbmm/Documents/Claude/deBeerDash/dubai_to_muscat_route.png').toString('base64');
  const petrolImg = fs.readFileSync('/Users/hdbmm/Documents/Claude/deBeerDash/petrol_stations_route.png').toString('base64');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #222; line-height: 1.5; }
  h1 { color: #1a5276; border-bottom: 3px solid #1a5276; padding-bottom: 10px; font-size: 28px; }
  h2 { color: #2e86c1; margin-top: 35px; font-size: 22px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
  h3 { color: #1a5276; margin-top: 20px; font-size: 17px; }
  table { border-collapse: collapse; width: 100%; margin: 15px 0; font-size: 13px; }
  th { background: #1a5276; color: white; padding: 10px 12px; text-align: left; }
  td { padding: 8px 12px; border-bottom: 1px solid #ddd; }
  tr:nth-child(even) { background: #f4f8fb; }
  .highlight { background: #eaf2f8; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2e86c1; }
  .alert { background: #fdf2e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #e67e22; }
  .recommend { background: #e8f8f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1abc9c; }
  img { max-width: 100%; border: 1px solid #ccc; border-radius: 5px; margin: 10px 0; }
  .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #1a5276, #2e86c1); color: white; border-radius: 10px; margin-bottom: 30px; }
  .header h1 { color: white; border: none; margin: 0; font-size: 32px; }
  .header p { margin: 5px 0 0; font-size: 16px; opacity: 0.9; }
  .page-break { page-break-before: always; }
  .two-col { display: flex; gap: 15px; }
  .two-col > div { flex: 1; }
  .footer { text-align: center; color: #888; font-size: 11px; margin-top: 40px; padding-top: 15px; border-top: 1px solid #ddd; }
</style>
</head>
<body>

<div class="header">
  <h1>Dubai to Oman Trip Planner</h1>
  <p>2 Adults + 2 Kids | March 2026</p>
</div>

<!-- SECTION 1: DRIVING ROUTE -->
<h2>1. Driving Route: Dubai to Muscat</h2>

<div class="highlight">
  <strong>Fastest Route:</strong> 455 km via N1 Highway | <strong>~4 hours 26 minutes</strong><br>
  <em>Note: Route includes tolls and a UAE-Oman border crossing.</em>
</div>

<table>
  <tr><th>Route</th><th>Time</th><th>Distance</th><th>Notes</th></tr>
  <tr><td>Route 1 (via N1)</td><td>4 hr 26 min</td><td>455 km</td><td>Fastest; tolls; border crossing</td></tr>
  <tr><td>Route 2 (via Al Ain - E66 & N1)</td><td>4 hr 37 min</td><td>472 km</td><td>Alternative; avoids road closures</td></tr>
</table>

<h3>Google Maps Route</h3>
<img src="data:image/png;base64,${routeImg}" alt="Dubai to Muscat Route">

<h3>Petrol Stations Along the Way</h3>
<img src="data:image/png;base64,${petrolImg}" alt="Petrol Stations">
<p>Major fuel brands along the route: <strong>ADNOC</strong>, <strong>Emirates</strong>, <strong>ENOC</strong> (UAE side) and <strong>Shell</strong>, <strong>Oman Oil</strong> (Oman side). Stations are well-distributed, especially near Al Ain and along the N1 highway.</p>

<!-- SECTION 2: HOTELS -->
<div class="page-break"></div>
<h2>2. Resort Hotels Near Muscat Airport</h2>
<p>Family-friendly resort options for 2 adults + 2 kids, within easy reach of Muscat International Airport (MCT).</p>

<table>
  <tr><th>Hotel</th><th>Stars</th><th>Distance</th><th>Price/Night</th><th>Rating</th><th>Beach</th><th>Kids Pool</th></tr>
  <tr><td><strong>InterContinental Muscat</strong></td><td>5-star</td><td>15 min</td><td>$130-270</td><td>4.0/5 (#5 in Muscat)</td><td>Yes</td><td>Yes</td></tr>
  <tr><td><strong>Grand Hyatt Muscat</strong></td><td>5-star</td><td>20 min</td><td>$165-230</td><td>4.0/5 (#32)</td><td>Yes (large)</td><td>Yes</td></tr>
  <tr><td><strong>Crowne Plaza Muscat</strong></td><td>4-star</td><td>20-25 min</td><td>$112-240</td><td>4.0/5 (#19)</td><td>Yes</td><td>Yes</td></tr>
  <tr><td><strong>Al Bustan Palace Ritz-Carlton</strong></td><td>5-star</td><td>45 min</td><td>$250-470+</td><td>4.5/5</td><td>Yes</td><td>Yes (6 pools)</td></tr>
</table>

<h3>InterContinental Muscat (Recommended)</h3>
<div class="recommend">
  <strong>Best overall pick</strong> -- Closest to airport (15 min), ranked #5 in Muscat, private beach, 3 pools + kids' pool, playground, supervised childcare. Kids stay free with existing bedding. Airport shuttle available (OMR 29).
</div>

<h3>Grand Hyatt Muscat</h3>
<p>20 min from airport. One of the best private beaches in Muscat. Spacious family layouts, 278 rooms. Highly recommended by family travel blogs. Great pool area.</p>

<h3>Crowne Plaza Muscat (Best Value)</h3>
<div class="highlight">
  <strong>Best value option</strong> -- Ground-floor family rooms with patio and direct lawn access. Double-deck infinity pool. Free daily shuttle to Sultan Qaboos Grand Mosque, Mutrah Souq, and Mall of Oman. From $112/night.
</div>

<h3>Al Bustan Palace, Ritz-Carlton (Premium)</h3>
<p>200-acre beachfront property against Al Hajar mountains. 6 pools including kids' pool. <strong>Ritz Kids program</strong> with splash park, zipline, henna tutorials, Omani culture workshops. The ultimate family luxury stay. Note: 45 min from airport.</p>

<!-- SECTION 3: FLIGHTS -->
<div class="page-break"></div>
<h2>3. Flights: Muscat to Thailand</h2>
<p>For 2 adults + 1 child + 1 infant</p>

<div class="alert">
  <strong>Travel Advisory (March 2026):</strong> Regional flight disruptions are affecting some airlines. Qatar Airways is suspended (Doha airspace closed). Emirates is operating at ~60% capacity from Dubai. <strong>Oman Air and SalamAir are operating normally from Muscat</strong> with extra flights added March 8-15.
</div>

<h3>Direct (Nonstop) Flights: Muscat to Bangkok (BKK)</h3>
<p>Up to <strong>16 nonstop flights per week</strong> (~2 per day) on Boeing 787 Dreamliners.</p>

<h4>Oman Air</h4>
<table>
  <tr><th>Flight</th><th>Departs MCT</th><th>Arrives BKK</th><th>Duration</th></tr>
  <tr><td>WY811</td><td>03:20</td><td>12:35</td><td>6h 15m</td></tr>
  <tr><td>WY815</td><td>09:05</td><td>17:45</td><td>5h 40m</td></tr>
  <tr><td>WY817</td><td>22:05</td><td>06:45+1</td><td>5h 40m</td></tr>
</table>

<h4>SalamAir</h4>
<table>
  <tr><th>Flight</th><th>Departs MCT</th><th>Arrives BKK</th><th>Duration</th></tr>
  <tr><td>OV463</td><td>22:30</td><td>07:30+1</td><td>~6h 00m</td></tr>
  <tr><td>OV465</td><td>~13:45</td><td>~22:10</td><td>~5h 26m</td></tr>
</table>

<h3>Estimated Pricing (Round-Trip)</h3>
<table>
  <tr><th>Passenger</th><th>SalamAir (Budget)</th><th>Oman Air (Full Service)</th></tr>
  <tr><td>2 Adults</td><td>$676-780</td><td>$810+</td></tr>
  <tr><td>1 Child</td><td>$260-585</td><td>$405-810</td></tr>
  <tr><td>1 Infant</td><td>$34-78</td><td>$42-81</td></tr>
  <tr style="font-weight:bold; background:#eaf2f8;"><td>Total Estimate</td><td>$970-1,443</td><td>$1,258-1,701+</td></tr>
</table>

<h3>Connecting Flight Options (1 Stop)</h3>
<table>
  <tr><th>Airline</th><th>Hub</th><th>Status</th></tr>
  <tr><td>Emirates</td><td>Dubai (DXB)</td><td>Resuming, reduced schedule</td></tr>
  <tr><td>Qatar Airways</td><td>Doha (DOH)</td><td>Suspended</td></tr>
  <tr><td>Etihad</td><td>Abu Dhabi (AUH)</td><td>Restarting</td></tr>
  <tr><td>Air India</td><td>DEL/BOM</td><td>Operating (~$137/adult one-way)</td></tr>
</table>

<div class="recommend">
  <strong>Recommendation:</strong> Book <strong>Oman Air</strong> for the best balance of reliability, comfort (787 Dreamliner), and direct service. <strong>SalamAir</strong> is the budget-friendly alternative. Both are operating normally from Muscat. Book directly at omanair.com or salamair.com.
</div>

<h3>Other Thai Destinations</h3>
<p><strong>Phuket, Chiang Mai, Krabi:</strong> No direct flights from Muscat. Fly to Bangkok first, then connect domestically via Thai AirAsia, Thai VietJet, or Bangkok Airways (domestic flights from ~$39-75).</p>

<div class="footer">
  <p>Generated March 2026 | Prices are approximate and subject to availability<br>
  Data sourced from TripAdvisor, Booking.com, KAYAK, Skyscanner, Google Flights, airline websites</p>
</div>

</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.pdf({
    path: '/Users/hdbmm/Documents/Claude/deBeerDash/oman_trip_plan.pdf',
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    printBackground: true,
  });
  await browser.close();
  console.log('PDF generated successfully!');
})();
