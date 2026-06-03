const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'seed_extension_3205.js');
const code = fs.readFileSync(file, 'utf8');

const lines = code.split('\n');
console.log('Searching for generic labels like "Description:" or "Definition:" in seed_extension_3205.js...');

lines.forEach((line, index) => {
  if (line.match(/description|definition/i)) {
    // Only print lines that are inside text contents
    if (line.includes(':') || line.includes('*') || line.includes('_')) {
      console.log(`Line ${index + 1}: "${line.trim()}"`);
    }
  }
});
