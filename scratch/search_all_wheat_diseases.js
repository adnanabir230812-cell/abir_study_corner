const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'extracted_raw_secb');
const files = fs.readdirSync(dirPath);

console.log('--- Searching for Wheat Diseases ---');
files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const l = line.toLowerCase();
    if (l.includes('wheat') && (l.includes('disease') || l.includes('causal') || l.includes('rust') || l.includes('smut') || l.includes('blight') || l.includes('blast') || l.includes('puccinia') || l.includes('bipolaris') || l.includes('ustilago'))) {
      console.log(`[${file}:${idx+1}] ${line.trim()}`);
    }
  });
});
