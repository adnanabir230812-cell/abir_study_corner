const fs = require('fs');
const path = require('path');

const dirA = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\extracted_raw';
const files = fs.readdirSync(dirA);

files.forEach(file => {
  const content = fs.readFileSync(path.join(dirA, file), 'utf8');
  if (content.toLowerCase().includes('break') || content.toLowerCase().includes('resistant') || content.toLowerCase().includes('variet')) {
    console.log(`\n================== Found in Section A: ${file} ==================`);
    // Find index of 'break' or 'resistance'
    let idx = content.toLowerCase().indexOf('break');
    if (idx === -1) idx = content.toLowerCase().indexOf('resist');
    const start = Math.max(0, idx - 200);
    console.log(content.substring(start, start + 1500));
  }
});
