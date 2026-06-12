const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'extracted_raw_secb');
const files = fs.readdirSync(dirPath);

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('hot water') || line.toLowerCase().includes('hwt')) {
      console.log(`[${file}:${idx+1}] ${line.trim()}`);
    }
  });
});
