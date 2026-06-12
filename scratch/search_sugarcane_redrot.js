const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'extracted_raw_secb');
const files = fs.readdirSync(dirPath);

files.forEach(file => {
  if (file.includes('Sugarcane') || file.includes('Rezaul') || file.includes('Symptoms')) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log(`--- Matches in ${file} ---`);
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes('red rot') || line.toLowerCase().includes('falcatum')) {
        console.log(`  [L${idx+1}] ${line.trim()}`);
      }
    });
  }
});
