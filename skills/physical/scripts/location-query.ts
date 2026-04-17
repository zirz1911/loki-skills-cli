import { $ } from 'bun';

async function fetchFile(filename: string): Promise<string> {
  return $`gh api repos/zirz1911/Paji-Location/contents/${filename} --jq '.content' | base64 -d`.text();
}

// current.csv
const csv = await fetchFile('current.csv');
const lines = csv.trim().split('\n');
if (lines.length < 2) { console.log('No location data.'); process.exit(0); }

const [lat, lon, address, timestamp, battery, accuracy] = lines[1].split(',');
console.log(`lat = ${lat}`);
console.log(`lon = ${lon}`);
console.log(`address = ${address || 'unknown'}`);
console.log(`timestamp = ${timestamp}`);
console.log(`battery = ${battery ? battery + '%' : 'unknown'}`);
console.log(`accuracy = ${accuracy ? accuracy + 'm' : 'unknown'}`);

// history.csv — time at current location
console.log('---TIME_AT_LOCATION---');
try {
  const history = await fetchFile('history.csv');
  const rows = history.trim().split('\n').slice(1); // skip header
  const current_address = address.trim();

  const here = rows
    .map(r => r.split(','))
    .filter(cols => cols[2]?.trim() === current_address)
    .map(cols => new Date(cols[3]?.trim()))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (here.length >= 2) {
    const first = here[0];
    const last = here[here.length - 1];
    const hours = ((last.getTime() - first.getTime()) / 3600000).toFixed(1);
    console.log(`first_seen = ${first.toISOString()}`);
    console.log(`last_seen = ${last.toISOString()}`);
    console.log(`hours_here = ${hours}`);
    console.log(`records = ${here.length}`);
  } else {
    console.log(`hours_here = 0`);
  }
} catch {
  console.log(`hours_here = unknown`);
}
