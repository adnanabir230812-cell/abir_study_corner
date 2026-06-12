const fs = require('fs');
const path = require('path');

const scratchDir = `C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch`;
const terms = ["Vanderplank", "Victorin", "symplastic", "antagonism", "Narrow brown", "degree of parasitism", "apoplastic", "inocula"];

const files = fs.readdirSync(scratchDir);
console.log(`Searching in ${files.length} files...`);

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (fs.statSync(filePath).isFile() && (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.js'))) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      terms.forEach(term => {
        if (content.toLowerCase().includes(term.toLowerCase())) {
          console.log(`Found term '${term}' in file: ${file}`);
        }
      });
    } catch (e) {}
  }
});
