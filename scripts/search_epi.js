const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\extracted_raw\\2.2 Epidemiology.md';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const terms = ['monocyclic', 'polycyclic', 'vander plank', 'tetrahedron', 'triangle', 'gradient', 'temperature', 'moisture'];

terms.forEach(term => {
  console.log(`=== Matches for "${term}" ===`);
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      console.log(`L${idx+1}: ${line.trim().substring(0, 120)}`);
    }
  });
});
