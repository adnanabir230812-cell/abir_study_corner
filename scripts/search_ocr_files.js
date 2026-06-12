const fs = require('fs');
const path = require('path');

const brainScratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
const query = process.argv[2];

if (!query) {
  console.log("Usage: node search_ocr_files.js <query_string>");
  process.exit(0);
}

console.log(`Searching for "${query}" in ${brainScratchDir}...\n`);

if (!fs.existsSync(brainScratchDir)) {
  console.error("Brain scratch directory not found!");
  process.exit(1);
}

const files = fs.readdirSync(brainScratchDir);
files.forEach(file => {
  if (file.endsWith('.md') || file.endsWith('.txt')) {
    const filePath = path.join(brainScratchDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let fileMatches = 0;
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        if (fileMatches === 0) {
          console.log(`=== Matches in ${file} ===`);
        }
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
        fileMatches++;
      }
    });
    if (fileMatches > 0) {
      console.log(`Found ${fileMatches} matches in ${file}\n`);
    }
  }
});
