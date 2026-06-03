const fs = require('fs');
const path = require('path');

const dirA = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\toppr\\extracted_raw';
const files = fs.readdirSync(dirA);

files.forEach(file => {
  const content = fs.readFileSync(path.join(dirA, file), 'utf8');
  if (content.toLowerCase().includes('sanitation') || content.toLowerCase().includes('tetrahedron') || content.toLowerCase().includes('varieties break down') || content.toLowerCase().includes('climate-smart')) {
    console.log(`\n================== Found in Section A: ${file} ==================`);
    const idx = content.toLowerCase().indexOf('sanitation');
    const start = Math.max(0, idx - 200);
    console.log(content.substring(start, start + 2500));
  }
});
