const fs = require('fs');
const path = require('path');

const brainScratchDir = 'C:\\Users\\Lenovo\\SystemData\\..\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';
// Clean path
const cleanPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';

const keywords = ['thermodynamics', 'eltonian', 'pyramid', 'mixed cropping', 'intercropping', 'ler', 'sundarbans', 'mangrove', 'halophyte'];

const files = fs.readdirSync(cleanPath);

files.forEach(file => {
  if (file.endsWith('.md') || file.endsWith('.txt')) {
    const filePath = path.join(cleanPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const match = keywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()));
      if (match) {
        matches.push({ lineNum: idx + 1, text: line.trim() });
      }
    });
    
    if (matches.length > 0) {
      console.log(`=== Matches in ${file} (Total: ${matches.length}) ===`);
      matches.slice(0, 10).forEach(m => {
        console.log(`  Line ${m.lineNum}: ${m.text}`);
      });
      if (matches.length > 10) {
        console.log(`  ... and ${matches.length - 10} more matches.`);
      }
      console.log();
    }
  }
});
