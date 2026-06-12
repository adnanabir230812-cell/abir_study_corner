const fs = require('fs');
const path = require('path');

const brainScratchDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\c03969e7-c54a-4aae-99db-2f093200a49e\\scratch';

if (!fs.existsSync(brainScratchDir)) {
  console.log(`Brain scratch directory not found: ${brainScratchDir}`);
  process.exit(1);
}

const keywords = ['3203', 'Ecology'];
const files = fs.readdirSync(brainScratchDir);

console.log(`Searching all files in ${brainScratchDir} for keywords: ${keywords.join(', ')}\n`);

files.forEach(file => {
  if (file.endsWith('.md') || file.endsWith('.txt')) {
    const filePath = path.join(brainScratchDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let matches = [];
    
    lines.forEach((line, idx) => {
      const found = keywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()));
      if (found) {
        matches.push({ lineNum: idx + 1, text: line.trim() });
      }
    });
    
    if (matches.length > 0) {
      console.log(`=== Matches in ${file} (Total: ${matches.length}) ===`);
      matches.slice(0, 15).forEach(m => {
        console.log(`  Line ${m.lineNum}: ${m.text}`);
      });
      if (matches.length > 15) {
        console.log(`  ... and ${matches.length - 15} more matches.`);
      }
      console.log();
    }
  }
});
