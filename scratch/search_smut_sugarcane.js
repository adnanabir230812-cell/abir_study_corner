const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'extracted_raw_secb', '2. Wheat Maize Barley Jute Cotton Sugarcane Groundnut.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log('--- Matches for Smut of Sugarcane ---');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('whip') || (line.toLowerCase().includes('smut') && line.toLowerCase().includes('sugarcane'))) {
      console.log(`  [L${idx+1}] ${line.trim()}`);
    }
  });
}
