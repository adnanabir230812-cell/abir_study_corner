const fs = require('fs');
const path = require('path');

const term = process.argv[2];
if (!term) {
  console.log('Please provide a search term. Usage: node scripts/find_in_files.js <term>');
  process.exit(1);
}

const dirA = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\extracted_raw';
const dirB = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\extracted_raw_secb';

function searchInDir(searchDir, term) {
  console.log(`\n=== Searching for "${term}" in ${path.basename(searchDir)} ===`);
  const files = fs.readdirSync(searchDir);
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(searchDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(term.toLowerCase())) {
          console.log(`${file}:L${idx+1}: ${line.trim().substring(0, 150)}`);
        }
      });
    }
  });
}

searchInDir(dirA, term);
searchInDir(dirB, term);

