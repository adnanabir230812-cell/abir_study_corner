const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ecology_ocr_raw.txt');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const matches = [];
  lines.forEach((line, idx) => {
    const l = line.toLowerCase();
    if (l.includes('product') || l.includes('npp') || l.includes('gpp') || l.includes('trophic') || l.includes('eutroph') || l.includes('dead-zone') || l.includes('dead zone')) {
      matches.push(idx);
    }
  });

  // Print context for each match
  matches.forEach(idx => {
    console.log(`=========================================`);
    console.log(`Match at line ${idx + 1}:`);
    console.log(`=========================================`);
    const start = Math.max(0, idx - 4);
    const end = Math.min(lines.length - 1, idx + 4);
    for (let i = start; i <= end; i++) {
      const prefix = (i === idx) ? '>>> ' : '    ';
      console.log(`${prefix}[Line ${i + 1}] ${lines[i]}`);
    }
    console.log('\n');
  });
} else {
  console.log("OCR file not found");
}
